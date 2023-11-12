import { SNSClient, SNSClientConfig } from '@aws-sdk/client-sns'
import dotenv from 'dotenv'

import { isOffline } from '../../../utils'

dotenv.config()
export const getClient = () => {
  const options: SNSClientConfig = {
    region: process.env.REGION,
  }
  if (isOffline()) {
    options.endpoint = `http://${process.env.OFFLINE_HOST}:${process.env.OFFLINE_SNS_PORT}`
  }

  return new SNSClient(options)
}
