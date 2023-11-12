import { Task } from '../../../serverless.types'
import {
  ApplyCapabilities,
  serviceIntegration,
  StateChain,
  Capability,
} from '../../stateMachine'
import { SnsCapability } from './sns.capability'
import { SnsPublishReturnType } from './types/api/SnsPublishReturn.type'

const taskToResourceMap = {
  snsPublishTaskName: {
    resource: serviceIntegration<SnsPublishReturnType>,
  },
} as const

@Capability(SnsCapability)
class WithSnsCapabilityAppliedChain extends StateChain<
  keyof typeof taskToResourceMap,
  typeof taskToResourceMap
> {}

type Capabilities = [
  SnsCapability<keyof typeof taskToResourceMap, typeof taskToResourceMap>
]

describe('SnsCapability applied on StateChain', () => {
  let chain: ApplyCapabilities<
    StateChain<keyof typeof taskToResourceMap, typeof taskToResourceMap>,
    Capabilities
  >

  beforeEach(() => {
    chain = new WithSnsCapabilityAppliedChain(taskToResourceMap) as ApplyCapabilities<
      StateChain<keyof typeof taskToResourceMap, typeof taskToResourceMap>,
      Capabilities
    >
  })

  describe('addSnsPublishTaskState', () => {
    it('should add an SNS publish task state', () => {
      chain.addSnsPublishTaskState('snsPublishTaskName', {
        TopicArn: 'arn:aws:sns:us-west-2:123456789012:MyTopic',
        Message: 'Hello world',
      })
      const states = chain.states

      expect(states).toHaveLength(1)
      expect(states[0].stateName).toEqual('snsPublishTaskName')
      const stateDetails = states[0].stateDetails as Task
      expect(stateDetails.Resource).toEqual('arn:aws:states:::sns:publish')
      expect(stateDetails.Parameters.TopicArn).toEqual(
        'arn:aws:sns:us-west-2:123456789012:MyTopic'
      )
    })
  })
})
