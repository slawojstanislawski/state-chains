import { isOffline } from '@libs/utils'
import { DdbTableResources, DdbTableActions } from '@resources/dynamodb'

import { StateMachine } from '../../../../serverless.types'
import { Category } from '../../constants/category'
import { CATEGORY_PATH, ID_PATH, RECORD_PATH } from '../../constants/paths'
import {
  stageQualifiedId,
  stageQualifiedName,
  name,
  StateName,
} from './constants'
import { createChain } from './resourceVectorSave.createChain'

export const stateChain = createChain()
  .addChoiceState(StateName.ActionMemorySaveRouter, {
    Choices: [
      {
        Variable: CATEGORY_PATH,
        StringMatches: Category.ACTIONS,
        Next: StateName.ActionsTextGet,
      },
    ],
    Default: StateName.ResourceTextGet,
  })
  .addDdbItemGetTaskState<DdbTableActions.KeysType, DdbTableActions.RecordType>(
    StateName.ActionsTextGet,
    {
      tableName: DdbTableActions.stageQualifiedName,
      key: {
        id: {
          'S.$': ID_PATH,
        },
      },
      attrsToGet: {
        id: true,
        title: true,
        description: true,
      },
      resultSelector: {
        'id.$': '$.Item.id.S',
        'title.$': '$.Item.title.S',
        'description.$': '$.Item.description.S',
      },
      task: {
        ResultPath: RECORD_PATH,
        Next: StateName.ResourceVectorCreate,
      },
    }
  )
  .addDdbItemGetTaskState<
    DdbTableResources.KeysType,
    DdbTableResources.RecordType
  >(StateName.ResourceTextGet, {
    tableName: DdbTableResources.stageQualifiedName,
    key: {
      id: {
        'S.$': ID_PATH,
      },
    },
    attrsToGet: {
      id: true,
      title: true,
      description: true,
      tags: true,
      category: true,
    },
    resultSelector: {
      'id.$': '$.Item.id.S',
      'title.$': '$.Item.title.S',
      'description.$': '$.Item.description.S',
      'tags.$': '$.Item.tags.S',
      'category.$': '$.Item.category.S',
    },
    task: {
      ResultPath: RECORD_PATH,
      Next: StateName.ResourceVectorCreate,
    },
  })
  .addLambdaTaskState(StateName.ResourceVectorCreate, {
    payload: {
      'data.$': "States.Format('{}: {}', $.title, $.description)",
    },
    task: {
      InputPath: RECORD_PATH,
      Next: StateName.VectorUpsertRouter,
    },
  })
  .addChoiceState(StateName.VectorUpsertRouter, {
    Choices: [
      {
        Variable: CATEGORY_PATH,
        StringMatches: Category.ACTIONS,
        Next: StateName.ActionVectorUpsert,
      },
    ],
    Default: StateName.ResourceVectorUpsert,
  })
  .addLambdaTaskState(StateName.ResourceVectorUpsert, {
    payload: {
      'id.$': `${RECORD_PATH}.id`,
      'values.$': `$.${StateName.ResourceVectorCreate}.data[0].embedding`,
      metadata: {
        'id.$': `${RECORD_PATH}.id`,
        'tags.$': `${RECORD_PATH}.tags`,
        category: Category.MEMORIES,
      },
    },
    task: {
      OutputPath: '$.id',
      End: true,
    },
  })
  .addLambdaTaskState(StateName.ActionVectorUpsert, {
    payload: {
      'id.$': `${RECORD_PATH}.id`,
      'values.$': `$.${StateName.ResourceVectorCreate}.data[0].embedding`,
      metadata: {
        'id.$': `${RECORD_PATH}.id`,
        category: Category.ACTIONS,
      },
    },
    task: {
      OutputPath: '$.id',
      End: true,
    },
  })

export const spec: StateMachine = {
  name: isOffline() ? name : stageQualifiedName,
  id: stageQualifiedId,
  definition: {
    TimeoutSeconds: 60,
    Comment: 'Assistant - saving resource vector pathway',
    StartAt: stateChain.getStartingStateName(),
    States: stateChain.build(),
  },
}
