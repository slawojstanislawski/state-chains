import { DdbTableStageConfig } from '@libs/aws/dynamodb'
import { StageConfigMap } from '@libs/aws/types'

import { RecordType } from './actions.table'

export const config: StageConfigMap<DdbTableStageConfig<RecordType>> = {
  default: {
    BillingMode: 'PAY_PER_REQUEST',
  },
}
