import { BatchGetCommand, BatchGetCommandInput } from '@aws-sdk/lib-dynamodb'

import { getClient } from '@libs/aws/dynamodb'

const ddbDocClient = getClient()

export const handler = async <DdbRecordType>({
  tableName,
  ids,
}: {
  tableName: string
  ids: string[]
}) => {
  // create command
  const Keys = ids.map((id) => {
    return { id }
  })
  const params = {
    RequestItems: {
      [tableName]: {
        Keys,
      },
    },
  } as BatchGetCommandInput
  const command = new BatchGetCommand(params)

  // send command
  const data = await ddbDocClient.send(command)
  const items = data.Responses[tableName] as DdbRecordType[]
  return items
}
