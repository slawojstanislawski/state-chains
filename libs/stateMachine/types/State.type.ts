import { State as AwsStateMachineState } from '../../../serverless.types'

export interface State {
  stateName: string
  stateDetails: AwsStateMachineState
}
