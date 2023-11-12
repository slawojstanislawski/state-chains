import { DdbTable } from '../index'

export type DdbTableStageConfig<T> = Omit<
  DdbTable<T>['Properties'],
  'AttributeDefinitions' | 'KeySchema' | 'TableName'
>
