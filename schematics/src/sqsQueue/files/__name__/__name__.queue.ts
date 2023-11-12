import { getStageSpecificConfig, SqsQueue } from '@libs/aws/sqs'
import { TemplateAwsArn } from '@libs/aws/types'
import { createTemplateArn } from '@libs/aws/utils'
import { toStageQualifiedName } from '@libs/utils'

export const name = '<%= name %>Queue'
export const stageQualifiedName = toStageQualifiedName(name)

export const spec: SqsQueue = {
  Type: 'AWS::SQS::Queue',
  Properties: {
    QueueName: stageQualifiedName,
    ...getStageSpecificConfig(__dirname),
  },
}

export const arn: TemplateAwsArn<'sqs'> = createTemplateArn(
  'sqs',
  stageQualifiedName
)
