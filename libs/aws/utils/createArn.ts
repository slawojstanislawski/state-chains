import { AwsArn } from '../types'
import { getAccountId } from './getAccountId'
import { getRegion } from './getRegion'

export const createArn = <T extends string>(
  awsServiceName: T,
  resource: string,
  forceOffline = false
): AwsArn<T> => {
  return `arn:aws:${awsServiceName}:${getRegion(forceOffline)}:${getAccountId(
    forceOffline
  )}:${resource}`
}
