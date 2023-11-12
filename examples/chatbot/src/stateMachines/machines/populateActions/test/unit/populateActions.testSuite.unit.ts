import { StateMachineTestCases } from '@libs/stateMachine'

import { StateName } from '../../constants'
import { TestSuiteMockName } from '../populateActions.testSuiteMocks.type'
import { TaskResultMap } from '../types'
import { testSuiteInputs } from './populateActions.testSuiteInputs.unit.js'

export const testSuiteUnit: StateMachineTestCases<
  TaskResultMap,
  TestSuiteMockName,
  keyof typeof testSuiteInputs & string
> = {
  TestCases: {
    HappyPath: {
      [StateName.ActionTextSave]: 'ActionTextSave_SUCCESS',
      [StateName.StartResourceSaveVectorStateMachine]:
        'StartResourceSaveVectorStateMachine_SUCCESS',
    },
  },
}
