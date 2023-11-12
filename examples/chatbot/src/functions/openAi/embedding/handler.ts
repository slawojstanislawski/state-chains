import { authedPostJsonRequestFnFactory } from '@libs/request/postJson'

type EmbeddingResponse = {
  object: string
  data: Array<{
    object: 'embedding'
    index: number
    embedding: number[]
  }>
  model: string
  usage: {
    prompt_tokens: number
    total_tokens: number
  }
}

export const handler = async ({
  data,
}: {
  data: any
}): Promise<EmbeddingResponse> => {
  const requestFn = authedPostJsonRequestFnFactory(
    process.env.OPENAI_API_EMBEDDING_URL as string,
    process.env.OPENAI_API_KEY as string
  )
  const requestBody = {
    input: data,
    model: 'text-embedding-ada-002',
  }
  // console.log('***requestBody***', requestBody)
  return await requestFn(requestBody)
}
