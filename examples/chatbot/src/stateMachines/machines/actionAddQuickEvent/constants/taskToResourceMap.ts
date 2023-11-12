import { CalendarAddQuickEvent } from '@functions'

import { StateName } from './StateName.enum'

export const taskToResourceMap = {
  [StateName.CalendarAddQuickEvent]: {
    name: CalendarAddQuickEvent.name,
    resource: CalendarAddQuickEvent.handler,
  },
}
