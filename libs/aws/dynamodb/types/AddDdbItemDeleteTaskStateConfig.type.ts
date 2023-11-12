import { Task } from '../../../../serverless.types'
import { DdbCollectionMetrics } from './api/DdbCollectionMetrics.type'
import { DdbConsumedCapacity } from './api/DdbConsumedCapacity.type'
import { DdbReturnValues } from './api/DdbReturnValues.type'

export type AddDdbItemDeleteTaskStateConfig<
  DdbRecordKeyType extends Record<string, any>,
  DdbRecordType extends Record<string, any>
> = {
  tableName: string
  key: DdbRecordKeyType
  conditionExpression?: string
  expressionAttributeNames?: Partial<{
    [DdbRecordProp in Extract<
      keyof DdbRecordType,
      string
    > as `#${string}`]: DdbRecordProp
  }> // e.g. {"#P":"Percentile", "#b": "bucket", "#i": "index"}
  expressionAttributeValues?: Partial<{
    [DdbRecordProp in Extract<
      keyof DdbRecordType,
      string
    > as `:${DdbRecordProp}`]: Partial<
      Record<'S' | 'N' | 'BOOL' | 'S.$' | 'N.$' | 'BOOL.$', any>
    >
  }>
  returnValues?: Extract<DdbReturnValues, 'NONE' | 'ALL_OLD'>
  returnConsumedCapacity?: DdbConsumedCapacity
  returnItemCollectionMetrics?: DdbCollectionMetrics
  task?: Partial<Task>
}
