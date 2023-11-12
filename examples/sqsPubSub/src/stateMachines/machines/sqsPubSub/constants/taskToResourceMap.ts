import { SqsPublisher } from '@functions'
import { SqsSendMessageReturnType } from '@libs/aws/sqs'
import { serviceIntegration } from '@libs/stateMachine'

import { StateName } from './StateName.enum'

export const taskToResourceMap = {
  [StateName.SqsPublishViaOptimizedIntegration]: {
    resource: serviceIntegration<SqsSendMessageReturnType>,
  },
  [StateName.SqsPublishViaLambda]: {
    name: SqsPublisher.name,
    resource: SqsPublisher.handler,
  },
}
