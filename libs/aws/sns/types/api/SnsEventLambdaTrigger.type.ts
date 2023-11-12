import { StageQualifiedName } from '../../../../types'
import { TemplateAwsArn } from '../../../types'

export type SnsEventLambdaTriggerType = {
  sns: {
    arn:
      | TemplateAwsArn<'sns'>
      | {
          Ref: string
        }
    topicName: StageQualifiedName
  }
}
