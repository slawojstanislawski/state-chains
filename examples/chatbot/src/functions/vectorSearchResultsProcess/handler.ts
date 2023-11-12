import type { ScoredVector } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/models/ScoredVector'

export const handler = async ({
  matches,
}: {
  matches: Array<ScoredVector>
}) => {
  const aggregateScore = matches.reduce((prev, curr) => {
    return prev + (curr.score ?? 0)
  }, 0)
  const avg = aggregateScore / matches.length
  const qualifiedMatches = matches.filter((match) => {
    return (match.score ?? 0) >= avg
  })
  const ids = qualifiedMatches.map((match) => match.id)

  return {
    ids,
  }
}
