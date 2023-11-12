import { isOffline } from '@libs/utils'

import { StateMachine } from '../../../../serverless.types'
import { createChain } from './actionAddQuickEvent.createChain'
import {
  stageQualifiedId,
  stageQualifiedName,
  name,
  StateName,
} from './constants'

export const stateChain = createChain().addLambdaTaskState(
  StateName.CalendarAddQuickEvent,
  {
    task: {
      End: true,
    },
  }
)

export const spec: StateMachine = {
  name: isOffline() ? name : stageQualifiedName,
  id: stageQualifiedId,
  definition: {
    TimeoutSeconds: 60,
    StartAt: stateChain.getStartingStateName(),
    States: stateChain.build(),
  },
}
