import { StateMachineTestCases } from '@libs/stateMachine'

import { StateName } from '../../constants'
import { TestSuiteMockName } from '../actionAddQuickEvent.testSuiteMocks.type'
import { TaskResultMap } from '../types'
import { testSuiteInputs } from './actionAddQuickEvent.testSuiteInputs.unit.js'

export const testSuiteUnit: StateMachineTestCases<
  TaskResultMap,
  TestSuiteMockName,
  keyof typeof testSuiteInputs & string
> = {
  TestCases: {
    HappyPath: {
      [StateName.CalendarAddQuickEvent]: 'CalendarAddQuickEvent_SUCCESS',
    },
  },
}
