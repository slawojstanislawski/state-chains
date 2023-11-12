import {
  ContextResourcesToContextString,
  VectorSearchResultsProcess,
  PineconeQuery,
  OpenAiActionPrepare,
  OpenAiCompletion,
  OpenAiConversationPrepare,
  OpenAiEmbedding,
  OpenAiIdentifyQueryCategoryPrepare,
  OpenAiSystemMessageActionsPrepare,
  OpenAiSystemMessageMemoriesPrepare,
  DdbBatchGetItem,
  DdbQuery,
} from '@functions'
import {
  DdbGetItemReturnType,
  DdbUpdateItemReturnType,
} from '@libs/aws/dynamodb'
import { serviceIntegration } from '@libs/stateMachine'
import {
  DdbTableActions,
  DdbTableContext,
  DdbTableConversation,
  DdbTableLatestConversationId,
  DdbTableResources,
} from '@resources/dynamodb'

import { StateName } from './StateName.enum'

const openAiCompletionResource = {
  name: OpenAiCompletion.name,
  resource: OpenAiCompletion.handler,
}
const pineconeQueryResource = {
  name: PineconeQuery.name,
  resource: PineconeQuery.handler,
}
const ddbBatchGetItemResources = {
  name: DdbBatchGetItem.name,
  resource: DdbBatchGetItem.handler<DdbTableResources.RecordType>,
}
const ddbBatchGetItemActions = {
  name: DdbBatchGetItem.name,
  resource: DdbBatchGetItem.handler<DdbTableActions.RecordType>,
}
const ddbUpdateConversationTableResource = {
  resource: serviceIntegration<
    DdbUpdateItemReturnType<DdbTableConversation.RecordType>
  >,
}
const ddbUpdateLatestConversationIdTableResource = {
  resource: serviceIntegration<
    DdbUpdateItemReturnType<DdbTableLatestConversationId.RecordType>
  >,
}

export const taskToResourceMap = {
  [StateName.IdentifyQueryCategoryOpenAiPrepare]: {
    name: OpenAiIdentifyQueryCategoryPrepare.name,
    resource: OpenAiIdentifyQueryCategoryPrepare.handler,
  },
  [StateName.IdentifyQueryCategoryOpenAi]: openAiCompletionResource,
  [StateName.QueryVectorCreatePinecone]: {
    name: OpenAiEmbedding.name,
    resource: OpenAiEmbedding.handler,
  },
  [StateName.QueryVectorSearchPineconeActions]: pineconeQueryResource,
  [StateName.QueryVectorSearchPineconeMemories]: pineconeQueryResource,
  [StateName.VectorSearchResultsProcess]: {
    name: VectorSearchResultsProcess.name,
    resource: VectorSearchResultsProcess.handler,
  },
  [StateName.ContextCollectResources]: ddbBatchGetItemResources,
  [StateName.ContextCollectAction]: ddbBatchGetItemActions,
  [StateName.ContextResourcesToContextString]: {
    name: ContextResourcesToContextString.name,
    resource: ContextResourcesToContextString.handler,
  },
  [StateName.SystemMessageMemoriesOpenAiPrepare]: {
    name: OpenAiSystemMessageMemoriesPrepare.name,
    resource: OpenAiSystemMessageMemoriesPrepare.handler,
  },
  [StateName.SystemMessageActionsOpenAiPrepare]: {
    name: OpenAiSystemMessageActionsPrepare.name,
    resource: OpenAiSystemMessageActionsPrepare.handler,
  },
  [StateName.QuestionAdd]: ddbUpdateConversationTableResource,
  [StateName.ActionOpenAiPrepare]: {
    name: OpenAiActionPrepare.name,
    resource: OpenAiActionPrepare.handler,
  },
  [StateName.GetConversation]: {
    name: DdbQuery.name,
    resource: DdbQuery.handler,
  },
  [StateName.ActionOpenAi]: openAiCompletionResource,
  [StateName.ExecuteActionStateMachine]: {
    resource: serviceIntegration<{ Output: string }>,
  },
  [StateName.ConversationOpenAiPrepare]: {
    name: OpenAiConversationPrepare.name,
    resource: OpenAiConversationPrepare.handler,
  },
  [StateName.ConversationOpenAi]: openAiCompletionResource,
  [StateName.SaveQueryAnswer]: ddbUpdateConversationTableResource,
  [StateName.NewLatestConversationId]:
    ddbUpdateLatestConversationIdTableResource,
  [StateName.UpdateLatestConversationId]:
    ddbUpdateLatestConversationIdTableResource,
  [StateName.GetLatestConversationId]: {
    resource: serviceIntegration<
      DdbGetItemReturnType<DdbTableLatestConversationId.RecordType>
    >,
  },
  [StateName.GetContextForConversationId]: {
    resource: serviceIntegration<
      DdbGetItemReturnType<DdbTableContext.RecordType>
    >,
  },
  [StateName.SaveContext]: {
    resource: serviceIntegration<
      DdbUpdateItemReturnType<DdbTableContext.RecordType>
    >,
  },
}
