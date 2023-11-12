import { createMockNameToMockedIntegrationMap } from '@libs/aws/stepfunctions'
import { MockedServiceIntegrations } from '@libs/stateMachine'

import { StateName } from '../constants'
import { TestSuiteMockName } from './resourceVectorSave.testSuiteMocks.type'
import { TaskResultMap } from './types'

export const testSuiteMocks: MockedServiceIntegrations<
  TaskResultMap,
  TestSuiteMockName
> = {
  [StateName.ResourceTextGet]: {
    ResourceTextGet_SUCCESS: {
      '0': {
        Return: {
          Item: {
            id: {
              S: 1,
            },
            category: {
              S: 'memories',
            },
            title: {
              S: 'resource title',
            },
            description: {
              S: 'resource description',
            },
            tags: {
              S: 'resource tags',
            },
          },
        },
      },
    },
  },
  [StateName.ActionsTextGet]: {
    ActionsTextGet_SUCCESS: {
      '0': {
        Return: {
          Item: {
            id: {
              S: 1,
            },
            title: {
              S: 'action title',
            },
            description: {
              S: 'action description',
            },
          },
        },
      },
    },
  },
  [StateName.ResourceVectorCreate]: {
    VectorCreate_SUCCESS: {
      '0': {
        Return: {
          object: 'list',
          data: [
            {
              embedding: [1, 2, 3],
              index: 0,
              object: 'embedding',
            },
          ],
          model: 'text-embedding-ada-002-v2',
          usage: {
            prompt_tokens: 10,
            total_tokens: 10,
          },
        },
      },
    },
  },
  [StateName.ResourceVectorUpsert]: {
    VectorUpsert_SUCCESS: {
      '0': {
        Return: {
          upsertedCount: 1,
        },
      },
    },
  },
}

export const mockedIntegrations = createMockNameToMockedIntegrationMap<
  TaskResultMap,
  TestSuiteMockName
>(testSuiteMocks)
