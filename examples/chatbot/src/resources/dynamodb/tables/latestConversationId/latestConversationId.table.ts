import {
  DdbTable,
  getStageSpecificConfig,
  InferKey,
  KeySchema,
} from '@libs/aws/dynamodb'
import { toStageQualifiedName } from '@libs/utils'

export const name = 'latestConversationId'
export const resourceKey = `${name}Table`
export const stageQualifiedName = toStageQualifiedName(name)

export type RecordType = {
  id: string
  latestConversationId: string
}

const keySchema = [
  {
    AttributeName: 'id',
    KeyType: 'HASH',
  },
] satisfies KeySchema<RecordType>

export const spec: DdbTable<RecordType> = {
  Type: 'AWS::DynamoDB::Table',
  Properties: {
    TableName: stageQualifiedName,
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S',
      },
    ],
    KeySchema: keySchema,
    ...getStageSpecificConfig(__dirname),
  },
}

export type KeysType = InferKey<typeof keySchema>
