import { Task } from '../../../serverless.types'
import { TaskToResourceMapType, StateChain } from '../../stateMachine'
import { SendMessageParameters } from './types/sendMessageParameters'

export class SqsCapability<
  StateNames extends string,
  TaskToResourceMap extends TaskToResourceMapType<any>
> extends StateChain<StateNames, TaskToResourceMap> {
  addSqsSendMessageTask<StateName extends keyof TaskToResourceMap & StateNames>(
    stateName: StateName,
    parameters: SendMessageParameters,
    overrides: Partial<Task> = {}
  ) {
    const stateDetails: Task = {
      Type: 'Task',
      Resource: 'arn:aws:states:::sqs:sendMessage',
      ...(parameters ? { Parameters: parameters } : undefined),
      ...overrides,
    }

    return this.addState(stateName, stateDetails)
  }
}
