import { toStageQualifiedLogicalId } from '@libs/stateMachine'
import { toStageQualifiedName } from '@libs/utils'

export const name = '<%= name %>'
export const stageQualifiedName = toStageQualifiedName(name)
export const stageQualifiedId = toStageQualifiedLogicalId(name)

export * from './StateName.enum'
export * from './taskToResourceMap'
