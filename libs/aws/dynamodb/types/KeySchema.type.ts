export type DdbKeySchema = Readonly<
  Array<{
    AttributeName: string
    KeyType: 'HASH' | 'RANGE'
  }>
>
