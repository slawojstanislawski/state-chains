import { Task } from '../../../serverless.types'
import { TaskToResourceMapType, StateChain } from '../../stateMachine'
import { LambdaTaskStateConfigType } from './types/LambdaTaskStateConfig.type'

export class LambdaCapability<
  StateNames extends string,
  TaskToResourceMap extends TaskToResourceMapType<any>
> extends StateChain<StateNames, TaskToResourceMap> {
  addLambdaTaskState<StateName extends keyof TaskToResourceMap & StateNames>(
    stateName: StateName,
    config: LambdaTaskStateConfigType<TaskToResourceMap, StateName> = {}
  ) {
    const { payload, task = {} } = config
    const stateDetails: Task = {
      Type: 'Task',
      Resource: {
        'Fn::GetAtt': [this.stateToResourceMap[stateName]['name'], 'Arn'],
      },
      ...(payload ? { Parameters: payload } : undefined),
      ...task,
    }

    return this.addState(stateName, stateDetails)
  }
}
