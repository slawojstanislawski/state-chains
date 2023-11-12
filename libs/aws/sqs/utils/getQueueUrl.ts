import { isOffline } from '../../../utils'
import { getAccountId } from '../../utils'

export const getQueueUrl = (queueName: string) => {
  const { env } = process
  const offlineEndpoint = `http://${env.OFFLINE_HOST}:${env.OFFLINE_SQS_PORT}`
  const endpoint = isOffline()
    ? offlineEndpoint
    : `https://sqs.${env.REGION}.amazonaws.com`
  const accountId = getAccountId()
  return `${endpoint}/${accountId}/${queueName}`
}
