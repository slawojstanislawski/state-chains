import { StateMachineTestCases } from '@libs/stateMachine'

import { TestSuiteMockName } from '../resourceVectorSave.testSuiteMocks.type'
import { TaskResultMap } from '../types'
import { testSuiteInputs } from './resourceVectorSave.testSuiteInputs.e2e.js'

export const testSuiteE2E: StateMachineTestCases<
  TaskResultMap,
  TestSuiteMockName,
  keyof typeof testSuiteInputs & string
> = {
  TestCases: {},
}
