import dotenv from 'dotenv'

import {
  getExecutionHistory,
  pollDescribeExecution,
  startExecution,
} from '../../libs/aws/stepfunctions'
import { getStateMachineStageQualifiedName } from './getStateMachineStageQualifiedName'
import { handleExecutionResults } from './handleExecutionResults'
import { selectSmTestInput } from './selectSmTestInput'

dotenv.config()

export async function selectAndRunStateMachine(
  stage: string,
  isTest = false,
  isE2E = false
) {
  const { stateMachine, testName, input } = await selectSmTestInput(isE2E)

  let stateMachineName: string
  if (stage === 'offline') {
    if (isTest) {
      stateMachineName = `${stateMachine}#${testName}`
    }
  } else {
    stateMachineName = getStateMachineStageQualifiedName(stateMachine, stage)
  }

  const { executionArn } = await startExecution(stateMachineName, input)
  const { executionArn: finishedExecutionArn } = await pollDescribeExecution(
    executionArn
  )
  const res = await getExecutionHistory(finishedExecutionArn)

  handleExecutionResults(res, stateMachineName)
}
