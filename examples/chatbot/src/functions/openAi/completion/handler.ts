import { CompletionInput } from '../types/completionInput'
import { completionRequest } from './completion'

export const handler = async (
  input: CompletionInput
): Promise<{ data: string }> => {
  return await completionRequest(input)
}
