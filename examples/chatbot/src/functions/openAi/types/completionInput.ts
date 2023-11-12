import type { ChatMlMessage } from './chatMLmessage'

export type CompletionInput = {
  maxTokens?: number
  temperature?: number
  messages: ChatMlMessage[]
  model?: 'gpt-3.5-turbo' | 'gpt-3.5-turbo-0613' | 'gpt-4'
}
