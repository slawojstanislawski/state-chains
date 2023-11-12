import fs from 'fs'

const inquirer = require('inquirer')

export const askQuestions = async () => {
  const stateMachineNamesJson = fs.readFileSync(
    './schematics/src/stateMachineNames.json',
    'utf8'
  )
  const stateMachineNames = JSON.parse(stateMachineNamesJson)
  const questions = [
    {
      type: 'list',
      name: 'state-machine',
      message: 'Select the target state machine',
      choices: stateMachineNames,
    },
  ]
  return await inquirer.prompt(questions)
}
