import {
  DdbGetItemReturnType,
  DdbUpdateItemReturnType,
  DdbPutItemReturnType,
  DdbDeleteItemReturnType,
} from '@libs/aws/dynamodb'
import { serviceIntegration } from '@libs/stateMachine'
import { DdbTableBooks } from '@resources/dynamodb'

import { StateName } from './StateName.enum'

export const taskToResourceMap = {
  [StateName.PutFirst]: {
    resource: serviceIntegration<
      DdbPutItemReturnType<DdbTableBooks.RecordType>
    >,
  },
  [StateName.PutSecond]: {
    resource: serviceIntegration<
      DdbPutItemReturnType<DdbTableBooks.RecordType>
    >,
  },
  [StateName.UpdateFirst]: {
    resource: serviceIntegration<
      DdbUpdateItemReturnType<DdbTableBooks.RecordType>
    >,
  },
  [StateName.DeleteSecond]: {
    resource: serviceIntegration<
      DdbDeleteItemReturnType<DdbTableBooks.RecordType>
    >,
  },
  [StateName.GetFirst]: {
    resource: serviceIntegration<
      DdbGetItemReturnType<DdbTableBooks.RecordType>
    >,
  },
}
