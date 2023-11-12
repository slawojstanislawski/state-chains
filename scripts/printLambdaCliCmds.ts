import chalk from 'chalk'
import dotenv from 'dotenv'

import { askForFunctionNameAndPayload } from './utils/askForFunctionNameAndPayload'

dotenv.config()

async function main() {
  const { functionName, payload } = await askForFunctionNameAndPayload()
  const slsInvokeCmdSegments = [
    'sls',
    'invoke',
    'local',
    '--function',
    functionName,
    '--data',
    JSON.stringify(payload),
    '--stage',
    'offline',
  ]
  console.log(chalk.blue('SLS Invoke command:'), chalk.yellow(' (great logs)'))
  console.log(chalk.green(slsInvokeCmdSegments.join(' ')))
  const awsCliCmdSegments = [
    'aws',
    'lambda',
    'invoke',
    '--endpoint-url',
    `http://${process.env.OFFLINE_HOST}:${process.env.OFFLINE_LAMBDA_PORT}`,
    '--function-name',
    `${process.env.PROJECT_NAME}-offline-${functionName}`,
    '--payload',
    JSON.stringify(payload),
    '--cli-binary-format raw-in-base64-out',
    '/dev/stdout',
  ]
  console.log(
    chalk.blue('AWS CLI Lambda Invoke command'),
    chalk.yellow(' (worse logs)')
  )
  console.log(chalk.green(awsCliCmdSegments.join(' ')))
}

main()
