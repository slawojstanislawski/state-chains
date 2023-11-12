import { StartExecutionCommandInput } from '@aws-sdk/client-sfn'

import { WithDollarKey } from '../../../stateMachine'

type Parameters = {
  StateMachineArn?:
    | StartExecutionCommandInput['stateMachineArn']
    | {
        // into that string here you should be passing stage qualified ID
        'Fn::GetAtt': [string, 'Arn']
      }
  Input?: Record<string, any>
  Name?: StartExecutionCommandInput['name']
  TraceHeader?: StartExecutionCommandInput['traceHeader']
}

export type ExecutionParameters = Parameters & WithDollarKey<Parameters>
