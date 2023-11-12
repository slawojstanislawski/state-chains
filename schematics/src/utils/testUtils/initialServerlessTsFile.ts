export const initialServerlessTsFile = `import dotenv from 'dotenv'

import { CustomServerless } from './serverless.types'

dotenv.config()

const serverlessConfiguration: CustomServerless = {
  service: 'stepfunctions',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: [],
  package: { individually: true },
  custom: {
    stepFunctionsLocal: {
      TaskResourceMapping: {},
    },
    dynamodb: {
      seed: {
        standard: {
          sources: [],
        },
      },
    },
  },
  provider: {
    environment: {}
  },
  resources: {
    Resources: {}
  },
  functions: {},
  stepFunctions: {
    stateMachines: {},
  },
}

module.exports = serverlessConfiguration`
