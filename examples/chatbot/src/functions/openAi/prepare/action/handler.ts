import type { ChatMlMessage } from '../../types/chatMLmessage'

export const handler = async ({
  prompt,
}: {
  prompt: string
}): Promise<ChatMlMessage[]> => {
  return [
    {
      role: 'user',
      content: prompt,
    },
  ]
}
