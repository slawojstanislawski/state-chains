import { DynamoDBGlobalTableProperties } from './DdbTableProperties.type'

export type KeySchema<RecordType> = {
  AttributeName: keyof RecordType
  KeyType: 'HASH' | 'RANGE'
}[]

type AttributeDefinitions<RecordType> = {
  AttributeName: keyof RecordType
  AttributeType: 'S' | 'N' | 'BOOL'
}[]

export type DdbTable<RecordType> = {
  Type: 'AWS::DynamoDB::Table'
  Properties: Omit<
    DynamoDBGlobalTableProperties,
    'AttributeDefinitions' | 'KeySchema' | 'Replicas'
  > & {
    AttributeDefinitions: AttributeDefinitions<RecordType>
    KeySchema: KeySchema<RecordType>
    Replicas?: DynamoDBGlobalTableProperties['Replicas']
  }
}
