import chalk from 'chalk'
import dotenv from 'dotenv'

import { createArn } from '../libs/aws/utils'
import { getStateMachineStageQualifiedName } from './utils/getStateMachineStageQualifiedName'
import { selectSmTestInput } from './utils/selectSmTestInput'

dotenv.config()

async function main() {
  const { stateMachine, input } = await selectSmTestInput()
  const slsInvokeCmdSegments = [
    'sls',
    'invoke',
    'stepf',
    '--name',
    stateMachine,
    '--data',
    input,
  ]
  console.log(chalk.blue('SLS Invoke command:'))
  console.log(chalk.green(slsInvokeCmdSegments.join(' ')))
  const awsCliCmdSegments = [
    'aws',
    'stepfunctions',
    'start-execution',
    '--state-machine-arn',
    createArn(
      'states',
      `stateMachine:${getStateMachineStageQualifiedName(stateMachine, 'dev')}`
    ),
    '--input',
    JSON.stringify(input),
  ]
  console.log(chalk.blue('AWS CLI StartExecution command:'))
  console.log(chalk.green(awsCliCmdSegments.join(' ')))
}

main()
