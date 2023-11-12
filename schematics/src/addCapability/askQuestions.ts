import fs from 'fs'

import { getCapabilityNames } from './utils/getCapabilityNames'

const inquirer = require('inquirer')

export const askQuestions = async () => {
  const stateMachineNamesJson = fs.readFileSync(
    './schematics/src/stateMachineNames.json',
    'utf8'
  )
  const stateMachineNames = JSON.parse(stateMachineNamesJson)
  const capabilityNames = getCapabilityNames()
  const questions = [
    {
      type: 'list',
      name: 'state-machine',
      message: 'Select the target state machine',
      choices: stateMachineNames,
    },
    {
      type: 'checkbox',
      name: 'names',
      message: "Select capabilities to add ('space' to select)",
      choices: capabilityNames,
    },
  ]
  return await inquirer.prompt(questions)
}
