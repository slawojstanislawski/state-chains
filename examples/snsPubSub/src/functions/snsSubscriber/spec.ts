import { LambdaStageConfig } from '@libs/aws/lambda'
import { createSnsEventLambdaTrigger } from '@libs/aws/sns'
import { StageConfigMap } from '@libs/aws/types'
import { SnsTopicSuper } from '@resources/sns'

export const config: StageConfigMap<LambdaStageConfig> = {
  default: {
    events: [
      createSnsEventLambdaTrigger(
        SnsTopicSuper.name,
        SnsTopicSuper.stageQualifiedName
      ),
    ],
  },
}
