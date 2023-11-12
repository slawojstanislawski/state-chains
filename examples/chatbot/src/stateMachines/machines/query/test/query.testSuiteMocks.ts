import { createMockNameToMockedIntegrationMap } from '@libs/aws/stepfunctions'
import { MockedServiceIntegrations } from '@libs/stateMachine'
import { DdbTableResources } from '@resources/dynamodb'

import { Category } from '../../../constants/category'
import { StateName } from '../constants'
import type { TestSuiteMockName } from './query.testSuiteMocks.type'
import type { TaskResultMap } from './types'

export const testSuiteMocks: MockedServiceIntegrations<
  TaskResultMap,
  TestSuiteMockName
> = {
  [StateName.NewLatestConversationId]: {
    NewLatestConversationId_SUCCESS: {
      '0': {
        Return: {
          Attributes: {
            id: {
              S: 'abcd',
            },
            latestConversationId: {
              S: '123',
            },
          },
        },
      },
    },
  },
  [StateName.IdentifyQueryCategoryOpenAi]: {
    IdentifyQueryCategoryOpenAi_SUCCESS_MEMORIES: {
      '0': {
        Return: {
          data: Category.MEMORIES,
        },
      },
    },
    IdentifyQueryCategoryOpenAi_SUCCESS_ACTIONS: {
      '0': {
        Return: {
          data: Category.ACTIONS,
        },
      },
    },
  },
  [StateName.QueryVectorCreatePinecone]: {
    QueryVectorCreatePinecone_SUCCESS: {
      '0': {
        Return: {
          model: 'ada-2',
          object: 'embedding',
          usage: {
            total_tokens: 10,
            prompt_tokens: 10,
          },
          data: [
            {
              object: 'embedding',
              index: 1,
              embedding: [1, 2, 3],
            },
          ],
        },
      },
    },
  },
  [StateName.QueryVectorSearchPineconeMemories]: {
    QueryVectorSearchPineconeMemories_SUCCESS: {
      '0': {
        Return: [
          {
            id: 'to-be-filtered-out',
            score: 1,
            values: [1, 2, 3],
            metadata: {
              category: Category.MEMORIES,
            },
          },
          {
            id: 'to-be-preserved-after-filtering',
            score: 9,
            values: [9, 8, 7],
            metadata: {
              category: Category.MEMORIES,
            },
          },
        ],
      },
    },
  },
  [StateName.QueryVectorSearchPineconeActions]: {
    QueryVectorSearchPineconeActions_SUCCESS: {
      '0': {
        Return: [
          {
            id: '1',
            score: 2,
            values: [1, 2, 3],
            metadata: {
              category: Category.ACTIONS,
            },
          },
        ],
      },
    },
  },
  [StateName.ContextCollectResources]: {
    ContextCollectResources_SUCCESS: {
      '0': {
        Return: [
          {
            id: 'to-be-preserved-after-filtering',
            tags: 'a, b, c',
            category: DdbTableResources.Category.MEMORIES,
            description: 'I lived in Italy until 2010',
            title: 'Childhood memories',
          },
        ],
      },
    },
  },
  [StateName.SaveContext]: {
    SaveContext_SUCCESS: {
      '0': {
        Return: {
          Attributes: {
            conversation_id: {
              S: '1',
            },
            content: {
              S: 'Childhood memories: I lived in Italy until 2010',
            },
          },
        },
      },
    },
  },
  [StateName.QuestionAdd]: {
    QuestionAdd_SUCCESS: {
      '0': {
        Return: {
          Attributes: {
            id: {
              S: '1',
            },
            question: {
              S: 'Have I ever lived in Italy?',
            },
            created_at: {
              S: new Date().toUTCString(),
            },
          },
        },
      },
    },
  },
  [StateName.GetConversation]: {
    GetConversation_SUCCESS: {
      '0': {
        Return: [
          {
            id: '1',
            question: 'Have I ever lived in Italy?',
            created_at: new Date().toUTCString(),
            answer: '',
          },
        ],
      },
    },
  },
  [StateName.ConversationOpenAi]: {
    ConversationOpenAi_SUCCESS: {
      '0': {
        Return: {
          data: 'Yes, based on your childhood memories, you lived in Italy until 2010',
        },
      },
    },
  },
  [StateName.SaveQueryAnswer]: {
    SaveQueryAnswer_SUCCESS: {
      '0': {
        Return: {
          Attributes: {
            id: {
              S: '1',
            },
            question: {
              S: 'Have I ever lived in Italy?',
            },
            answer: {
              S: 'Yes, based on your childhood memories, you lived in Italy until 2010',
            },
            created_at: {
              S: new Date().toUTCString(),
            },
          },
        },
      },
    },
  },
  [StateName.GetLatestConversationId]: {
    GetLatestConversationId_SUCCESS: {
      '0': {
        Return: {
          Item: {
            latestConversationId: {
              S: '1',
            },
            id: {
              S: '123',
            },
          },
        },
      },
    },
  },
  [StateName.GetContextForConversationId]: {
    GetContextForConversationId_SUCCESS: {
      '0': {
        Return: {
          Item: {
            conversation_id: {
              S: 1,
            },
            content: {
              S: 'I lived in Italy until 2010',
            },
          },
        },
      },
    },
  },
  [StateName.UpdateLatestConversationId]: {
    UpdateLatestConversationId_SUCCESS: {
      '0': {
        Return: {
          Attributes: {
            id: {
              S: '123',
            },
            latestConversationId: {
              S: '1',
            },
          },
        },
      },
    },
  },
  [StateName.ContextCollectAction]: {
    ContextCollectAction_SUCCESS: {
      '0': {
        Return: [
          {
            id: 'action-calendarAddEvent',
            description: 'adds a simple event to google calendar',
            title: 'Add Calendar Event',
            stateMachineArn: 'arn::aws::invalidARN',
            tags: 'event, time, calendar',
          },
        ],
      },
    },
  },
  [StateName.ActionOpenAi]: {
    ActionOpenAi_SUCCESS: {
      '0': {
        Return: {
          data: JSON.stringify({
            eventText: '2023-07-01 Playing tennis',
          }),
        },
      },
    },
  },
  [StateName.ExecuteActionStateMachine]: {
    ExecuteActionStateMachine_SUCCESS: {
      '0': {
        Return: {
          Output: JSON.stringify(
            'Event added: url: https://some.google.calendar.url/some-event-id'
          ),
        },
      },
    },
  },
}

export const mockedIntegrations = createMockNameToMockedIntegrationMap<
  TaskResultMap,
  TestSuiteMockName
>(testSuiteMocks)
