import { Task } from '../../../../serverless.types'
import {
  DollarKeyExtendedResourceInput,
  TaskToResourceMapType,
} from '../../../stateMachine'

export type LambdaTaskStateConfigType<
  TaskToResourceMap extends TaskToResourceMapType<any>,
  StateName extends keyof TaskToResourceMap & string
> = {
  payload?: DollarKeyExtendedResourceInput<TaskToResourceMap, StateName>
  task?: Partial<Task>
}
