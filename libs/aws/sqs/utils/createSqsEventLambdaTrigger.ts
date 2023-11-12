import { SqsEventLambdaTriggerType } from '../types/api/SqsEventLambdaTrigger.type'

export const createSqsEventLambdaTrigger = (
  queueName: string
): SqsEventLambdaTriggerType => {
  return {
    sqs: {
      arn: {
        'Fn::GetAtt': [queueName, 'Arn'],
      },
    },
  }
}
