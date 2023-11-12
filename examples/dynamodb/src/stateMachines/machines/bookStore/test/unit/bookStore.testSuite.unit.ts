import { StateMachineTestCases } from '@libs/stateMachine'

import { StateName } from '../../constants'
import { TestSuiteMockName } from '../bookStore.testSuiteMocks.type'
import { TaskResultMap } from '../types'
import { testSuiteInputs } from './bookStore.testSuiteInputs.unit.js'

export const testSuiteUnit: StateMachineTestCases<
  TaskResultMap,
  TestSuiteMockName,
  keyof typeof testSuiteInputs & string
> = {
  TestCases: {
    HappyPath: {
      [StateName.PutFirst]: 'PutFirst_SUCCESS',
    },
  },
}
