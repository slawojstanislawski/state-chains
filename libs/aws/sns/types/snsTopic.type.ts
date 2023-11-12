import { SNSTopicProperties } from './api/snsTopicProperties.type'

export type SnsTopic = {
  Type: 'AWS::SNS::Topic'
  Properties: SNSTopicProperties
}
