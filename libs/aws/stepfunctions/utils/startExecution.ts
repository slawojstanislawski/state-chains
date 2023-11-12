import { StartExecutionCommand } from '@aws-sdk/client-sfn'

import { createArn } from '../../utils'
import { getClient } from './getClient'

const sfnClient = getClient()

export const startExecution = async (
  stateMachineTestName: string,
  testInput: string,
  executionName: string = `${Math.random()}`
) => {
  return await sfnClient.send(
    new StartExecutionCommand({
      name: executionName,
      stateMachineArn: createArn(
        'states',
        `stateMachine:${stateMachineTestName}`
      ),
      input: testInput,
    })
  )
}
