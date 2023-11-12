import { getQueueUrl } from '@libs/aws/sqs'
import { isOffline } from '@libs/utils'
import { SqsQueueSuper } from '@resources/sqs'

import { StateMachine } from '../../../../serverless.types'
import {
  stageQualifiedId,
  stageQualifiedName,
  name,
  StateName,
} from './constants'
import { createChain } from './sqsPubSub.createChain'

export const stateChain = createChain()
  .addSqsSendMessageTask(
    StateName.SqsPublishViaOptimizedIntegration,
    {
      MessageBody: 'publishing from optimized integration',
      QueueUrl: getQueueUrl(SqsQueueSuper.stageQualifiedName),
    },
    {
      Next: StateName.SqsPublishViaLambda,
    }
  )
  .addLambdaTaskState(StateName.SqsPublishViaLambda, {
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
