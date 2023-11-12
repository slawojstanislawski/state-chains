import { Task } from '../../../../serverless.types'

export type AddDdbItemGetTaskStateConfig<
  DdbRecordKeyType extends Record<string, any>,
  DdbRecordType extends Record<string, any>
> = {
  tableName: string
  key: DdbRecordKeyType
  attrsToGet: Partial<Record<keyof DdbRecordType, true>>
  resultSelector: Partial<{
    [DdbRecordProp in Extract<
      keyof DdbRecordType,
      string
    > as `${DdbRecordProp}.$`]:
      | `$.Item.${DdbRecordProp}.S`
      | `$.Item.${DdbRecordProp}.N`
      | `$.Item.${DdbRecordProp}.BOOL`
  }>
  task?: Partial<Task>
}
