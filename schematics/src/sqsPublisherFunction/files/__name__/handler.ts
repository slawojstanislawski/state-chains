import { SendMessageCommand } from '@aws-sdk/client-sqs'

import { getClient, getQueueUrl } from '@libs/aws/sqs'
import { TemplateAwsArn } from '@libs/aws/types/TemplateAwsArn.type'
import { getResourceNameFromArn } from '@libs/aws/utils'

export const handler = async () => {
  const sqs = getClient()
  const queueName = getResourceNameFromArn(
    process.env.<%= toUpperCase(queueName) %>_QUEUE_ARN as TemplateAwsArn<'sqs'>
  )
  const command = new SendMessageCommand({
    QueueUrl: getQueueUrl(queueName),
    MessageBody: JSON.stringify({
      id: '123',
      message: 'Hello from Lambda!',
    }),
    MessageAttributes: {
      id: {
        DataType: 'String',
        StringValue: '123',
      },
    },
  })

  let results
  try {
    results = await sqs.send(command)
  } catch (error) {
    console.error('error', error)
    console.error('error.$response', error.$response)
  }

  console.log('Delivered SQS message', results)
}
