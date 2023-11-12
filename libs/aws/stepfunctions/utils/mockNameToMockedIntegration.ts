import {
  MockedIntegration,
  MockedServiceIntegrations,
} from '../../../stateMachine'

export function createMockNameToMockedIntegrationMap<
  TaskToResultMap,
  MockNames extends string
>(
  integrations: MockedServiceIntegrations<TaskToResultMap, MockNames>
): Partial<
  Record<MockNames, MockedIntegration<TaskToResultMap, keyof TaskToResultMap>>
> {
  const mocks =
    Object.values<
      Partial<
        Record<
          MockNames,
          MockedIntegration<TaskToResultMap, keyof TaskToResultMap>
        >
      >
    >(integrations)
  return mocks.reduce((acc, curr) => {
    return { ...acc, ...curr }
  }, {} as Partial<Record<MockNames, MockedIntegration<TaskToResultMap, keyof TaskToResultMap>>>)
}
