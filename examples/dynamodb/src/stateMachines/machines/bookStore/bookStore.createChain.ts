import { ApplyCapabilities, StateChain, Capability } from '@libs/stateMachine'
import { LambdaCapability } from '@libs/aws/lambda'
import { StateName, taskToResourceMap } from './constants'
import { DynamodbCapability } from "@libs/aws/dynamodb";

type TaskToResourceMap = typeof taskToResourceMap
const BaseChain = StateChain<
  StateName,
  TaskToResourceMap
>

@Capability(LambdaCapability)
@Capability(DynamodbCapability)
class BookStoreChain extends BaseChain {}

type CapabilityTypes = [DynamodbCapability<StateName, TaskToResourceMap>, LambdaCapability<StateName, TaskToResourceMap>]

export const createChain = () => {
  return new BookStoreChain(taskToResourceMap) as ApplyCapabilities<
    typeof BaseChain,
    CapabilityTypes
  >
}
