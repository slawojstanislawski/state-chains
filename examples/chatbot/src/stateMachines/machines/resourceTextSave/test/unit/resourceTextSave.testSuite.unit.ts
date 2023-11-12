import { StateMachineTestCases } from '@libs/stateMachine'

import { StateName } from '../../constants'
import { TestSuiteMockName } from '../resourceTextSave.testSuiteMocks.type'
import { TaskResultMap } from '../types'
import { testSuiteInputs } from './resourceTextSave.testSuiteInputs.unit.js'

export const testSuiteUnit: StateMachineTestCases<
  TaskResultMap,
  TestSuiteMockName,
  keyof typeof testSuiteInputs & string
> = {
  TestCases: {
    HappyPathResourceTextSave: {
      [StateName.ResourceEnrichOpenAi]: 'ResourceEnrichOpenAi_SUCCESS',
      [StateName.ResourceTextSave]: 'ResourceTextSave_SUCCESS',
      [StateName.StartResourceSaveVectorStateMachine]:
        'StartResourceSaveVectorStateMachine_SUCCESS',
    },
  },
}
