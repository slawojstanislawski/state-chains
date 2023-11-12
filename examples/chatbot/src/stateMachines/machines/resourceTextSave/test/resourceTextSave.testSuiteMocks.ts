import { createMockNameToMockedIntegrationMap } from '@libs/aws/stepfunctions'
import { MockedServiceIntegrations } from '@libs/stateMachine'

import { StateName } from '../constants'
import { TestSuiteMockName } from './resourceTextSave.testSuiteMocks.type'
import { TaskResultMap } from './types'

export const testSuiteMocks: MockedServiceIntegrations<
  TaskResultMap,
  TestSuiteMockName
> = {
  [StateName.ResourceEnrichOpenAi]: {
    ResourceEnrichOpenAi_SUCCESS: {
      '0': {
        Return: {
          data: JSON.stringify({
            title: 'Being a Child',
            tags: 'childhood, growing up, life',
            url: '',
          }),
        },
      },
    },
  },
  [StateName.ResourceTextSave]: {
    ResourceTextSave_SUCCESS: {
      '0': {
        Return: {
          Attributes: {
            id: {
              S: '1',
            },
          },
        },
      },
    },
  },
  [StateName.StartResourceSaveVectorStateMachine]: {
    StartResourceSaveVectorStateMachine_SUCCESS: {
      '0': {
        Return: {
          Output: JSON.stringify({ id: '123' }),
        },
      },
    },
  },
}

export const mockedIntegrations = createMockNameToMockedIntegrationMap<
  TaskResultMap,
  TestSuiteMockName
>(testSuiteMocks)
