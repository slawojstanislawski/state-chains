import { LambdaStageConfig } from '@libs/aws/lambda'
import { createSqsEventLambdaTrigger } from '@libs/aws/sqs'
import { StageConfigMap } from '@libs/aws/types'
import { SqsQueueSuper } from '@resources/sqs'

export const config: StageConfigMap<LambdaStageConfig> = {
  default: {
    events: [createSqsEventLambdaTrigger(SqsQueueSuper.name)],
  },
}
