import { GetExecutionHistoryCommand } from '@aws-sdk/client-sfn'

import { ExecutionHistoryResults } from '../types/ExecutionHistoryResults.type'
import { getClient } from './getClient'

const sfnClient = getClient()

export const getExecutionHistory = async (
  executionArn: string
): Promise<ExecutionHistoryResults> => {
  const { events } = await sfnClient.send(
    new GetExecutionHistoryCommand({
      executionArn,
    })
  )

  const finalEvent = events[events.length - 1]
  let result: ExecutionHistoryResults = {
    type: finalEvent.type,
  } as ExecutionHistoryResults
  switch (finalEvent.type) {
    case 'ExecutionSucceeded':
      result.value = finalEvent.executionSucceededEventDetails.output
      break
    case 'ExecutionFailed':
      result.value = finalEvent.executionFailedEventDetails.cause
      break
    case 'ExecutionTimedOut':
      result.value = finalEvent.executionTimedOutEventDetails.cause
      break
  }
  result.events = events
  return result
}
