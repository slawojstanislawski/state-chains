const { functions } = require('../../serverless')

export const getFunctionNames = () => {
  return Object.keys(functions).map((functionName) => {
    return { value: functionName }
  })
}
