import { Region } from '../../serverless.types'

export const getRegion = (): Region => {
  if (process.env.REGION) {
    return process.env.REGION as Region
  }
  const args = process.argv
  const regionIndex = args.indexOf('--region')
  return regionIndex !== -1
    ? (args[regionIndex + 1] as Region)
    : ('us-east-1' as Region)
}
