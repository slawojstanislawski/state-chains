import { SQSClient } from '@aws-sdk/client-sqs'
import dotenv from 'dotenv'

import { isOffline } from '../../../utils'

dotenv.config()
export const getClient = () => {
  const options = isOffline()
    ? {
        region: process.env.OFFLINE_REGION,
        endpoint: `http://${process.env.OFFLINE_HOST}:${process.env.OFFLINE_SQS_PORT}`,
      }
    : {
        region: process.env.REGION,
      }
  return new SQSClient(options)
}
