import { AwsFunctionSpec } from '../index'

export type LambdaStageConfig = Omit<AwsFunctionSpec, 'handler'>
