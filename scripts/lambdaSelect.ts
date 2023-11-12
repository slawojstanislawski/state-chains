import { askForFunctionNameAndPayload } from './utils/askForFunctionNameAndPayload'
import { invokeLambda } from './utils/invokeLambda'

const main = async () => {
  const { functionName, payload } = await askForFunctionNameAndPayload()

  return await invokeLambda(functionName, payload)
}

main()
