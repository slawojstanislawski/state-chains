import { StateMachineTestCases } from '@libs/stateMachine'

import { TestSuiteMockName } from '../snsPubSub.testSuiteMocks.type'
import { TaskResultMap } from '../types'
import { testSuiteInputs } from './snsPubSub.testSuiteInputs.e2e.js'

export const testSuiteE2E: StateMachineTestCases<
  TaskResultMap,
  TestSuiteMockName,
  keyof typeof testSuiteInputs & string
> = {
  TestCases: {
    HappyPath: {},
  },
}
