import { PublishCommandInput } from '@aws-sdk/client-sns'

import { WithDollarKey } from '../../../stateMachine'

type Parameters = Pick<
  PublishCommandInput,
  | 'Message'
  | 'MessageAttributes'
  | 'MessageStructure'
  | 'PhoneNumber'
  | 'Subject'
  | 'TargetArn'
  | 'TopicArn'
>

export type PublishParameters = Parameters & WithDollarKey<Parameters>
