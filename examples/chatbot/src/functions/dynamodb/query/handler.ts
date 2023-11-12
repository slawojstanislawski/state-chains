import { QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import { QueryCommand } from '@aws-sdk/lib-dynamodb'

import { getClient } from '@libs/aws/dynamodb'

const ddbDocClient = getClient()

export const handler = async <DdbRecordType>(params: QueryCommandInput) => {
  // create command
  const command = new QueryCommand(params)

  // send command
  const data = await ddbDocClient.send(command)
  const items = data.Items as DdbRecordType[]
  return items
}
