import { TestSuite } from '../../libs/stateMachine'

const {
  stepFunctions: { stateMachines },
} = require('../../serverless')

export function getStateMachineNames(testConfig: TestSuite<any, any> = null) {
  if (testConfig) {
    return Object.keys(testConfig.StateMachines) as Array<
      keyof typeof testConfig.StateMachines & string
    >
  }
  return Object.keys(stateMachines)
}
