import { DdbTableStageConfig } from '@libs/aws/dynamodb'
import { StageConfigMap } from '@libs/aws/types'

import { RecordType } from './context.table'

export const config: StageConfigMap<DdbTableStageConfig<RecordType>> = {
  default: {
    TimeToLiveSpecification: {
      AttributeName: 'ttl',
      Enabled: true,
    },
    BillingMode: 'PAY_PER_REQUEST',
  },
}
