import { SFNClient } from '@aws-sdk/client-sfn'
import { SFNClientConfig } from '@aws-sdk/client-sfn/dist-types/SFNClient'
import dotenv from 'dotenv'

import { getStage } from '../../../utils/getStage'

dotenv.config()
export const getClient = () => {
  const stage = getStage()
  let sfnClientConfig: SFNClientConfig = {
    region: process.env.REGION,
  }
  if (stage === 'offline') {
    sfnClientConfig = {
      ...sfnClientConfig,
      endpoint: `http://${process.env.OFFLINE_HOST}:${process.env.OFFLINE_SF_LOCAL_PORT}`,
      credentials: {
        accessKeyId: 'DummyAccessKey',
        secretAccessKey: 'DummySecretKey',
      },
    }
  }
  return new SFNClient(sfnClientConfig)
}
