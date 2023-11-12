import { Task } from '../../../serverless.types'
import { TaskToResourceMapType, StateChain } from '../../stateMachine'
import { isOffline } from '../../utils'
import { createArn } from '../utils'
import { ExecutionParameters } from './types/executionParameters.type'

export class StepfunctionsCapability<
  StateNames extends string,
  TaskToResourceMap extends TaskToResourceMapType<any>
> extends StateChain<StateNames, TaskToResourceMap> {
  addStartExecutionTaskState<
    StateName extends keyof TaskToResourceMap & StateNames
  >(
    stateName: StateName,
    parameters: ExecutionParameters,
    isSync = false,
    version: number = null,
    overrides: Partial<Task> = {}
  ) {
    // replace state machine arn getter object with hardcoded version
    // for offline executions - possibly a bug in SF Local
    // https://repost.aws/questions/QUB4yC_aV4Tq6C8wjQRyfNbg/invalidarn-error-specific-to-stepfunctionslocal-not-reproducible-in-live-aws-stepfunctions
    if (
      isOffline() &&
      typeof parameters.StateMachineArn === 'object' &&
      Object.keys(parameters.StateMachineArn).includes('Fn::GetAtt')
    ) {
      const segments = parameters.StateMachineArn['Fn::GetAtt'][0].split('Dash')
      const smName = segments[segments.length - 1]
      const smArn = (parameters.StateMachineArn = createArn(
        'states',
        `stateMachine:${smName}`
      ))
      parameters.StateMachineArn = smArn
    }
    const stateDetails: Task = {
      Type: 'Task',
      Resource: `arn:aws:states:::states:startExecution${
        isSync ? '.sync' : ''
      }${version ? `:${version}` : ''}`,
      ...(parameters ? { Parameters: parameters } : undefined),
      ...overrides,
    }

    return this.addState(stateName, stateDetails)
  }
}
