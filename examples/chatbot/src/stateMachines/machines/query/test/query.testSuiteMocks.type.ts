export type TestSuiteMockName =
  | 'NewLatestConversationId_SUCCESS'
  | 'IdentifyQueryCategoryOpenAi_SUCCESS_MEMORIES'
  | 'IdentifyQueryCategoryOpenAi_SUCCESS_ACTIONS'
  | 'QueryVectorCreatePinecone_SUCCESS'
  | 'QueryVectorSearchPineconeMemories_SUCCESS'
  | 'QueryVectorSearchPineconeActions_SUCCESS'
  | 'ContextCollectResources_SUCCESS'
  | 'ContextCollectAction_SUCCESS'
  | 'SaveContext_SUCCESS'
  | 'QuestionAdd_SUCCESS'
  | 'GetConversation_SUCCESS'
  | 'ConversationOpenAi_SUCCESS'
  | 'SaveQueryAnswer_SUCCESS'
  | 'SelectConversationToContinue_SUCCESS'
  | 'GetLatestConversationId_SUCCESS'
  | 'GetContextForConversationId_SUCCESS'
  | 'UpdateLatestConversationId_SUCCESS'
  | 'ActionOpenAi_SUCCESS'
  | 'ExecuteActionStateMachine_SUCCESS'