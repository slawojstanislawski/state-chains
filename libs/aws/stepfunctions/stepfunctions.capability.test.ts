import { Task } from '../../../serverless.types'
import {
  ApplyCapabilities,
  serviceIntegration,
  StateChain,
  Capability,
} from '../../stateMachine'
import { StepfunctionsCapability } from './stepfunctions.capability'

const taskToResourceMap = {
  startSyncExecutionTaskName: {
    resource: serviceIntegration<{ Output: string }>,
  },
} as const

@Capability(StepfunctionsCapability)
class WithStepFunctionsCapabilityAppliedChain extends StateChain<
  keyof typeof taskToResourceMap,
  typeof taskToResourceMap
> {}

type Capabilities = [
  StepfunctionsCapability<keyof typeof taskToResourceMap, typeof taskToResourceMap>
]

describe('StepFunctionsCapability applied on StateChain', () => {
  let chain: ApplyCapabilities<
    StateChain<keyof typeof taskToResourceMap, typeof taskToResourceMap>,
    Capabilities
  >

  beforeEach(() => {
    chain = new WithStepFunctionsCapabilityAppliedChain(
      taskToResourceMap
    ) as ApplyCapabilities<
      StateChain<keyof typeof taskToResourceMap, typeof taskToResourceMap>,
      Capabilities
    >
  })

  describe('addStartExecutionTaskState', () => {
    it('should add an Start (async) Execution task state for a state machine with no version', () => {
      chain.addStartExecutionTaskState(
        'startSyncExecutionTaskName',
        {
          Input: { some: 'input' },
          Name: 'sync execution name',
          StateMachineArn:
            'arn:aws:stepFunctions:us-east-1:123456789012:stateMachineName',
        },
        false,
        null
      )
      const states = chain.states

      expect(states).toHaveLength(1)
      expect(states[0].stateName).toEqual('startSyncExecutionTaskName')
      const stateDetails = states[0].stateDetails as Task
      expect(stateDetails.Resource).toEqual(
        'arn:aws:states:::states:startExecution'
      )
      expect(stateDetails.Parameters.Input).toEqual({some:"input"})
      expect(stateDetails.Parameters.Name).toEqual('sync execution name')
      expect(stateDetails.Parameters.StateMachineArn).toEqual(
        'arn:aws:stepFunctions:us-east-1:123456789012:stateMachineName'
      )
    })

    it('should add an Start (async) Execution task state for a state machine with version #2', () => {
      chain.addStartExecutionTaskState(
        'startSyncExecutionTaskName',
        {
          Input: { some: 'input' },
          Name: 'sync execution name',
          StateMachineArn:
            'arn:aws:stepFunctions:us-east-1:123456789012:stateMachineName',
        },
        false,
        2
      )
      const states = chain.states
      const stateDetails = states[0].stateDetails as Task
      expect(stateDetails.Resource).toEqual(
        'arn:aws:states:::states:startExecution:2'
      )
    })

    it('should add an Start (sync) Execution task state for a state machine with no version', () => {
      chain.addStartExecutionTaskState(
        'startSyncExecutionTaskName',
        {
          Input: { some: 'input' },
          Name: 'sync execution name',
          StateMachineArn:
            'arn:aws:stepFunctions:us-east-1:123456789012:stateMachineName',
        },
        true,
        null
      )
      const states = chain.states
      const stateDetails = states[0].stateDetails as Task
      expect(stateDetails.Resource).toEqual(
        'arn:aws:states:::states:startExecution.sync'
      )
    })

    it('should add an Start (sync) Execution task state for a state machine with version #2', () => {
      chain.addStartExecutionTaskState(
        'startSyncExecutionTaskName',
        {
          Input: { some: 'input' },
          Name: 'sync execution name',
          StateMachineArn:
            'arn:aws:stepFunctions:us-east-1:123456789012:stateMachineName',
        },
        true,
        2
      )
      const states = chain.states
      const stateDetails = states[0].stateDetails as Task
      expect(stateDetails.Resource).toEqual(
        'arn:aws:states:::states:startExecution.sync:2'
      )
    })
  })
})
