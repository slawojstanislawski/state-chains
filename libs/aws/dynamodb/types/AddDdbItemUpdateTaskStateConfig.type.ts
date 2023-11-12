import { Task } from '../../../../serverless.types'
import { DdbReturnValues } from './api/DdbReturnValues.type'

export type AddDdbItemUpdateTaskStateConfig<
  DdbRecordKeyType extends Record<string, any>,
  DdbRecordType extends Record<string, any>
> = {
  tableName: string
  key: DdbRecordKeyType
  attributeValues: Partial<{
    [DdbRecordProp in Extract<
      keyof DdbRecordType,
      string
    > as `:${DdbRecordProp}`]: Partial<
      Record<'S' | 'N' | 'BOOL' | 'S.$' | 'N.$' | 'BOOL.$', any>
    >
  }>
  returnValues: Extract<DdbReturnValues, 'NONE' | 'ALL_NEW'>
  task: Partial<Task>
}
