import { QueryRequest } from '@pinecone-database/pinecone'

import { getPineconeClient } from '../utils'

export const handler = async ({
  includeMetadata = false,
  includeValues = false,
  topK = 5,
  vector,
  filter = undefined,
}: QueryRequest) => {
  const pineconeClient = await getPineconeClient()
  const index = pineconeClient.Index('ai')
  const queryResponse = await index.query({
    queryRequest: {
      vector,
      topK,
      includeValues,
      includeMetadata,
      filter,
    },
  })
  console.log('queryResponse', queryResponse)
  // TODO SS: throw error if response isn't, and retry: '{"queryResponse":1}'
  return queryResponse.matches
}
