import { ApplyCapabilities, StateChain, Capability } from '@libs/stateMachine'
import { LambdaCapability } from '@libs/aws/lambda'
import { StateName, taskToResourceMap } from './constants'
import { SqsCapability } from "@libs/aws/sqs";

type TaskToResourceMap = typeof taskToResourceMap
const BaseChain = StateChain<
  StateName,
  TaskToResourceMap
>

@Capability(LambdaCapability)
@Capability(SqsCapability)
class SqsPubSubChain extends BaseChain {}

type CapabilityTypes = [SqsCapability<StateName, TaskToResourceMap>, LambdaCapability<StateName, TaskToResourceMap>]

export const createChain = () => {
  return new SqsPubSubChain(taskToResourceMap) as ApplyCapabilities<
    typeof BaseChain,
    CapabilityTypes
  >
}
