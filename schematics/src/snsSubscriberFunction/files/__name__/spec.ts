import { LambdaStageConfig } from '@libs/aws/lambda'
import { createSnsEventLambdaTrigger } from '@libs/aws/sns'
import { StageConfigMap } from '@libs/aws/types'
import { SnsTopic<%= classify(topicName) %> } from '@resources/sns'

export const config: StageConfigMap<LambdaStageConfig> = {
  default: {
    events: [
      createSnsEventLambdaTrigger(
        SnsTopic<%= classify(topicName) %>.name,
        SnsTopic<%= classify(topicName) %>.stageQualifiedName
      ),
    ],
  },
}
