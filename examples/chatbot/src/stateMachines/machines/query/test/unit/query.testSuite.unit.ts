import { StateMachineTestCases } from '@libs/stateMachine'

import { StateName } from '../../constants'
import { TestSuiteMockName } from '../query.testSuiteMocks.type'
import { TaskResultMap } from '../types'
import { testSuiteInputs } from './query.testSuiteInputs.unit.js'

export const testSuiteUnit: StateMachineTestCases<
  TaskResultMap,
  TestSuiteMockName,
  keyof typeof testSuiteInputs & string
> = {
  TestCases: {
    HappyPathNewConversationMemories: {
      [StateName.NewLatestConversationId]: 'NewLatestConversationId_SUCCESS',
      [StateName.IdentifyQueryCategoryOpenAi]:
        'IdentifyQueryCategoryOpenAi_SUCCESS_MEMORIES',
      [StateName.QueryVectorCreatePinecone]:
        'QueryVectorCreatePinecone_SUCCESS',
      [StateName.QueryVectorSearchPineconeMemories]:
        'QueryVectorSearchPineconeMemories_SUCCESS',
      [StateName.ContextCollectResources]: 'ContextCollectResources_SUCCESS',
      [StateName.SaveContext]: 'SaveContext_SUCCESS',
      [StateName.QuestionAdd]: 'QuestionAdd_SUCCESS',
      [StateName.GetConversation]: 'GetConversation_SUCCESS',
      [StateName.ConversationOpenAi]: 'ConversationOpenAi_SUCCESS',
      [StateName.SaveQueryAnswer]: 'SaveQueryAnswer_SUCCESS',
    },
    HappyPathImplicitlyExistingConversationMemories: {
      [StateName.GetLatestConversationId]: 'GetLatestConversationId_SUCCESS',
      [StateName.GetContextForConversationId]:
        'GetContextForConversationId_SUCCESS',
      [StateName.QuestionAdd]: 'QuestionAdd_SUCCESS',
      [StateName.GetConversation]: 'GetConversation_SUCCESS',
      [StateName.ConversationOpenAi]: 'ConversationOpenAi_SUCCESS',
      [StateName.SaveQueryAnswer]: 'SaveQueryAnswer_SUCCESS',
    },
    HappyPathExplicitlyExistingConversationMemories: {
      [StateName.UpdateLatestConversationId]:
        'UpdateLatestConversationId_SUCCESS',
      [StateName.GetContextForConversationId]:
        'GetContextForConversationId_SUCCESS',
      [StateName.QuestionAdd]: 'QuestionAdd_SUCCESS',
      [StateName.GetConversation]: 'GetConversation_SUCCESS',
      [StateName.ConversationOpenAi]: 'ConversationOpenAi_SUCCESS',
      [StateName.SaveQueryAnswer]: 'SaveQueryAnswer_SUCCESS',
    },
    HappyPathAction: {
      [StateName.NewLatestConversationId]: 'NewLatestConversationId_SUCCESS',
      [StateName.IdentifyQueryCategoryOpenAi]:
        'IdentifyQueryCategoryOpenAi_SUCCESS_ACTIONS',
      [StateName.QueryVectorCreatePinecone]:
        'QueryVectorCreatePinecone_SUCCESS',
      [StateName.QueryVectorSearchPineconeActions]:
        'QueryVectorSearchPineconeActions_SUCCESS',
      [StateName.ContextCollectAction]: 'ContextCollectAction_SUCCESS',
      [StateName.SaveContext]: 'SaveContext_SUCCESS',
      [StateName.QuestionAdd]: 'QuestionAdd_SUCCESS',
      [StateName.ActionOpenAi]: 'ActionOpenAi_SUCCESS',
      [StateName.ExecuteActionStateMachine]:
        'ExecuteActionStateMachine_SUCCESS',
      // TODO SS: the response saving is missing.
    },
  },
}
