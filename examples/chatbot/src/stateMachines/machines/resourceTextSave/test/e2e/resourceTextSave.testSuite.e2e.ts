import { StateMachineTestCases } from '@libs/stateMachine'

import { TestSuiteMockName } from '../resourceTextSave.testSuiteMocks.type'
import { TaskResultMap } from '../types'
import { testSuiteInputs } from './resourceTextSave.testSuiteinputs.e2e.js'

export const testSuiteE2E: StateMachineTestCases<
  TaskResultMap,
  TestSuiteMockName,
  keyof typeof testSuiteInputs & string
> = {
  TestCases: {
    HappyPathResourceTextSaveE2E: {},
  },
}
