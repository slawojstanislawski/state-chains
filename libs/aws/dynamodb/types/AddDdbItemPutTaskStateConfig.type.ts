import { Task } from '../../../../serverless.types'
import { RequireKeys } from '../../../types/RequireKeys.type'
import { DdbCollectionMetrics } from './api/DdbCollectionMetrics.type'
import { DdbConsumedCapacity } from './api/DdbConsumedCapacity.type'
import { DdbReturnValues } from './api/DdbReturnValues.type'

export type AddDdbItemPutTaskStateConfig<
  DdbRecordKeyType extends Record<string, any>,
  DdbRecordType extends Record<string, any>
> = {
  tableName: string
  item: RequireKeys<DdbRecordType, Extract<keyof DdbRecordKeyType, string>>
  conditionExpression?: string
  expressionAttributeNames?: { [key: string]: string }
  expressionAttributeValues?: { [key: string]: DdbRecordType }
  returnValues?: Extract<DdbReturnValues, 'NONE' | 'ALL_OLD'>
  returnConsumedCapacity?: DdbConsumedCapacity
  returnItemCollectionMetrics?: DdbCollectionMetrics
  task?: Partial<Task>
}
