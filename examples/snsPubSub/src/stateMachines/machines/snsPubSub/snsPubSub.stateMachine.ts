import { isOffline } from '@libs/utils'
import { SnsTopicSuper } from '@resources/sns'

import { StateMachine } from '../../../../serverless.types'
import {
  name,
  stageQualifiedId,
  stageQualifiedName,
  StateName,
} from './constants'
import { createChain } from './snsPubSub.createChain'

export const stateChain = createChain()
  .addSnsPublishTaskState(
    StateName.SnsPublishViaOptimizedIntegration,
    {
      Message: '{"publishingFrom": "publishing from optimized integration"}',
      TopicArn: SnsTopicSuper.arn,
    },
    {
      Next: StateName.SnsPublishViaLambda,
    }
  )
  .addLambdaTaskState(StateName.SnsPublishViaLambda, {
    payload: undefined,
    task: {
      End: true,
    },
  })

export const spec: StateMachine = {
  name: isOffline() ? name : stageQualifiedName,
  id: stageQualifiedId,
  definition: {
    StartAt: stateChain.getStartingStateName(),
    States: stateChain.build(),
  },
}
