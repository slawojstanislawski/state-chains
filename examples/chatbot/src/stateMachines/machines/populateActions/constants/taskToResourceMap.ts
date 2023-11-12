import { DdbUpdateItemReturnType } from '@libs/aws/dynamodb'
import { serviceIntegration } from '@libs/stateMachine'
import { DdbTableActions } from '@resources/dynamodb'

import { StateName } from './StateName.enum'

export const taskToResourceMap = {
  [StateName.ActionTextSave]: {
    resource: serviceIntegration<
      DdbUpdateItemReturnType<DdbTableActions.RecordType>
    >,
  },
  [StateName.StartResourceSaveVectorStateMachine]: {
    resource: serviceIntegration<{ Output: string }>,
  },
}
