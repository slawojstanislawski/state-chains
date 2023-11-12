import { PineconeUpsert, OpenAiEmbedding } from '@functions'
import { DdbGetItemReturnType } from '@libs/aws/dynamodb'
import { serviceIntegration } from '@libs/stateMachine'
import { DdbTableActions, DdbTableResources } from '@resources/dynamodb'

import { StateName } from './StateName.enum'

export const taskToResourceMap = {
  [StateName.ResourceTextGet]: {
    resource: serviceIntegration<
      DdbGetItemReturnType<DdbTableResources.RecordType>
    >,
  },
  [StateName.ActionsTextGet]: {
    resource: serviceIntegration<
      DdbGetItemReturnType<DdbTableActions.RecordType>
    >,
  },
  [StateName.ResourceVectorCreate]: {
    name: OpenAiEmbedding.name,
    resource: OpenAiEmbedding.handler,
  },
  [StateName.ActionVectorUpsert]: {
    name: PineconeUpsert.name,
    resource: PineconeUpsert.handler,
  },
  [StateName.ResourceVectorUpsert]: {
    name: PineconeUpsert.name,
    resource: PineconeUpsert.handler,
  },
}
