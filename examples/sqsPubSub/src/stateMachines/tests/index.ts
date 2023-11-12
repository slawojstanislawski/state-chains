import { TestSuite } from '@libs/stateMachine'
import * as SqsPubSub from '@stateMachines/machines/sqsPubSub'
import * as SqsPubSubTest from '@stateMachines/machines/sqsPubSub/test'

type TestSuiteConfiguration = {
  [SqsPubSub.name]: SqsPubSubTest.TaskResultMap
}

const testCasesUnit = {
  StateMachines: {
    [SqsPubSub.name]: SqsPubSubTest.testSuiteUnit,
  },
}

const testCasesE2E = {
  StateMachines: {
    [SqsPubSub.name]: SqsPubSubTest.testSuiteE2E,
  },
}

const mockedIntegrations = {
  MockedResponses: {
    ...SqsPubSubTest.mockedIntegrations,
  },
}

type TestSuiteMockNames = SqsPubSubTest.TestSuiteMockName

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
