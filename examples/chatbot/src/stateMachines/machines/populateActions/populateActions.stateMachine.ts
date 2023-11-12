import { isOffline } from '@libs/utils'
import { DdbTableActions } from '@resources/dynamodb'

import { StateMachine } from '../../../../serverless.types'
import { actions } from '../../../actions'
import { calendarAddEventAction } from '../../../actions/calendarAddEvent'
import { Category } from '../../constants/category'
import * as ResourceVectorSave from '../resourceVectorSave'
import {
  stageQualifiedId,
  stageQualifiedName,
  name,
  StateName,
} from './constants'
import { createChain } from './populateActions.createChain'

export const stateChain = createChain()
  .addPassState(StateName.SeedActions, {
    Result: actions,
    ResultPath: `$.${StateName.SeedActions}`,
    Next: StateName.PopulateActions,
  })
  .addMapState(StateName.PopulateActions, {
    ItemsPath: `$.${StateName.SeedActions}`,
    Iterator: {
      StartAt: StateName.ActionTextSave,
      States: createChain()
        .addDdbItemUpdateTaskState<
          DdbTableActions.KeysType,
          DdbTableActions.RecordType
        >(StateName.ActionTextSave, {
          tableName: DdbTableActions.stageQualifiedName,
          key: {
            id: {
              S: calendarAddEventAction.id,
            },
          },
          attributeValues: {
            ':title': {
              S: calendarAddEventAction.title,
            },
            ':description': {
              S: calendarAddEventAction.description,
            },
            ':stateMachineArn': {
              S: calendarAddEventAction.stateMachineArn,
            },
          },
          returnValues: 'ALL_NEW',
          task: {
            ResultSelector: {
              'id.$': '$.Attributes.id.S',
            },
            Next: StateName.StartResourceSaveVectorStateMachine,
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
              'id.$': '$.id',
              category: Category.ACTIONS,
            },
          },
          true,
          null,
          {
            ResultPath: `$.${StateName.StartResourceSaveVectorStateMachine}`,
            OutputPath: `$.${StateName.StartResourceSaveVectorStateMachine}.Output`,
            End: true,
          }
        )
        .build(),
    },
    End: true,
  })

export const spec: StateMachine = {
  name: isOffline() ? name : stageQualifiedName,
  id: stageQualifiedId,
  definition: {
    TimeoutSeconds: 60,
    Comment: 'Assistant - populate actions',
    StartAt: stateChain.getStartingStateName(),
    States: stateChain.build(),
  },
}
