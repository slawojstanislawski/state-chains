import { ApplyCapabilities, StateChain, Capability } from '@libs/stateMachine'
import { LambdaCapability } from '@libs/aws/lambda'
import { StateName, taskToResourceMap } from './constants'

type TaskToResourceMap = typeof taskToResourceMap
const BaseChain = StateChain<
  StateName,
  TaskToResourceMap
>

@Capability(LambdaCapability)
class <%= classify(name) %>Chain extends BaseChain {}

type CapabilityTypes = [LambdaCapability<StateName, TaskToResourceMap>]

export const createChain = () => {
  return new <%= classify(name) %>Chain(taskToResourceMap) as ApplyCapabilities<
    typeof BaseChain,
    CapabilityTypes
  >
}
