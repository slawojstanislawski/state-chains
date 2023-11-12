import { ToTaskResultMap } from '@libs/stateMachine'
import { taskToResourceMap } from '../../constants'

export type TaskResultMap = ToTaskResultMap<typeof taskToResourceMap>
