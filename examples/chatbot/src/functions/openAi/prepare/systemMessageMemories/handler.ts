import { getCurrentDateFormatted } from '@libs/datetime/getCurrentDateFormatted'
import { getCurrentDayOfWeekShort } from '@libs/datetime/getCurrentDayOfWeekShort'

export const handler = async ({
  context,
}: {
  context: string
}): Promise<{ data: string }> => {
  const result = `You're a helpful assistant who is speaking with Sławoj. Answer questions as short and concise and as truthfully as possible, based on a context. 

Please note that context below may include: 
- long-term memory,
- Sławoj's personal notes and/or links you do have access to. 

And you should prioritize this knowledge while answering.

If you don't know the answer say "I don't know" or "I have no information about this" in your own words.

context\`\`\`
${context}
\`\`\`

${getCurrentDayOfWeekShort()}, ${getCurrentDateFormatted()}
`
  return {
    data: result,
  }
}
