import { Task } from '../../../serverless.types'
import {
  ApplyCapabilities,
  serviceIntegration,
  StateChain,
  Capability,
} from '../../stateMachine'
import { SqsCapability } from './sqs.capability'
import { SqsSendMessageReturnType } from './types/api/SqsSendMessageReturn.type'

const taskToResourceMap = {
  sqsSendMessageTask: {
    resource: serviceIntegration<SqsSendMessageReturnType>,
  },
} as const

@Capability(SqsCapability)
class WithSqsCapabilityAppliedChain extends StateChain<
  keyof typeof taskToResourceMap,
  typeof taskToResourceMap
> {}

type Capabilities = [
  SqsCapability<keyof typeof taskToResourceMap, typeof taskToResourceMap>
]

describe('SqsCapability applied on StateChain', () => {
  let chain: ApplyCapabilities<
    StateChain<keyof typeof taskToResourceMap, typeof taskToResourceMap>,
    Capabilities
  >

  beforeEach(() => {
    chain = new WithSqsCapabilityAppliedChain(taskToResourceMap) as ApplyCapabilities<
      StateChain<keyof typeof taskToResourceMap, typeof taskToResourceMap>,
      Capabilities
    >
  })

  describe('addSqsSendMessageTaskState', () => {
    it('should add an SQS send message task state', () => {
      chain.addSqsSendMessageTask('sqsSendMessageTask', {
        QueueUrl:
          'https://sqs.eu-north-1.amazonaws.com/101010101010/superQueue',
        MessageBody: 'test message body',
      })
      const states = chain.states

      expect(states).toHaveLength(1)
      expect(states[0].stateName).toEqual('sqsSendMessageTask')
      const stateDetails = states[0].stateDetails as Task
      expect(stateDetails.Resource).toEqual('arn:aws:states:::sqs:sendMessage')
      expect(stateDetails.Parameters.QueueUrl).toEqual(
        'https://sqs.eu-north-1.amazonaws.com/101010101010/superQueue'
      )
      expect(stateDetails.Parameters.MessageBody).toEqual('test message body')
    })
  })
})
