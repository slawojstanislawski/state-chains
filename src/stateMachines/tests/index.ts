import { TestSuite } from '@libs/stateMachine'

type TestSuiteConfiguration = {}

const testCasesUnit = {
  StateMachines: {},
}

const testCasesE2E = {
  StateMachines: {},
}

const mockedIntegrations = {
  MockedResponses: {},
}

type TestSuiteMockNames = undefined

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
