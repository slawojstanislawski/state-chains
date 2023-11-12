import { TestSuite } from '@libs/stateMachine'
import * as SnsPubSub from "@stateMachines/machines/snsPubSub";
import * as SnsPubSubTest from "@stateMachines/machines/snsPubSub/test";

type TestSuiteConfiguration = {
  [SnsPubSub.name]: SnsPubSubTest.TaskResultMap;
}

const testCasesUnit = {
  StateMachines: {
    [SnsPubSub.name]: SnsPubSubTest.testSuiteUnit
  },
}

const testCasesE2E = {
  StateMachines: {
    [SnsPubSub.name]: SnsPubSubTest.testSuiteE2E
  },
}

const mockedIntegrations = {
  MockedResponses: {
    ...SnsPubSubTest.mockedIntegrations
  },
}

type TestSuiteMockNames = | SnsPubSubTest.TestSuiteMockName

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
