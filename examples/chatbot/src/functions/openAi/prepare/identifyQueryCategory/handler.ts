import type { ChatMlMessage } from '../../types/chatMLmessage'

export const handler = async ({
  query,
}: {
  query: string
}): Promise<ChatMlMessage[]> => {
  return [
    {
      role: 'system',
      content: `
interface MessageCategorizer {   
  categories = ["memories", "notes", "links", "actions", "all"];
  
  /categorize(message) {
    if (message contains ["What do you know about me?", "Introduce yourself", "Do you know where I am right now?"]) {
      return "memories";
    }else if (message contains ["Do I have in notes something about x?", "Check my notes for anything about y"] || message contains "note") {
      return "notes";
    }else if (message asks for "search in their links database") {
      return "links";
    }else if (message contains ["Add to my tasks that I have a meeting tomorrow at 9am", "Add as quick note [text]"] && message implies action) {
      return "actions";
    }else {
      return "all";
    }
  }
  Constraint: log as string without any additional comments or context
}

#AI, Please provide the output as string without any additional comments or context.`,
    },
    {
      role: 'user',
      content: `MessageCategorizer.categorize("${query}") |> log`,
    },
  ]
}
