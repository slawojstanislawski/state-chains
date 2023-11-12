import { HistoryEvent } from '@aws-sdk/client-sfn'
import { HistoryEventType } from '@aws-sdk/client-sfn/dist-types/models/models_0'

export type ExecutionHistoryResults = {
  type: HistoryEventType
  value: string
  events?: HistoryEvent[]
}
