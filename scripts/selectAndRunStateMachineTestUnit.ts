import dotenv from 'dotenv'

import * as TestsConfig from '../src/stateMachines/tests'
import { creteMockFileJson } from './testScripts/utils/createMockFileJson'
import { selectAndRunStateMachine } from './utils/selectAndRunStateMachine'

dotenv.config()

async function main() {
  creteMockFileJson(TestsConfig.testSuitesUnit, true)
  await selectAndRunStateMachine('offline', true)
}

main()
