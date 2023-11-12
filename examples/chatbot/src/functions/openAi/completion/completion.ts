import { authedPostJsonRequestFnFactory } from '@libs/request/postJson'

import { CompletionInput } from '../types/completionInput'

export async function completionRequest(
  config: CompletionInput
): Promise<{ data: string }> {
  const {
    maxTokens = 500,
    messages,
    temperature = 0.7,
    model = 'gpt-3.5-turbo-0613',
  } = config
  const requestFn = authedPostJsonRequestFnFactory(
    process.env.OPENAI_API_COMPLETION_URL as string,
    process.env.OPENAI_API_KEY as string
  )
  const requestBody = {
    model,
    max_tokens: maxTokens,
    temperature,
    messages,
    stream: false,
    stop: ['#-#'],
  }
  // console.log('***requestBody***', requestBody)
  const data = await requestFn(requestBody)
  console.log('***data***', data)
  // TODO SS: there was an error 'cannot read properties of undefined (reading '0')
  //   throw a custom error and handle with try-catch, plus would be great if the problem reocurred now that I log data.
  const content = data.choices[0].message.content
  console.log('content', content)
  return {
    data: content as string,
  }
}
