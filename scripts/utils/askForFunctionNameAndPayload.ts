import { input, select } from '@inquirer/prompts'

import { getFunctionNames } from './getFunctionNames'

export const askForFunctionNameAndPayload = async () => {
  const functionNames = getFunctionNames()

  const { functionName, payload } = {
    functionName: await select({
      message: 'Choose a function:',
      choices: functionNames,
    }),
    payload: await input({ message: 'Enter the payload (JSON format):' }),
  }
  return { functionName, payload }
}
