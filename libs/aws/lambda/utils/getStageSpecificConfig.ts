import { getConfig } from '../../utils'
import { LambdaStageConfig } from '../types/LambdaStageConfig.type'

export const getStageSpecificConfig = getConfig<LambdaStageConfig>
