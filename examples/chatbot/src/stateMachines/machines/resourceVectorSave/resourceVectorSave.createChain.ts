import { DynamodbCapability } from '@libs/aws/dynamodb'
import { ApplyCapabilities, StateChain, Capability } from '@libs/stateMachine'
import { StateName, taskToResourceMap } from './constants'
import { LambdaCapability } from '@libs/aws/lambda'

type TaskToResourceMap = typeof taskToResourceMap
const BaseChain = StateChain<
  StateName,
  TaskToResourceMap
>

@Capability(DynamodbCapability)
@Capability(LambdaCapability)
class ResourceVectorSaveChain extends BaseChain {}

type CapabilityTypes = [
  LambdaCapability<StateName, TaskToResourceMap>,
  DynamodbCapability<StateName, TaskToResourceMap>
]

export const createChain = () => {
  return new ResourceVectorSaveChain(taskToResourceMap) as ApplyCapabilities<
    typeof BaseChain,
    CapabilityTypes
  >
}
