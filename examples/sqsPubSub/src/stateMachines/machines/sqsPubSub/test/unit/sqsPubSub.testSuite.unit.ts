import { StateMachineTestCases } from '@libs/stateMachine'

import { StateName } from '../../constants'
import { TestSuiteMockName } from '../sqsPubSub.testSuiteMocks.type'
import { TaskResultMap } from '../types'
import { testSuiteInputs } from './sqsPubSub.testSuiteInputs.unit.js'

export const testSuiteUnit: StateMachineTestCases<
  TaskResultMap,
  TestSuiteMockName,
  keyof typeof testSuiteInputs & string
> = {
  TestCases: {
    HappyPath: {
      [StateName.Dummy]: 'Dummy_SUCCESS',
    },
  },
}
