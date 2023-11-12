import { isOffline } from '../../utils'

export const getAccountId = (forceOffline = false): string => {
  return isOffline() || forceOffline
    ? process.env.OFFLINE_ACCOUNT_ID
    : process.env.ACCOUNT_ID
}
