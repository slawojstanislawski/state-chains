import { ScanCommand } from '@aws-sdk/lib-dynamodb'
import { ScanCommandInput } from '@aws-sdk/lib-dynamodb/dist-types/commands/ScanCommand'

import { getClient } from '@libs/aws/dynamodb'

const ddbDocClient = getClient()

export const handler = async <DdbRecordType>(params: ScanCommandInput) => {
  // create command
  const command = new ScanCommand(params)

  // send command
  const { Items } = await ddbDocClient.send(command)
  return Items as DdbRecordType[]
}
