import dotenv from 'dotenv'

import * as TestsConfig from '../src/stateMachines/tests'
import { creteMockFileJson } from './testScripts/utils/createMockFileJson'
import { selectAndRunStateMachine } from './utils/selectAndRunStateMachine'

dotenv.config()

async function main() {
  creteMockFileJson(TestsConfig.testSuitesE2E, true)
  await selectAndRunStateMachine('offline', true, true)
}

main()
