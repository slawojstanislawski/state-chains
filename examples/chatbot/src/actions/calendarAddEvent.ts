import * as ActionAddQuickEvent from '@stateMachines/machines/actionAddQuickEvent'

import { ActionDefinition } from './types'

export const calendarAddEventAction: ActionDefinition = {
  id: 'action-calendarAddEvent',
  title: 'Adding event to my calendar',
  description: `Based on the provided text, infer what date (formatted YYYY-MM-DD) and what event it is about.
Return under property "eventText" in the following format:
<format>
YYYY-MM-DD InsertHereTitleOfEventYouInferred
</format>`,
  stateMachineArn: {
    'Fn::GetAtt': [ActionAddQuickEvent.stageQualifiedId, 'Arn'],
  },
}
