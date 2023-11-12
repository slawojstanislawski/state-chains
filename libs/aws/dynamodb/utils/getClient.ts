import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import dotenv from 'dotenv'

import { isOffline } from '../../../utils'

dotenv.config()
const options = isOffline()
  ? {
      region: 'localhost',
      endpoint: `http://${process.env.OFFLINE_HOST}:${process.env.OFFLINE_DYNAMODB_PORT}`,
      accessKeyId: 'MOCK_ACCESS_KEY_ID',
      secretAccessKey: 'MOCK_SECRET_ACCESS_KEY',
    }
  : {
      region: process.env.REGION,
    }

export const getClient = () => {
  const client = new DynamoDBClient(options)
  return DynamoDBDocumentClient.from(client)
}
