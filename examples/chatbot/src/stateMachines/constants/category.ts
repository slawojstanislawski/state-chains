import { DdbTableResources } from '@resources/dynamodb'

export enum Category {
  ACTIONS = 'actions',
  MEMORIES = DdbTableResources.Category.MEMORIES,
  NOTES = DdbTableResources.Category.NOTES,
  LINKS = DdbTableResources.Category.LINKS,
}
