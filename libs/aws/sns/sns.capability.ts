import { Task } from '../../../serverless.types'
import { TaskToResourceMapType, StateChain } from '../../stateMachine'
import { PublishParameters } from './types/publishParameters'

export class SnsCapability<
  StateNames extends string,
  TaskToResourceMap extends TaskToResourceMapType<any>
> extends StateChain<StateNames, TaskToResourceMap> {
  addSnsPublishTaskState<
    StateName extends keyof TaskToResourceMap & StateNames
  >(
    stateName: StateName,
    parameters: PublishParameters,
    overrides: Partial<Task> = {}
  ) {
    const stateDetails: Task = {
      Type: 'Task',
      Resource: 'arn:aws:states:::sns:publish',
      ...(parameters ? { Parameters: parameters } : undefined),
      ...overrides,
    }

    return this.addState(stateName, stateDetails)
  }
}
