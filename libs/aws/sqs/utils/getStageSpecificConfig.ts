import { getConfig } from '../../utils'
import { SqsQueueStageConfig } from '../types/SqsQueueStageConfig.type'

export const getStageSpecificConfig = getConfig<SqsQueueStageConfig>
