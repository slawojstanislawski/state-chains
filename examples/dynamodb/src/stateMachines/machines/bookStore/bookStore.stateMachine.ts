import { isOffline } from '@libs/utils'
import { DdbTableBooks } from '@resources/dynamodb'

import { StateMachine } from '../../../../serverless.types'
import { createChain } from './bookStore.createChain'
import {
  stageQualifiedId,
  stageQualifiedName,
  StateName,
  name,
} from './constants'

export const stateChain = createChain()
  .addDdbItemPutTaskState<DdbTableBooks.KeysType, DdbTableBooks.RecordType>(
    StateName.PutFirst,
    {
      tableName: DdbTableBooks.stageQualifiedName,
      item: {
        id: '123',
      },
      task: {
        Next: StateName.PutSecond,
      },
    }
  )
  .addDdbItemPutTaskState<DdbTableBooks.KeysType, DdbTableBooks.RecordType>(
    StateName.PutSecond,
    {
      tableName: DdbTableBooks.stageQualifiedName,
      item: {
        id: '456',
      },
      task: {
        Next: StateName.UpdateFirst,
      },
    }
  )
  .addDdbItemUpdateTaskState<DdbTableBooks.KeysType, DdbTableBooks.RecordType>(
    StateName.UpdateFirst,
    {
      tableName: DdbTableBooks.stageQualifiedName,
      key: {
        id: {
          S: '123',
        },
      },
      attributeValues: {
        ':author': {
          S: 'some author',
        },
      },
      returnValues: 'ALL_NEW',
      task: {
        ResultPath: '$.updatedFirstItem',
        Next: StateName.DeleteSecond,
      },
    }
  )
  .addDdbItemDeleteTaskState<DdbTableBooks.KeysType, DdbTableBooks.RecordType>(
    StateName.DeleteSecond,
    {
      tableName: DdbTableBooks.stageQualifiedName,
      key: {
        id: {
          S: '456',
        },
      },
      returnValues: 'ALL_OLD',
      task: {
        Next: StateName.GetFirst,
        ResultPath: '$.deletedSecondItem',
      },
    }
  )
  .addDdbItemGetTaskState<DdbTableBooks.KeysType, DdbTableBooks.RecordType>(
    StateName.GetFirst,
    {
      tableName: DdbTableBooks.stageQualifiedName,
      key: {
        id: {
          S: '123',
        },
      },
      attrsToGet: {
        id: true,
        author: true,
      },
      resultSelector: {
        'id.$': '$.Item.id.S',
        'author.$': '$.Item.author.S',
      },
      task: {
        End: true,
      },
    }
  )

export const spec: StateMachine = {
  name: isOffline() ? name : stageQualifiedName,
  id: stageQualifiedId,
  definition: {
    StartAt: stateChain.getStartingStateName(),
    States: stateChain.build(),
  },
}
