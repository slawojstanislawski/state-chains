import { createMockNameToMockedIntegrationMap } from '@libs/aws/stepfunctions'
import { MockedServiceIntegrations } from '@libs/stateMachine'

import { StateName } from '../constants'
import { TestSuiteMockName } from './bookStore.testSuiteMocks.type'
import { TaskResultMap } from './types'

export const testSuiteMocks: MockedServiceIntegrations<
  TaskResultMap,
  TestSuiteMockName
> = {
  [StateName.PutFirst]: {
    PutFirst_SUCCESS: {
      '0': {
        Return: {
          Attributes: {
            id: {
              S: '123',
            },
          },
        },
      },
    },
  },
}

export const mockedIntegrations = createMockNameToMockedIntegrationMap<
  TaskResultMap,
  TestSuiteMockName
>(testSuiteMocks)
