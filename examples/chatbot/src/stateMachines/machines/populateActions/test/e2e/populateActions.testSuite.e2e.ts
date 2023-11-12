import { StateMachineTestCases } from '@libs/stateMachine'

import { TestSuiteMockName } from '../populateActions.testSuiteMocks.type'
import { TaskResultMap } from '../types'
import { testSuiteInputs } from './populateActions.testSuiteInputs.e2e.js'

export const testSuiteE2E: StateMachineTestCases<
  TaskResultMap,
  TestSuiteMockName,
  keyof typeof testSuiteInputs & string
> = {
  TestCases: {},
}
