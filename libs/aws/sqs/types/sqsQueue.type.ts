import { SQSQueueProperties } from './sqsQueueProperties.type'

export type SqsQueue = {
  Type: 'AWS::SQS::Queue'
  Properties?: SQSQueueProperties
}
