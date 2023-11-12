import {
  DescribeExecutionCommand,
  DescribeExecutionCommandOutput,
} from '@aws-sdk/client-sfn'

import { getStage } from '../../../utils/getStage'
import { sleep } from '../../../utils/sleep'
import { getClient } from './getClient'

const sfnClient = getClient()

export const pollDescribeExecution = async (
  executionArn: string
): Promise<DescribeExecutionCommandOutput> => {
  const result = await sfnClient.send(
    new DescribeExecutionCommand({
      executionArn,
    })
  )
  const stage = getStage()
  const intervalMs = stage === 'offline' ? 50 : 500
  if (result.status === 'RUNNING') {
    await sleep(intervalMs)
    return pollDescribeExecution(executionArn)
  }
  return result
}
