import { FilterPatterns } from '@serverless/typescript'

import { TemplateAwsArn } from '../../../types'

export type SqsEventLambdaTriggerType = {
  sqs: {
    arn:
      | TemplateAwsArn<'sqs'>
      | {
          'Fn::GetAtt': [string, 'Arn']
        }
    batchSize?: number
    enabled?: boolean
    maximumBatchingWindow?: number
    functionResponseType?: 'ReportBatchItemFailures'
    filterPatterns?: FilterPatterns
    maximumConcurrency?: number
  }
}
