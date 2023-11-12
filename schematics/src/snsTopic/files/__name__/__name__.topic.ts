import { SnsTopic } from '@libs/aws/sns'
import { getStageSpecificConfig } from '@libs/aws/sns'
import { TemplateAwsArn } from '@libs/aws/types'
import { createTemplateArn } from '@libs/aws/utils'
import { toStageQualifiedName } from '@libs/utils'

export const name = '<%= name %>Topic'
export const stageQualifiedName = toStageQualifiedName(name)

export const spec: SnsTopic = {
  Type: 'AWS::SNS::Topic',
  Properties: {
    TopicName: stageQualifiedName,
    ...getStageSpecificConfig(__dirname),
  },
}

export const arn: TemplateAwsArn<'sns'> = createTemplateArn(
  'sns',
  stageQualifiedName
)
