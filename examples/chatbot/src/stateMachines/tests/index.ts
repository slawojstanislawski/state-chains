import { TestSuite } from '@libs/stateMachine'

import * as ActionAddQuickEvent from '../machines/actionAddQuickEvent'
import * as ActionAddQuickEventTest from '../machines/actionAddQuickEvent/test'
import * as PopulateActions from '../machines/populateActions'
import * as PopulateActionsTest from '../machines/populateActions/test'
import * as Query from '../machines/query'
import * as QueryTest from '../machines/query/test'
import * as ResourceTextSave from '../machines/resourceTextSave'
import * as ResourceTextSaveTest from '../machines/resourceTextSave/test'
import * as ResourceVectorSave from '../machines/resourceVectorSave'
import * as ResourceVectorSaveTest from '../machines/resourceVectorSave/test'

type TestSuiteConfiguration = {
  [ActionAddQuickEvent.name]: ActionAddQuickEventTest.TaskResultMap
  [ResourceVectorSave.name]: ResourceVectorSaveTest.TaskResultMap
  [ResourceTextSave.name]: ResourceTextSaveTest.TaskResultMap
  [Query.name]: QueryTest.TaskResultMap
  [PopulateActions.name]: PopulateActionsTest.TaskResultMap
}

const testCasesUnit = {
  StateMachines: {
    [ActionAddQuickEvent.name]: ActionAddQuickEventTest.testSuiteUnit,
    [ResourceVectorSave.name]: ResourceVectorSaveTest.testSuiteUnit,
    [ResourceTextSave.name]: ResourceTextSaveTest.testSuiteUnit,
    [Query.name]: QueryTest.testSuiteUnit,
    [PopulateActions.name]: PopulateActionsTest.testSuiteUnit,
  },
}

const testCasesE2E = {
  StateMachines: {
    [ActionAddQuickEvent.name]: ActionAddQuickEventTest.testSuiteE2E,
    [ResourceVectorSave.name]: ResourceVectorSaveTest.testSuiteE2E,
    [ResourceTextSave.name]: ResourceTextSaveTest.testSuiteE2E,
    [Query.name]: QueryTest.testSuiteE2E,
    [PopulateActions.name]: PopulateActionsTest.testSuiteE2E,
  },
}

const mockedIntegrations = {
  MockedResponses: {
    ...ActionAddQuickEventTest.mockedIntegrations,
    ...ResourceVectorSaveTest.mockedIntegrations,
    ...ResourceTextSaveTest.mockedIntegrations,
    ...QueryTest.mockedIntegrations,
    ...PopulateActionsTest.mockedIntegrations,
  },
}

type TestSuiteMockNames =
  | ActionAddQuickEventTest.TestSuiteMockName
  | ResourceVectorSaveTest.TestSuiteMockName
  | ResourceTextSaveTest.TestSuiteMockName
  | QueryTest.TestSuiteMockName
  | PopulateActionsTest.TestSuiteMockName

export const testSuitesUnit: TestSuite<
  TestSuiteConfiguration,
  TestSuiteMockNames
> = {
  ...testCasesUnit,
  ...mockedIntegrations,
}
export const testSuitesE2E: TestSuite<
  TestSuiteConfiguration,
  TestSuiteMockNames
> = {
  ...testCasesE2E,
  ...mockedIntegrations,
}
