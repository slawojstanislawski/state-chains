import fs from 'fs'
import inquirer from 'inquirer'
import path from 'path'

import { getStateMachineNames } from './getStateMachineNames'

function getTestSuitePath(machineName: string, isE2E = false) {
  const testKind = isE2E ? 'e2e' : 'unit'
  return path.join(
    process.cwd(),
    `/src/stateMachines/machines/${machineName}/test/${testKind}/${machineName}.testSuiteInputs.${testKind}.js`
  )
}
export const selectSmTestInput = async (isE2E = false) => {
  const stateMachineNames = getStateMachineNames()
  const questions = [
    {
      type: 'list',
      name: 'stateMachine',
      message: 'Select a state machine',
      choices: stateMachineNames.sort(),
    },
  ]
  const { stateMachine: stateMachineName } = await inquirer.prompt(questions)
  const testSuitePath = getTestSuitePath(stateMachineName, isE2E)

  if (!fs.existsSync(testSuitePath)) {
    console.log('testSuitePath', testSuitePath)
    console.error(`File not found for state machine: ${stateMachineName}`)
    process.exit(1)
  }
  const testSuiteInputs = require(testSuitePath).testSuiteInputs
  const testSuiteNames = Object.keys(testSuiteInputs)
  const { selectedTest } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedTest',
      message: 'Select a test suite:',
      choices: testSuiteNames.sort(),
    },
  ])
  const input = testSuiteInputs[selectedTest]
  const inputStr = JSON.stringify(input)
  return {
    stateMachine: stateMachineName,
    testName: selectedTest,
    input: inputStr,
  }
}
