import { SnsPublisher } from '@functions'
import { SnsPublishReturnType } from '@libs/aws/sns'
import { serviceIntegration } from '@libs/stateMachine'

import { StateName } from './StateName.enum'

export const taskToResourceMap = {
  [StateName.SnsPublishViaOptimizedIntegration]: {
    resource: serviceIntegration<SnsPublishReturnType>,
  },
  [StateName.SnsPublishViaLambda]: {
    name: SnsPublisher.name,
    resource: SnsPublisher.handler,
  },
}
