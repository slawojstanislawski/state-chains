import { DdbTableResources } from '@resources/dynamodb'

export const records = [
  {
    id: 'abc',
    category: 'memories',
    description: 'test description',
    title: 'Childhood',
    tags: 'Childhood, kid, playground',
  },
] as DdbTableResources.RecordType[]
