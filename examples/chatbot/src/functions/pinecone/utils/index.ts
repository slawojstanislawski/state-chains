import { PineconeClient } from '@pinecone-database/pinecone'

export const getPineconeClient = async () => {
  const pinecone = new PineconeClient()
  await pinecone.init({
    environment: 'us-east-1-aws',
    apiKey: process.env.PINECONE_API_KEY as string,
  })
  return pinecone
}
