import chalk from 'chalk'
import dotenv from 'dotenv'
import path from 'path'

import { startExecution } from '../../libs/aws/stepfunctions'
import {
  getExecutionHistory,
  pollDescribeExecution,
} from '../../libs/aws/stepfunctions'
import * as TestsConfig from '../../src/stateMachines/tests'
import { getStateMachineNames } from '../utils/getStateMachineNames'
import { handleExecutionResults } from '../utils/handleExecutionResults'
import { creteMockFileJson } from './utils/createMockFileJson'

dotenv.config()

const buildInputPath = (stateMachineName: string, isE2E = false) => {
  return path.join(
    process.cwd(),
    'src',
    'stateMachines',
    'machines',
    stateMachineName,
    'test',
    isE2E ? 'e2e' : 'unit',
    `${stateMachineName}.testSuiteInputs.${isE2E ? 'e2e' : 'unit'}.js`
  )
}

const succeeded = []
const failed = []

const specificStateMachineName = process.argv[2] || ''
const specificTestName = process.argv[3] || ''

const renderCliMessage = (message: string, color: Function) => {
  const asterisksCount = message.length + 4
  console.log(color('*'.repeat(asterisksCount)))
  console.log(color(`* ${message} *`))
  console.log(color('*'.repeat(asterisksCount)))
}

export const runTests = async (isE2E: boolean) => {
  const testConfig = isE2E
    ? TestsConfig.testSuitesE2E
    : TestsConfig.testSuitesUnit
  creteMockFileJson(testConfig)
  const allStateMachineNames = getStateMachineNames(testConfig)
  const stateMachineNames = specificStateMachineName
    ? [specificStateMachineName]
    : allStateMachineNames
  const testsPromises = await Promise.all(
    stateMachineNames.map(async (stateMachineName) => {
      // @ts-ignore
      const { testSuiteInputs } = await import(
        buildInputPath(stateMachineName, isE2E)
      )
      const testNames = specificTestName
        ? [specificTestName]
        : Object.keys(testConfig.StateMachines[stateMachineName].TestCases)
      return testNames.map((testName) => {
        const stateMachineTestName = `${stateMachineName}#${testName}` as const
        const testInput = JSON.stringify(testSuiteInputs[testName])
        return {
          name: stateMachineTestName,
          input: testInput,
        }
      })
    })
  )
  const tests = testsPromises.flat(1)
  for (const { name: testName, input } of tests) {
    let executionArn: string
    try {
      const results = await startExecution(testName, input)
      executionArn = results.executionArn
    } catch (e) {
      console.log(chalk.red(`Failed to run ${testName}:`))
      console.log(chalk.red(JSON.stringify(e, null, 2)))
      return
    }
    console.log(chalk.blue(`${testName} Started!`))
    const { executionArn: finishedExecutionArn } = await pollDescribeExecution(
      executionArn
    )
    const res = await getExecutionHistory(finishedExecutionArn)
    handleExecutionResults(res, testName, succeeded, failed)
  }

  renderCliMessage(`SUMMARY`, chalk.blue)
  if (succeeded.length) {
    console.log(chalk.green('Passed:'))
    console.log(chalk.green(succeeded.join('\n')))
  }
  if (failed.length) {
    console.log(chalk.red('Failed:'))
    console.log(chalk.red(failed.join('\n')))
  }
}
