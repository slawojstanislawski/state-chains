import { PublishCommand } from '@aws-sdk/client-sns'

import { getClient } from '@libs/aws/sns'

export const handler = async () => {
  const sns = getClient()
  const command = new PublishCommand({
    Message: '{"default": "hello!"}',
    MessageStructure: 'json',
    TopicArn: process.env.<%= toUpperCase(topicName) %>_TOPIC_ARN,
  })

  let results
  try {
    results = await sns.send(command)
  } catch (error) {
    console.error('error', error)
    console.error('error.$response', error.$response)
  }

  console.log('Delivered SNS message', results)
}
