import { isOffline } from '@libs/utils'
import {
  DdbTableActions,
  DdbTableContext,
  DdbTableConversation,
  DdbTableLatestConversationId,
  DdbTableResources,
} from '@resources/dynamodb'

import { StateMachine } from '../../../../serverless.types'
import { Category } from '../../constants/category'
import {
  COLLECTED_CONTEXT_ITEMS_PATH,
  CATEGORY_PATH,
  CONVERSATION_PATH,
  SYS_MSG_PATH,
} from '../../constants/paths'
import {
  stageQualifiedId,
  stageQualifiedName,
  name,
  StateName,
} from './constants'
import { createChain } from './query.createChain'

export const stateChain = createChain()
  .addChoiceState(StateName.IsNewConversationRouter, {
    Choices: [
      {
        Variable: '$.isNew',
        IsPresent: false,
        Next: StateName.SelectConversationToContinue,
      },
      {
        Variable: '$.isNew',
        BooleanEquals: true,
        Next: StateName.NewLatestConversationId,
      },
      {
        Variable: '$.isNew',
        BooleanEquals: false,
        Next: StateName.SelectConversationToContinue,
      },
    ],
    Default: StateName.SelectConversationToContinue,
  })
  .addChain(
    'new conversation - create and save context',
    createChain()
      .addDdbItemUpdateTaskState<
        DdbTableLatestConversationId.KeysType,
        DdbTableLatestConversationId.RecordType
      >(StateName.NewLatestConversationId, {
        tableName: DdbTableLatestConversationId.stageQualifiedName,
        key: {
          id: { S: '1' },
        },
        attributeValues: {
          ':latestConversationId': {
            'S.$': 'States.UUID()',
          },
        },
        returnValues: 'ALL_NEW',
        task: {
          ResultSelector: {
            'id.$': '$.Attributes.latestConversationId.S',
          },
          ResultPath: CONVERSATION_PATH,
          Next: StateName.IdentifyQueryCategoryOpenAiPrepare,
        },
      })
      .addLambdaTaskState(StateName.IdentifyQueryCategoryOpenAiPrepare)
      .addLambdaTaskState(StateName.IdentifyQueryCategoryOpenAi, {
        payload: {
          'messages.$': `$.${StateName.IdentifyQueryCategoryOpenAiPrepare}`,
        },
        task: {
          ResultPath: CATEGORY_PATH,
        },
      })
      .addLambdaTaskState(StateName.QueryVectorCreatePinecone, {
        payload: {
          'data.$': '$.query',
        },
      })
      .addChoiceState(StateName.QueryVectorSearchPinecone, {
        Choices: [
          {
            Variable: `${CATEGORY_PATH}.data`,
            StringMatches: Category.ACTIONS as string,
            Next: StateName.QueryVectorSearchPineconeActions,
          },
          {
            Variable: `${CATEGORY_PATH}.data`,
            StringMatches: Category.MEMORIES as string,
            Next: StateName.QueryVectorSearchPineconeMemories,
          },
        ],
        Default: StateName.ActionOrMemoryBranchingFail,
      })
      .addLambdaTaskState(StateName.QueryVectorSearchPineconeActions, {
        payload: {
          topK: 1,
          'vector.$': `$.${StateName.QueryVectorCreatePinecone}.data[0].embedding`,
          includeMetadata: true,
          filter: {
            category: {
              $eq: Category.ACTIONS,
            },
          },
        },
        task: {
          ResultPath: `$.${StateName.QueryVectorSearchPinecone}`,
          Next: StateName.VectorSearchResultsProcess,
        },
      })
      .addLambdaTaskState(StateName.QueryVectorSearchPineconeMemories, {
        payload: {
          topK: 5,
          'vector.$': `$.${StateName.QueryVectorCreatePinecone}.data[0].embedding`,
          includeMetadata: true,
          filter: {
            category: {
              $ne: Category.ACTIONS,
            },
          },
        },
        task: {
          ResultPath: `$.${StateName.QueryVectorSearchPinecone}`,
          Next: StateName.VectorSearchResultsProcess,
        },
      })
      .addLambdaTaskState(StateName.VectorSearchResultsProcess, {
        payload: {
          'matches.$': `$.${StateName.QueryVectorSearchPinecone}`,
        },
      })
      .addChain(
        'collect context items',
        createChain()
          .addChoiceState(StateName.ContextCollectRouter, {
            Choices: [
              {
                Variable: `${CATEGORY_PATH}.data`,
                IsPresent: false, // no category inference for existing conversations
                Next: StateName.ContextCollectResources,
              },
              {
                Variable: `${CATEGORY_PATH}.data`,
                StringMatches: Category.ACTIONS,
                Next: StateName.ContextCollectAction,
              },
              {
                Variable: `${CATEGORY_PATH}.data`,
                StringMatches: Category.MEMORIES,
                Next: StateName.ContextCollectResources,
              },
            ],
          })
          .addLambdaTaskState(StateName.ContextCollectResources, {
            payload: {
              tableName: DdbTableResources.stageQualifiedName,
              'ids.$': `$.${StateName.VectorSearchResultsProcess}.ids`,
            },
            task: {
              ResultPath: COLLECTED_CONTEXT_ITEMS_PATH,
              Next: StateName.ContextResourcesToContextString,
            },
          })
          .addLambdaTaskState(StateName.ContextCollectAction, {
            payload: {
              tableName: DdbTableActions.stageQualifiedName,
              'ids.$': `$.${StateName.VectorSearchResultsProcess}.ids`,
            },
            // TODO SS: this could just be getItem, not batchGet, for action
            task: {
              ResultPath: COLLECTED_CONTEXT_ITEMS_PATH,
              Next: StateName.ContextResourcesToContextString,
            },
          })
      )
      .addLambdaTaskState(StateName.ContextResourcesToContextString, {
        payload: {
          'resources.$': COLLECTED_CONTEXT_ITEMS_PATH,
        },
      })
      .addDdbItemUpdateTaskState<
        DdbTableContext.KeysType,
        DdbTableContext.RecordType
      >(StateName.SaveContext, {
        tableName: DdbTableContext.stageQualifiedName,
        key: {
          conversation_id: {
            'S.$': `${CONVERSATION_PATH}.id`,
          },
        },
        attributeValues: {
          ':content': {
            'S.$': `$.${StateName.ContextResourcesToContextString}`,
          },
        },
        returnValues: 'ALL_NEW',
        task: {
          ResultSelector: {
            'content.$': '$.Attributes.content.S',
          },
          ResultPath: '$.context',
          Next: StateName.SystemMessageOpenAiPrepareRouter,
        },
      })
  ) // END OF: new conversation - create and save context
  .addChain(
    'existing conversation - simply get context',
    createChain()
      .addChoiceState(StateName.SelectConversationToContinue, {
        Choices: [
          {
            Variable: `${CONVERSATION_PATH}.id`,
            IsPresent: true,
            Next: StateName.UpdateLatestConversationId,
          },
          {
            Variable: `${CONVERSATION_PATH}`,
            IsPresent: false,
            Next: StateName.GetLatestConversationId,
          },
        ],
      })
      .addDdbItemGetTaskState<
        DdbTableLatestConversationId.KeysType,
        DdbTableLatestConversationId.RecordType
      >(StateName.GetLatestConversationId, {
        tableName: DdbTableLatestConversationId.stageQualifiedName,
        key: {
          id: {
            S: '1',
          },
        },
        attrsToGet: { id: true, latestConversationId: true },
        resultSelector: {
          'id.$': '$.Item.latestConversationId.S',
        } as any,
        task: {
          ResultPath: CONVERSATION_PATH,
          Next: StateName.GetContextForConversationId,
        },
      })
      .addDdbItemUpdateTaskState<
        DdbTableLatestConversationId.KeysType,
        DdbTableLatestConversationId.RecordType
      >(StateName.UpdateLatestConversationId, {
        tableName: DdbTableLatestConversationId.stageQualifiedName,
        key: {
          id: { S: '1' },
        },
        attributeValues: {
          ':latestConversationId': {
            'S.$': `${CONVERSATION_PATH}.id`,
          },
        },
        returnValues: 'ALL_NEW',
        task: {
          ResultSelector: {
            'id.$': '$.Attributes.latestConversationId.S',
          },
          ResultPath: CONVERSATION_PATH,
          Next: StateName.GetContextForConversationId,
        },
      })
      .addDdbItemGetTaskState<
        DdbTableContext.KeysType,
        DdbTableContext.RecordType
      >(StateName.GetContextForConversationId, {
        tableName: DdbTableContext.stageQualifiedName,
        key: {
          conversation_id: {
            'S.$': `${CONVERSATION_PATH}.id`,
          },
        },
        attrsToGet: {
          conversation_id: true,
          content: true,
        },
        resultSelector: {
          'content.$': '$.Item.content.S',
        },
        task: {
          ResultPath: '$.context',
          Next: StateName.SystemMessageOpenAiPrepareRouter,
        },
      })
  ) // END OF: existing conversation - simply get context
  .addChain(
    'now that we have context, prepare a system message',
    createChain()
      .addChoiceState(StateName.SystemMessageOpenAiPrepareRouter, {
        Choices: [
          {
            Variable: `${CATEGORY_PATH}.data`,
            IsPresent: false, // no category inference for continued conversations
            Next: StateName.SystemMessageMemoriesOpenAiPrepare,
          },
          {
            Variable: `${CATEGORY_PATH}.data`,
            StringMatches: Category.ACTIONS,
            Next: StateName.SystemMessageActionsOpenAiPrepare,
          },
        ],
        Default: StateName.SystemMessageMemoriesOpenAiPrepare,
      })
      .addLambdaTaskState(StateName.SystemMessageActionsOpenAiPrepare, {
        payload: {
          'context.$': '$.context.content',
          'query.$': '$.query',
        },
        task: {
          ResultPath: SYS_MSG_PATH,
          Next: StateName.QuestionAdd,
        },
      })
      .addLambdaTaskState(StateName.SystemMessageMemoriesOpenAiPrepare, {
        payload: {
          'context.$': '$.context.content',
        },
        task: {
          ResultPath: SYS_MSG_PATH,
          Next: StateName.QuestionAdd,
        },
      })
  ) // END OF: prepare system message
  // TODO SS: TTL adding will come later, as the last thing maybe
  .addDdbItemUpdateTaskState<
    DdbTableConversation.KeysType,
    DdbTableConversation.RecordType
  >(StateName.QuestionAdd, {
    tableName: DdbTableConversation.stageQualifiedName,
    key: {
      id: {
        'S.$': `${CONVERSATION_PATH}.id`,
      },
      created_at: {
        'S.$': '$$.State.EnteredTime',
      },
    },
    attributeValues: {
      ':question': {
        'S.$': `$.query`,
      },
    },
    returnValues: 'ALL_NEW',
    task: {
      ResultSelector: {
        'id.$': '$.Attributes.id.S',
        'created_at.$': '$.Attributes.created_at.S',
      },
      ResultPath: `$.${StateName.QuestionAdd}`,
      Next: StateName.ActionOrMemoryBranching,
    },
  })
  // get previous messages, unless action (then directly to openAi completion)
  .addChoiceState(StateName.ActionOrMemoryBranching, {
    Choices: [
      {
        Variable: `${CATEGORY_PATH}.data`,
        IsPresent: false,
        Next: StateName.GetConversation,
      },
      {
        Variable: `${CATEGORY_PATH}.data`,
        StringMatches: Category.MEMORIES as string,
        Next: StateName.GetConversation,
      },
      {
        Variable: `${CATEGORY_PATH}.data`,
        StringMatches: Category.ACTIONS as string,
        Next: StateName.ActionOpenAiPrepare,
      },
    ],
    Default: StateName.ActionOrMemoryBranchingFail,
  })
  .addFailState(StateName.ActionOrMemoryBranchingFail, {
    Cause: 'S: Cannot infer whether to handle action or memory resource',
  })
  .addChain(
    'actions branch',
    createChain()
      .addLambdaTaskState(StateName.ActionOpenAiPrepare, {
        payload: {
          'prompt.$': SYS_MSG_PATH,
        },
      })
      .addLambdaTaskState(StateName.ActionOpenAi, {
        payload: {
          'messages.$': `$.${StateName.ActionOpenAiPrepare}`,
        },
      })
      .addStartExecutionTaskState(
        StateName.ExecuteActionStateMachine,
        {
          'StateMachineArn.$': `${COLLECTED_CONTEXT_ITEMS_PATH}[0].stateMachineArn`,
          'Input.$': `$.${StateName.ActionOpenAi}.data`,
        },
        true,
        null,
        {
          ResultPath: `$.${StateName.ExecuteActionStateMachine}`,
          OutputPath: `$.${StateName.ExecuteActionStateMachine}.Output`,
          Next: StateName.ChildStateMachineSucceeded,
        }
      )
      .addPassState(StateName.ChildStateMachineSucceeded, {
        Parameters: {
          'answer.$': 'States.StringToJson($)',
        },
        End: true,
      })
  ) // END OF: actions branch
  .addChain(
    'memories branch',
    createChain()
      .addLambdaTaskState(StateName.GetConversation, {
        payload: {
          TableName: DdbTableConversation.stageQualifiedName,
          KeyConditionExpression:
            'id = :v1 AND created_at BETWEEN :v2a AND :v2b',
          ExpressionAttributeValues: {
            ':v1.$': `${CONVERSATION_PATH}.id`,
            ':v2a': '1970-01-01T00:00:00Z', // TODO SS: for now, taking all messages in a conv.
            ':v2b.$': '$$.State.EnteredTime',
          },
        },
      })
      .addLambdaTaskState(StateName.ConversationOpenAiPrepare, {
        payload: {
          'systemMessage.$': `${SYS_MSG_PATH}.data`,
          'conversationItems.$': `$.${StateName.GetConversation}`,
        },
      })
      .addLambdaTaskState(StateName.ConversationOpenAi, {
        payload: {
          'messages.$': `$.${StateName.ConversationOpenAiPrepare}`,
        },
      })
      .addDdbItemUpdateTaskState<
        DdbTableConversation.KeysType,
        DdbTableConversation.RecordType
      >(StateName.SaveQueryAnswer, {
        tableName: DdbTableConversation.stageQualifiedName,
        key: {
          id: {
            'S.$': `$.${StateName.QuestionAdd}.id`,
          },
          created_at: {
            'S.$': `$.${StateName.QuestionAdd}.created_at`,
          },
        },
        attributeValues: {
          ':answer': {
            'S.$': `$.${StateName.ConversationOpenAi}.data`,
          },
        },
        returnValues: undefined,
        task: {
          ResultSelector: {
            'answer.$': '$.Attributes.answer.S',
          },
          ResultPath: `$.${StateName.SaveQueryAnswer}`,
        },
      })
      .addPassState(StateName.QueryFinished, {
        Parameters: {
          'answer.$': `$.${StateName.SaveQueryAnswer}.answer`,
        },
        End: true,
      })
  ) // END OF: memories branch

// would be nice to
export const spec: StateMachine = {
  name: isOffline() ? name : stageQualifiedName,
  id: stageQualifiedId,
  definition: {
    TimeoutSeconds: 60,
    Comment: 'Assistant - query pathway',
    StartAt: stateChain.getStartingStateName(),
    States: stateChain.build(),
  },
}
