import { Task } from '../../../serverless.types'
import { ApplyCapabilities, StateChain, Capability } from '../../stateMachine'
import { LambdaCapability } from './lambda.capability'

const taskToResourceMap = {
  callUserProcessor: {
    name: 'userProcessorLambda',
    resource: (input: { userId: string }) =>
      Promise.resolve({ userId: input.userId }),
  },
} as const

@Capability(LambdaCapability)
class WithLambdaCapabilityAppliedChain extends StateChain<
  keyof typeof taskToResourceMap,
  typeof taskToResourceMap
> {}

type Capabilities = [
  LambdaCapability<keyof typeof taskToResourceMap, typeof taskToResourceMap>
]

describe('LambdaCapability applied on StateChain', () => {
  let chain: ApplyCapabilities<
    StateChain<keyof typeof taskToResourceMap, typeof taskToResourceMap>,
    Capabilities
  >

  beforeEach(() => {
    chain = new WithLambdaCapabilityAppliedChain(
      taskToResourceMap
    ) as ApplyCapabilities<
      StateChain<keyof typeof taskToResourceMap, typeof taskToResourceMap>,
      Capabilities
    >
  })

  describe('addLambdaTaskState', () => {
    it('should add a Lambda task state', () => {
      chain.addLambdaTaskState('callUserProcessor', {
        payload: {
          'userId.$': '$.userId',
        },
      })

      const states = chain.states
      expect(states).toHaveLength(1)
      expect(states[0].stateName).toEqual('callUserProcessor')
      const stateDetails = states[0].stateDetails as Task
      expect(stateDetails.Resource).toEqual({
        'Fn::GetAtt': ['userProcessorLambda', 'Arn'],
      })
      expect(stateDetails.Parameters).toEqual({
        'userId.$': '$.userId',
      })
      expect(stateDetails.ResultPath).toEqual('$.callUserProcessor')
    })

    it('should merge overrides into Lambda task state', () => {
      chain.addLambdaTaskState(
        'callUserProcessor',
        {
          payload:         {
            'userId.$': '$.userId',
          },
          task: {
            TimeoutSeconds: 30,
          }
        }
      )

      const stateDetails = chain.states[0].stateDetails as Task
      expect(stateDetails.TimeoutSeconds).toEqual(30)
    })
  })
})
