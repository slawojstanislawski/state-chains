import { Dummy } from '@functions'

import { StateName } from './StateName.enum'

export const taskToResourceMap = {
  [StateName.Dummy]: {
    name: Dummy.name,
    resource: Dummy.handler,
  },
}
