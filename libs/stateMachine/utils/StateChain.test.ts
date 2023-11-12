import { DynamodbCapability } from '../../aws/dynamodb'
import { LambdaCapability } from '../../aws/lambda'
import { ApplyCapabilities } from '../types/ApplyCapabilities.type'
import { StateChain } from './StateChain'
import { Capability } from './Capability'
import { Pass, Choice, Fail, Succeed } from "../../../serverless.types";

const resources = {
  fetchUserData: {
    name: 'fetchUserDataLambda',
    resource: (input: { userId: string }) =>
      Promise.resolve({ userId: input.userId }),
  },
}

const prefix = `arn:aws:lambda:\${aws:region}:${process.env.ACCOUNT_ID}:function:\${self:service}-offline`

describe('StateChain', () => {
  describe('addState', () => {
    it('should correctly add a generic state', () => {
      const chain = new StateChain(resources)
      chain.addState('endState', { Type: 'Succeed' })

      const actual = chain.states[0]
      const expected = {
        stateName: 'endState',
        stateDetails: { Type: 'Succeed' },
      }

      expect(actual).toEqual(expected)
    })
  })

  describe('getStartingStateName', () => {
    it('should return the stateName of the first state', () => {
      const chain = new StateChain(resources)
      chain.addState('initialState', { Type: 'Succeed' })
      chain.addState('secondState', { Type: 'Task', Resource: 'someResource' })

      const actual = chain.getStartingStateName()
      expect(actual).toEqual('initialState')
    })

    it('should return empty string if there are no states', () => {
      const resources = {}
      const chain = new StateChain(resources)

      const actual = chain.getStartingStateName()
      expect(actual).toBe('')
    })
  })

  describe('getTaskToResourceMap', () => {
    it('should return a mapping of task state names to mock AWS Lambda ARN', () => {
      const resources = {
        fetchUserData: {
          name: 'fetchUserDataLambda',
          resource: (input: { userId: string }) =>
            Promise.resolve({ userId: input.userId }),
        },
        saveUserData: {
          name: 'saveUserDataLambda',
          resource: (input: { data: string }) =>
            Promise.resolve({ input, output: true }),
        },
      }
      const chain = new StateChain(resources)
      chain.addState('fetchUserData', {
        Type: 'Task',
        Resource: {
          'Fn::GetAtt': ['fetchUserDataLambda', 'Arn'],
        },
      })
      chain.addState('saveUserData', {
        Type: 'Task',
        Resource: {
          'Fn::GetAtt': ['saveUserDataLambda', 'Arn'],
        },
      })

      const actual = chain.getTaskToResourceMap()
      const expected = {
        fetchUserData: `${prefix}-fetchUserDataLambda`,
        saveUserData: `${prefix}-saveUserDataLambda`,
      }
      expect(actual).toEqual(expected)
    })

    it('should omit non-task states from the mapping', () => {
      const chain = new StateChain(resources)
      chain.addState('initialState', { Type: 'Succeed' })
      chain.addState('fetchUserData', {
        Type: 'Task',
        Resource: {
          'Fn::GetAtt': ['fetchUserDataLambda', 'Arn'],
        },
      })
      const actual = chain.getTaskToResourceMap()
      const expected = {
        fetchUserData: `${prefix}-fetchUserDataLambda`,
      }
      expect(actual).toEqual(expected)
    })

    it('should return an empty object if there are no task states', () => {
      const resources = {}
      const chain = new StateChain(resources)
      chain.addState('initialState', { Type: 'Succeed' })

      const actual = chain.getTaskToResourceMap()
      expect(actual).toEqual({})
    })
  })

  describe('build', () => {
    it('should correctly build the state machine states', () => {
      const resources = {}
      const chain = new StateChain(resources)
      chain.addState('firstState', { Type: 'Pass' })
      chain.addState('secondState', { Type: 'Pass', Next: 'explicitNextState' }) // has explicit 'Next'
      chain.addState('explicitNextState', { Type: 'Pass' })
      chain.addState('endState', { Type: 'Succeed' })

      const actual = chain.build()
      const expected = {
        firstState: { Type: 'Pass', Next: 'secondState' },
        secondState: { Type: 'Pass', Next: 'explicitNextState' },
        explicitNextState: { Type: 'Pass', Next: 'endState' },
        endState: { Type: 'Succeed' },
      }
      expect(actual).toEqual(expected)
    })

    it('should not set Next property for Fail, Succeed, Choice or states with End: true', () => {
      const resources = {}
      const chain = new StateChain(resources)
      chain.addPassState('passState', { })
      chain.addChoiceState('choiceState', { Choices: [] })
      chain.addFailState('failState', {  })
      chain.addSucceedState('succeedState')
      chain.addPassState('endState', { End: true })

      const actual = chain.build()
      expect((actual.passState as Pass).Next).toBe('choiceState')
      expect((actual.choiceState as Choice)['Next']).toBeUndefined()
      expect((actual.failState as Fail)['Next']).toBeUndefined()
      expect((actual.succeedState as Succeed)['Next']).toBeUndefined()
      expect((actual.endState as Pass).Next).toBeUndefined()
    })

    it('should return an empty object if there are no states', () => {
      const resources = {}
      const chain = new StateChain(resources)
      const actual = chain.build()
      expect(actual).toEqual({})
    })
  })

  describe('addChain', () => {
    it('should correctly concatenate states from another chain', () => {
      const resources = {}
      const chainA = new StateChain(resources)
      const chainB = new StateChain(resources)

      chainA.addState('stateA', { Type: 'Pass' })
      chainB.addState('stateB', { Type: 'Pass' })

      chainA.addChain('chainB', chainB)
      const actual = chainA.build()
      const expected = {
        stateA: { Type: 'Pass', Next: 'stateB' },
        stateB: { Type: 'Pass' },
      }
      expect(actual).toEqual(expected)
    })

    it('should handle adding an empty chain', () => {
      const resources = {}
      const chainA = new StateChain(resources)
      const chainB = new StateChain(resources)

      chainA.addState('stateA', { Type: 'Pass' })
      chainA.addChain('chainB', chainB)

      const actual = chainA.build()
      const expected = {
        stateA: { Type: 'Pass' },
      }
      expect(actual).toEqual(expected)
    })
  })

  describe('addChoiceState', () => {
    it('should add a choice state with the given name and details', () => {
      type StateNames = 'State1' | 'State2';
      const stateToResourceMap = {}; // You can put an appropriate initialization value here
      const stateChain = new StateChain<StateNames, typeof stateToResourceMap>(stateToResourceMap);

      const stateName: StateNames = 'State1';
      const choiceStateDetails = {
        Choices: [
          {
            Variable: '$.foo',
            StringEquals: 'bar',
            Next: 'State2',
          },
        ],
        Default: 'State2',
      };

      stateChain.addChoiceState(stateName, choiceStateDetails);

      const addedState = stateChain.states.find((state) => state.stateName === stateName);
      expect(addedState).toBeDefined();
      expect(addedState?.stateDetails).toEqual({
        Type: 'Choice',
        ...choiceStateDetails,
      });
    });
  });

  describe('addSucceedState', () => {
    it('should add a succeed state with the given name', () => {
      type StateNames = 'State1' | 'State2';
      const stateToResourceMap = {}; // You can put an appropriate initialization value here
      const stateChain = new StateChain<StateNames, typeof stateToResourceMap>(stateToResourceMap);

      const stateName: StateNames = 'State1';

      stateChain.addSucceedState(stateName);

      const addedState = stateChain.states.find((state) => state.stateName === stateName);
      expect(addedState).toBeDefined();
      expect(addedState?.stateDetails).toEqual({
        Type: 'Succeed',
      });
    });
  });

  describe('addFailState', () => {
    it('should add a fail state with the given name and details', () => {
      type StateNames = 'State1' | 'State2';
      const stateToResourceMap = {}; // You can put an appropriate initialization value here
      const stateChain = new StateChain<StateNames, typeof stateToResourceMap>(stateToResourceMap);

      const stateName: StateNames = 'State1';
      const failStateDetails = {
        Cause: 'Some failure cause',
        Error: 'Some error',
      };

      stateChain.addFailState(stateName, failStateDetails);

      const addedState = stateChain.states.find((state) => state.stateName === stateName);
      expect(addedState).toBeDefined();
      expect(addedState?.stateDetails).toEqual({
        Type: 'Fail',
        ...failStateDetails,
      });
    });
  });

  describe('addWaitState', () => {
    it('should add a wait state with the given name and details', () => {
      type StateNames = 'State1' | 'State2';
      const stateToResourceMap = {}; // You can put an appropriate initialization value here
      const stateChain = new StateChain<StateNames, typeof stateToResourceMap>(stateToResourceMap);

      const stateName: StateNames = 'State1';
      const waitStateDetails = {
        Seconds: 10,
      };

      stateChain.addWaitState(stateName, waitStateDetails);

      const addedState = stateChain.states.find((state) => state.stateName === stateName);
      expect(addedState).toBeDefined();
      expect(addedState?.stateDetails).toEqual({
        Type: 'Wait',
        ...waitStateDetails,
      });
    });
  });

  describe('addMapState', () => {
    it('should add a map state with the given name and details', () => {
      type StateNames = 'State1' | 'State2';
      const stateToResourceMap = {}; // You can put an appropriate initialization value here
      const stateChain = new StateChain<StateNames, typeof stateToResourceMap>(stateToResourceMap);

      const stateName: StateNames = 'State1';
      const mapStateDetails = {
        Iterator: {
          StartAt: 'StartState',
          States: {
            StartState: { Type: 'Pass', End: true } as Pass,
          },
        },
      };

      stateChain.addMapState(stateName, mapStateDetails);

      const addedState = stateChain.states.find((state) => state.stateName === stateName);
      expect(addedState).toBeDefined();
      expect(addedState?.stateDetails).toEqual({
        Type: 'Map',
        ...mapStateDetails,
      });
    });
  });

  describe('addParallelState', () => {
    it('should add a parallel state with the given name and details', () => {
      type StateNames = 'State1' | 'State2';
      const stateToResourceMap = {}; // You can put an appropriate initialization value here
      const stateChain = new StateChain<StateNames, typeof stateToResourceMap>(stateToResourceMap);

      const stateName: StateNames = 'State1';
      const parallelStateDetails = {
        Branches: [
          {
            StartAt: 'StartState',
            States: {
              StartState: { Type: 'Pass', End: true } as Pass,
            },
          },
        ],
      };

      stateChain.addParallelState(stateName, parallelStateDetails);

      const addedState = stateChain.states.find((state) => state.stateName === stateName);
      expect(addedState).toBeDefined();
      expect(addedState?.stateDetails).toEqual({
        Type: 'Parallel',
        ...parallelStateDetails,
      });
    });
  });
})

@Capability(DynamodbCapability)
@Capability(LambdaCapability)
class WithAppliedCapabilitiesChain extends StateChain<
  keyof typeof resources,
  typeof resources
> {}

type Capabilities = [
  LambdaCapability<keyof typeof resources, typeof resources>,
  DynamodbCapability<keyof typeof resources, typeof resources>
]

describe('StateChain with Ddb and Lambda capabilities', () => {
  let chain
  const resources = {
    fetchUserData: {
      name: 'fetchUserDataLambda',
      resource: (input: { userId: string }) =>
        Promise.resolve({ userId: input.userId }),
    },
    saveUserData: {
      name: 'saveUserDataLambda',
      resource: (input: { data: string }) =>
        Promise.resolve({ input, output: true }),
    },
  }

  beforeEach(() => {
    chain = new WithAppliedCapabilitiesChain(resources) as ApplyCapabilities<
      StateChain<keyof typeof resources, typeof resources>,
      Capabilities
    >
  })

  describe('getTaskToResourceMap', () => {
    it('should return a mapping of task state names to mock AWS Lambda ARN', () => {
      chain.addLambdaTaskState('fetchUserData', {
        /*irrelevant to this test*/
      })
      chain.addLambdaTaskState('saveUserData', {
        /*irrelevant to this test*/
      })

      const actual = chain.getTaskToResourceMap()
      const expected = {
        fetchUserData: `${prefix}-fetchUserDataLambda`,
        saveUserData: `${prefix}-saveUserDataLambda`,
      }
      expect(actual).toEqual(expected)
    })

    it('should omit non-task states from the mapping', () => {
      chain.addState('initialState', { Type: 'Succeed' })
      chain.addLambdaTaskState('fetchUserData', {
        /*irrelevant to this test*/
      })
      const actual = chain.getTaskToResourceMap()
      const expected = {
        fetchUserData: `${prefix}-fetchUserDataLambda`,
      }
      expect(actual).toEqual(expected)
    })

    it('should return an empty object if there are no task states', () => {
      chain.addState('initialState', { Type: 'Succeed' })

      const actual = chain.getTaskToResourceMap()
      expect(actual).toEqual({})
    })
  })
})
