import { getConfig } from '../../utils'
import { SnsTopicStageConfig } from '../types/SnsTopicStageConfig.type'

export const getStageSpecificConfig = getConfig<SnsTopicStageConfig>
