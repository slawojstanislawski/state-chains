import { Task } from '../../../serverless.types'
import {
  ApplyCapabilities,
  serviceIntegration,
  StateChain,
  Capability,
} from '../../stateMachine'
import { DynamodbCapability } from './dynamodb.capability'
import { DdbGetItemReturnType, DdbUpdateItemReturnType } from './types'

const taskToResourceMap = {
  fetchUserData: {
    resource: serviceIntegration<DdbGetItemReturnType<any>>,
  },
  addUserData: {
    resource: serviceIntegration<DdbUpdateItemReturnType<any>>,
  },
} as const

@Capability(DynamodbCapability)
class WithDdbCapabilityAppliedChain extends StateChain<
  keyof typeof taskToResourceMap,
  typeof taskToResourceMap
> {}
type Capabilities = [
  DynamodbCapability<keyof typeof taskToResourceMap, typeof taskToResourceMap>
]
describe('DynamodbCapability applied on StateChain', () => {
  let chain: ApplyCapabilities<
    StateChain<keyof typeof taskToResourceMap, typeof taskToResourceMap>,
    Capabilities
  >

  beforeEach(() => {
    chain = new WithDdbCapabilityAppliedChain(taskToResourceMap) as ApplyCapabilities<
      StateChain<keyof typeof taskToResourceMap, typeof taskToResourceMap>,
      Capabilities
    >
  })
  describe('addDdbItemGetTaskState', () => {
    it('should add a DynamoDB getItem task state', () => {
      chain.addDdbItemGetTaskState(
        'fetchUserData',
        {
          tableName: 'testTable',
          key: { id: { S: '123' } },
          attrsToGet: { id: true },
          resultSelector: { 'id.$': '$.Item.id.S' }
        }
      )
      const states = chain.states
      expect(states).toHaveLength(1)
      expect(states[0].stateName).toEqual('fetchUserData')
      expect((states[0].stateDetails as Task).Resource).toEqual(
        'arn:aws:states:::dynamodb:getItem'
      )
    })
  })
  describe('addDdbItemUpdateTaskState', () => {
    it('should add a DynamoDB updateItem task state', () => {
      chain.addDdbItemUpdateTaskState(
        'addUserData',
        {
          tableName: 'testTable',
          key: { id: { S: '123' } },
          attributeValues: { ':title': { S: 'titleVal' } },
          returnValues: "ALL_NEW",
          task: {}
        }
      )
      const states = chain.states
      expect(states).toHaveLength(1)
      expect(states[0].stateName).toEqual('addUserData')
      expect((states[0].stateDetails as Task).Resource).toEqual(
        'arn:aws:states:::dynamodb:updateItem'
      )
    })
  })
})
