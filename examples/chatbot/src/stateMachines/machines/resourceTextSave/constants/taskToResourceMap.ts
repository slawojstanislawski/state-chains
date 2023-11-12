import { OpenAiCompletion, OpenAiResourceEnrichPrepare } from '@functions'
import { DdbUpdateItemReturnType } from '@libs/aws/dynamodb'
import { serviceIntegration } from '@libs/stateMachine'
import { DdbTableResources } from '@resources/dynamodb'

import { StateName } from './StateName.enum'

export const taskToResourceMap = {
  [StateName.ResourceEnrichOpenAiPrepare]: {
    name: OpenAiResourceEnrichPrepare.name,
    resource: OpenAiResourceEnrichPrepare.handler,
  },
  [StateName.ResourceEnrichOpenAi]: {
    name: OpenAiCompletion.name,
    resource: OpenAiCompletion.handler,
  },
  [StateName.ResourceTextSave]: {
    resource: serviceIntegration<
      DdbUpdateItemReturnType<DdbTableResources.RecordType>
    >,
  },
  [StateName.StartResourceSaveVectorStateMachine]: {
    resource: serviceIntegration<{ Output: string }>,
  },
}
