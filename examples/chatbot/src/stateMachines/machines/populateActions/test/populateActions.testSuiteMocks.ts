import { v4 as uuidv4 } from 'uuid'

import { createMockNameToMockedIntegrationMap } from '@libs/aws/stepfunctions'
import { MockedServiceIntegrations } from '@libs/stateMachine'

import { StateName } from '../constants'
import { TestSuiteMockName } from './populateActions.testSuiteMocks.type'
import { TaskResultMap } from './types'

export const testSuiteMocks: MockedServiceIntegrations<
  TaskResultMap,
  TestSuiteMockName
> = {
  [StateName.ActionTextSave]: {
    ActionTextSave_SUCCESS: {
      '0': {
        Return: {
          Attributes: {
            id: {
              S: 'action-addEvent',
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
          Output: JSON.stringify(uuidv4()),
        },
      },
    },
  },
}

export const mockedIntegrations = createMockNameToMockedIntegrationMap<
  TaskResultMap,
  TestSuiteMockName
>(testSuiteMocks)
