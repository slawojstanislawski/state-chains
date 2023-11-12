import { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

export type DdbGetItemReturnType<RecordType> = {
  Item?: Partial<
    Record<
      keyof RecordType,
      Partial<Record<'S' | 'N' | 'BOOL', NativeAttributeValue>>
    >
  >
}
