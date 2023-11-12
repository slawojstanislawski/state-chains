import { DdbTableConversation } from '@resources/dynamodb'

import type { ChatMlMessage } from '../../types/chatMLmessage'

export const handler = async ({
  systemMessage,
  conversationItems,
}: {
  systemMessage: string
  conversationItems: DdbTableConversation.RecordType[]
}): Promise<ChatMlMessage[]> => {
  const messages: ChatMlMessage[] = conversationItems
    .reduce((previousValue, exchange) => {
      if (exchange.question && exchange.answer) {
        previousValue.push([
          {
            role: 'user',
            content: exchange.question,
          },
          {
            role: 'assistant',
            content: exchange.answer,
          },
        ] as ChatMlMessage[])
      } else {
        previousValue.push({
          role: 'user',
          content: exchange.question,
        } as ChatMlMessage)
      }
      return previousValue
    }, [])
    .flat()
  messages.unshift({
    role: 'system',
    content: systemMessage,
  })
  return messages
}
