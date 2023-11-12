import type { Vector } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/models/Vector'

import { getPineconeClient } from '../utils'

export const handler = async (vector: Vector) => {
  const pineconeClient = await getPineconeClient()
  const index = pineconeClient.Index('ai')
  const upsertResponse = await index.upsert({
    upsertRequest: {
      vectors: [vector],
    },
  })
  console.log('upsertResponse', upsertResponse)
  // TODO SS: throw error if response isn't, and retry: '{"upsertedCount":1}'
  return upsertResponse
}
