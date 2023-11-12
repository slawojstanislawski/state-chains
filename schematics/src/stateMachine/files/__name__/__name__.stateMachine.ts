import { isOffline } from '@libs/utils'

import { StateMachine } from '../../../../serverless.types'
import { createChain } from './<%= name %>.createChain'
import {
  stageQualifiedId,
  stageQualifiedName,
  name,
  StateName,
} from './constants'

export const stateChain = createChain().addLambdaTaskState(StateName.Dummy, {
  // Equivalent to passing undefined as that's basically the entire input
  // to the state machine. Using explicit params for example's sake.
  payload: { 'dummyInput.$': '$.dummyInput' },
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
