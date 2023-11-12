import { getConfig } from '../../utils'
import { DdbTableStageConfig } from '../types'

export const getStageSpecificConfig: <T>(
  dir: string
) => DdbTableStageConfig<T> = (dir: string) => {
  return getConfig(dir)
}
