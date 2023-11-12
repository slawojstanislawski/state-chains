import { TestSuite } from '@libs/stateMachine'
import * as BookStore from "@stateMachines/machines/bookStore";
import * as BookStoreTest from "@stateMachines/machines/bookStore/test";

type TestSuiteConfiguration = {
  [BookStore.name]: BookStoreTest.TaskResultMap;
}

const testCasesUnit = {
  StateMachines: {
    [BookStore.name]: BookStoreTest.testSuiteUnit
  },
}

const testCasesE2E = {
  StateMachines: {
    [BookStore.name]: BookStoreTest.testSuiteE2E
  },
}

const mockedIntegrations = {
  MockedResponses: {
    ...BookStoreTest.mockedIntegrations
  },
}

type TestSuiteMockNames = | BookStoreTest.TestSuiteMockName

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
