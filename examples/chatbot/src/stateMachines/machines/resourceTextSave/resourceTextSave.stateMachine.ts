import { isOffline } from '@libs/utils'
import { DdbTableResources } from '@resources/dynamodb'

import { StateMachine } from '../../../../serverless.types'
import { CATEGORY_PATH } from '../../constants/paths'
import * as ResourceVectorSave from '../resourceVectorSave'
import {
  name,
  stageQualifiedId,
  stageQualifiedName,
  StateName,
} from './constants'
import { createChain } from './resourceTextSave.createChain'

export const stateChain = createChain()
  .addLambdaTaskState(StateName.ResourceEnrichOpenAiPrepare)
  .addLambdaTaskState(StateName.ResourceEnrichOpenAi, {
    payload: {
      'messages.$': `$.${StateName.ResourceEnrichOpenAiPrepare}`,
    },
    task: {
      ResultSelector: {
        'data.$': 'States.StringToJson($.data)',
      },
      ResultPath: '$.enrichResult',
    },
  })
  .addDdbItemUpdateTaskState<
    DdbTableResources.KeysType,
    DdbTableResources.RecordType
  >(StateName.ResourceTextSave, {
    tableName: DdbTableResources.stageQualifiedName,
    key: {
      id: {
        'S.$': 'States.UUID()',
      },
    },
    attributeValues: {
      ':title': {
        'S.$': '$.enrichResult.data.title',
      },
      ':tags': {
        'S.$': '$.enrichResult.data.tags',
      },
      ':description': {
        'S.$': '$.query',
      },
      ':category': {
        'S.$': CATEGORY_PATH,
      },
    },
    returnValues: 'ALL_NEW',
    task: {
      ResultSelector: {
        'id.$': '$.Attributes.id.S',
      },
      ResultPath: `$.${StateName.ResourceTextSave}`,
    },
  })
  .addStartExecutionTaskState(
    StateName.StartResourceSaveVectorStateMachine,
    {
      StateMachineArn: {
        'Fn::GetAtt': [ResourceVectorSave.stageQualifiedId, 'Arn'],
      },
      Input: {
        NeedCallback: false,
        'AWS_STEP_FUNCTIONS_STARTED_BY_EXECUTION_ID.$': '$$.Execution.Id',
        'id.$': `$.${StateName.ResourceTextSave}.id`,
        'category.$': CATEGORY_PATH,
      },
    },
    true,
    null,
    {
      ResultPath: `$.${StateName.StartResourceSaveVectorStateMachine}`,
      OutputPath: `$.${StateName.StartResourceSaveVectorStateMachine}.Output`,
    }
  )
  .addPassState(StateName.ChildStateMachineSucceeded, {
    Parameters: {
      'answer.$': 'States.StringToJson($)',
    },
    End: true,
  })

export const spec: StateMachine = {
  name: isOffline() ? name : stageQualifiedName,
  id: stageQualifiedId,
  definition: {
    TimeoutSeconds: 60,
    Comment: 'Assistant - saving resource text pathway',
    StartAt: stateChain.getStartingStateName(),
    States: stateChain.build(),
  },
}
