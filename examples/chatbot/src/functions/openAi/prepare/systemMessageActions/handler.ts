import { getCurrentDateFormatted } from '@libs/datetime/getCurrentDateFormatted'
import { getCurrentDayOfWeekShort } from '@libs/datetime/getCurrentDayOfWeekShort'

export const handler = async ({
  context,
  query,
}: {
  context: string
  query: string
}): Promise<string> => {
  const result = `Return single-lined JSON object based on a description and query you have below. Extract all of the information from the query and use them to build JSON object described in a description. Return JSON and nothing else. 

description\`\`\`
${context}
\`\`\`

query\`\`\`
${query}
\`\`\`

${getCurrentDayOfWeekShort()}, ${getCurrentDateFormatted()}
`
  return JSON.stringify(result)
}
