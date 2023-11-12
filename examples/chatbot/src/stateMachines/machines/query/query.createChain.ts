import { DynamodbCapability } from '@libs/aws/dynamodb'
import { LambdaCapability } from '@libs/aws/lambda'
import { StepfunctionsCapability } from '@libs/aws/stepfunctions'
import { ApplyCapabilities, StateChain, Capability } from '@libs/stateMachine'

import { StateName, taskToResourceMap } from './constants'

type TaskToResourceMap = typeof taskToResourceMap
const BaseChain = StateChain<StateName, TaskToResourceMap>

@Capability(DynamodbCapability)
@Capability(LambdaCapability)
@Capability(StepfunctionsCapability)
class QueryChain extends BaseChain {}

type CapabilityTypes = [
  StepfunctionsCapability<StateName, TaskToResourceMap>,
  LambdaCapability<StateName, TaskToResourceMap>,
  DynamodbCapability<StateName, TaskToResourceMap>
]

export const createChain = () => {
  return new QueryChain(taskToResourceMap) as ApplyCapabilities<
    typeof BaseChain,
    CapabilityTypes
  >
}
