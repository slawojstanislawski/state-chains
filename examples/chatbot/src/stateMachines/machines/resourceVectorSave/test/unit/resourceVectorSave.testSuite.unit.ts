import { StateMachineTestCases } from '@libs/stateMachine'

import { StateName } from '../../constants'
import { TestSuiteMockName } from '../resourceVectorSave.testSuiteMocks.type'
import { TaskResultMap } from '../types'
import { testSuiteInputs } from './resourceVectorSave.testSuiteInputs.unit.js'

export const testSuiteUnit: StateMachineTestCases<
  TaskResultMap,
  TestSuiteMockName,
  keyof typeof testSuiteInputs & string
> = {
  TestCases: {
    HappyPathResourceVectorSave: {
      [StateName.ResourceTextGet]: 'ResourceTextGet_SUCCESS',
      [StateName.ResourceVectorCreate]: 'VectorCreate_SUCCESS',
      [StateName.ResourceVectorUpsert]: 'VectorUpsert_SUCCESS',
    },
    HappyPathActionVectorSave: {
      [StateName.ActionsTextGet]: 'ActionsTextGet_SUCCESS',
      [StateName.ResourceVectorCreate]: 'VectorCreate_SUCCESS',
      [StateName.ActionVectorUpsert]: 'VectorUpsert_SUCCESS',
    },
  },
}
