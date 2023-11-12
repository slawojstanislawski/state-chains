import { merge } from 'lodash'
import path from 'path'

import { getStage } from '../../utils/getStage'

function getConfig<T>(dirname: string): T {
  const stage = getStage()
  let config = {} as T
  try {
    config = require(path.join(dirname, './spec'))?.config || {}
    config = merge({}, config['default'] || {}, config[stage] || {})
  } catch (_e) {}
  return config
}

export { getConfig }
