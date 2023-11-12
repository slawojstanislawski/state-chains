import { StageQualifiedName } from '../../../types'
import { SnsEventLambdaTriggerType } from '../types/api/SnsEventLambdaTrigger.type'

export const createSnsEventLambdaTrigger = (
  topicName: string,
  stageQualifiedName: StageQualifiedName
): SnsEventLambdaTriggerType => {
  return {
    sns: {
      arn: {
        Ref: topicName,
      },
      topicName: stageQualifiedName,
    },
  }
}
