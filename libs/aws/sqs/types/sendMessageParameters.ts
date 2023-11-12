import { SendMessageCommandInput } from '@aws-sdk/client-sqs'

import { WithDollarKey } from '../../../stateMachine'

type Parameters = Pick<
  SendMessageCommandInput,
  | 'QueueUrl'
  | 'MessageBody'
  | 'DelaySeconds'
  | 'MessageAttributes'
  | 'MessageDeduplicationId'
  | 'MessageGroupId'
>

export type SendMessageParameters = Parameters & WithDollarKey<Parameters>
