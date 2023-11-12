import { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

export type DdbPutItemReturnType<RecordType> = {
  Attributes: Partial<
    Record<
      keyof RecordType,
      Partial<Record<'S' | 'N' | 'BOOL', NativeAttributeValue>>
    >
  >
}
