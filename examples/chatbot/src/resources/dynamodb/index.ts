// `export {}`  - do not remove until after first resource import+export is generated (generators need it)
import * as DdbTableActions from './tables/actions/actions.table'
import * as DdbTableContext from './tables/context/context.table'
import * as DdbTableConversation from './tables/conversation/conversation.table'
import * as DdbTableLatestConversationId from './tables/latestConversationId/latestConversationId.table'
import * as DdbTableResources from './tables/resources/resources.table'

export {
  DdbTableActions,
  DdbTableContext,
  DdbTableConversation,
  DdbTableLatestConversationId,
  DdbTableResources,
}
