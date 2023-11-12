import { StateMachineTestCases } from '@libs/stateMachine'

import { TestSuiteMockName } from '../sqsPubSub.testSuiteMocks.type'
import { TaskResultMap } from '../types'
import { testSuiteInputs } from './sqsPubSub.testSuiteInputs.e2e.js'

export const testSuiteE2E: StateMachineTestCases<
  TaskResultMap,
  TestSuiteMockName,
  keyof typeof testSuiteInputs & string
> = {
  TestCases: {
    HappyPath: {},
  },
}
