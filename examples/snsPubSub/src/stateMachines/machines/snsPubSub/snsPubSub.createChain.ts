import { ApplyCapabilities, StateChain, Capability } from '@libs/stateMachine'
import { LambdaCapability } from '@libs/aws/lambda'
import { StateName, taskToResourceMap } from './constants'
import { SnsCapability } from "@libs/aws/sns";

type TaskToResourceMap = typeof taskToResourceMap
const BaseChain = StateChain<
  StateName,
  TaskToResourceMap
>

@Capability(LambdaCapability)
@Capability(SnsCapability)
class SnsPubSubChain extends BaseChain {}

type CapabilityTypes = [SnsCapability<StateName, TaskToResourceMap>, LambdaCapability<StateName, TaskToResourceMap>]

export const createChain = () => {
  return new SnsPubSubChain(taskToResourceMap) as ApplyCapabilities<
    typeof BaseChain,
    CapabilityTypes
  >
}
