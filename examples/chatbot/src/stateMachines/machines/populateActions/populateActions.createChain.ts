import { DynamodbCapability } from '@libs/aws/dynamodb'
import { StepfunctionsCapability } from '@libs/aws/stepfunctions'
import { ApplyCapabilities, StateChain, Capability } from '@libs/stateMachine'

import { StateName, taskToResourceMap } from './constants'

type TaskToResourceMap = typeof taskToResourceMap
const BaseChain = StateChain<StateName, TaskToResourceMap>

@Capability(DynamodbCapability)
@Capability(StepfunctionsCapability)
class PopulateActionsChain extends BaseChain {}

type CapabilityTypes = [
  StepfunctionsCapability<StateName, TaskToResourceMap>,
  DynamodbCapability<StateName, TaskToResourceMap>
]

export const createChain = () => {
  return new PopulateActionsChain(taskToResourceMap) as ApplyCapabilities<
    typeof BaseChain,
    CapabilityTypes
  >
}
