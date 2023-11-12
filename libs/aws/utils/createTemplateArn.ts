import { isOffline } from '../../utils'
import { TemplateAwsArn } from '../types'

export const createTemplateArn = <T extends string>(
  awsServiceName: T,
  resource: string
): TemplateAwsArn<T> => {
  const accountId = isOffline() ? process.env.ACCOUNT_ID : '${aws:accountId}'
  return `arn:aws:${awsServiceName}:\${aws:region}:${accountId}:${resource}`
}
