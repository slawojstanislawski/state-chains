import { Task } from '../../../serverless.types'
import { TaskToResourceMapType, StateChain } from '../../stateMachine'
import {
  AddDdbItemUpdateTaskStateConfig,
  AddDdbItemDeleteTaskStateConfig,
  AddDdbItemPutTaskStateConfig,
  AddDdbItemGetTaskStateConfig,
} from './types'

export class DynamodbCapability<
  StateNames extends string,
  TaskToResourceMap extends TaskToResourceMapType<any>
> extends StateChain<StateNames, TaskToResourceMap> {
  addDdbItemGetTaskState<
    DdbRecordKeyType extends Record<string, any>,
    DdbRecordType extends Record<string, any>,
    StateName extends keyof TaskToResourceMap &
      StateNames = keyof TaskToResourceMapType<any> & StateNames
  >(
    stateName: StateName,
    config: AddDdbItemGetTaskStateConfig<DdbRecordKeyType, DdbRecordType>
  ) {
    const { tableName, key, attrsToGet, resultSelector, task = {} } = config
    const stateDetails: Task = {
      Type: 'Task',
      Resource: 'arn:aws:states:::dynamodb:getItem',
      Parameters: {
        TableName: tableName,
        Key: key,
        ProjectionExpression: Object.keys(attrsToGet).join(', '),
      },
      ResultSelector: resultSelector,
      ...task,
    }

    return this.addState(stateName, stateDetails)
  }

  addDdbItemUpdateTaskState<
    DdbRecordKeyType extends Record<string, any>,
    DdbRecordType extends Record<string, any>,
    StateName extends keyof TaskToResourceMapType<any> &
      StateNames = keyof TaskToResourceMapType<any> & StateNames
  >(
    stateName: StateName,
    config: AddDdbItemUpdateTaskStateConfig<DdbRecordKeyType, DdbRecordType>
  ) {
    const {
      tableName,
      key,
      attributeValues,
      returnValues = 'ALL_NEW',
      task = {},
    } = config
    const updateExpression =
      'set ' +
      Object.keys(attributeValues)
        .map((colonPrefixedKey) => {
          const nonPrefixedKey = colonPrefixedKey.slice(1)
          return `${nonPrefixedKey} = ${colonPrefixedKey}`
        })
        .join(', ')
    const stateDetails = {
      Type: 'Task',
      Resource: 'arn:aws:states:::dynamodb:updateItem',
      Parameters: {
        TableName: tableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: attributeValues,
        ReturnValues: returnValues,
      },
      ...task,
    } as Task

    return this.addState(stateName, stateDetails)
  }

  addDdbItemDeleteTaskState<
    DdbRecordKeyType extends Record<string, any>,
    DdbRecordType extends Record<string, any>,
    StateName extends keyof TaskToResourceMapType<any> &
      StateNames = keyof TaskToResourceMapType<any> & StateNames
  >(
    stateName: StateName,
    config: AddDdbItemDeleteTaskStateConfig<DdbRecordKeyType, DdbRecordType>
  ) {
    const {
      tableName,
      key,
      conditionExpression,
      expressionAttributeNames,
      expressionAttributeValues,
      returnValues = 'ALL_OLD',
      returnConsumedCapacity,
      returnItemCollectionMetrics,
      task = {},
    } = config

    const stateDetails: Task = {
      Type: 'Task',
      Resource: 'arn:aws:states:::dynamodb:deleteItem',
      Parameters: {
        TableName: tableName,
        Key: key,
        ...(conditionExpression && {
          ConditionExpression: conditionExpression,
        }),
        ...(expressionAttributeNames && {
          ExpressionAttributeNames: expressionAttributeNames,
        }),
        ...(expressionAttributeValues && {
          ExpressionAttributeValues: expressionAttributeValues,
        }),
        ReturnValues: returnValues,
        ...(returnConsumedCapacity && {
          ReturnConsumedCapacity: returnConsumedCapacity,
        }),
        ...(returnItemCollectionMetrics && {
          ReturnItemCollectionMetrics: returnItemCollectionMetrics,
        }),
      },
      ...task,
    }

    return this.addState(stateName, stateDetails)
  }
  addDdbItemPutTaskState<
    DdbRecordKeyType extends Record<string, any>,
    DdbRecordType extends Record<string, any>,
    StateName extends keyof TaskToResourceMapType<any> &
      StateNames = keyof TaskToResourceMapType<any> & StateNames
  >(
    stateName: StateName,
    config: AddDdbItemPutTaskStateConfig<DdbRecordKeyType, DdbRecordType>
  ) {
    const {
      tableName,
      item,
      conditionExpression,
      expressionAttributeNames,
      expressionAttributeValues,
      returnValues = 'ALL_OLD',
      returnConsumedCapacity,
      returnItemCollectionMetrics,
      task = {},
    } = config

    const stateDetails = {
      Type: 'Task',
      Resource: 'arn:aws:states:::dynamodb:putItem',
      Parameters: {
        TableName: tableName,
        Item: item,
        ...(conditionExpression && {
          ConditionExpression: conditionExpression,
        }),
        ...(expressionAttributeNames && {
          ExpressionAttributeNames: expressionAttributeNames,
        }),
        ...(expressionAttributeValues && {
          ExpressionAttributeValues: expressionAttributeValues,
        }),
        ReturnValues: returnValues,
        ...(returnConsumedCapacity && {
          ReturnConsumedCapacity: returnConsumedCapacity,
        }),
        ...(returnItemCollectionMetrics && {
          ReturnItemCollectionMetrics: returnItemCollectionMetrics,
        }),
      },
      ...task,
    } as Task

    return this.addState(stateName, stateDetails)
  }
}
