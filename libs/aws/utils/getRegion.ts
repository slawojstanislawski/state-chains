import { Region } from '../../../serverless.types'
import { isOffline } from '../../utils'

export const getRegion = (forceOffline = false) => {
  return (
    isOffline() || forceOffline
      ? process.env.OFFLINE_REGION
      : process.env.REGION
  ) as Region
}
