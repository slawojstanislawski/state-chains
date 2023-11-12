import { LambdaStageConfig } from '@libs/aws/lambda'
import { createSqsEventLambdaTrigger } from '@libs/aws/sqs'
import { StageConfigMap } from '@libs/aws/types'
import { SqsQueue<%= classify(queueName) %> } from '@resources/sqs'

export const config: StageConfigMap<LambdaStageConfig> = {
  default: {
    events: [createSqsEventLambdaTrigger(SqsQueue<%= classify(queueName) %>.name)],
  },
}
