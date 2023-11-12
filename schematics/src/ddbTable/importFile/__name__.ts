import { DdbTable<%= classify(name) %> } from '@resources/dynamodb'

export const records = [] as DdbTable<%= classify(name) %>.RecordType[]
