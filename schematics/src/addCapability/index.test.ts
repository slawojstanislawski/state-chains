import { Tree } from '@angular-devkit/schematics'
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing'
import * as path from 'path'

import { runSchematic } from '../utils/testUtils'

const collectionPath = path.join(__dirname, '../collection.json')
describe('addCapability schematic', () => {
  let appTree: UnitTestTree
  let runner: SchematicTestRunner

  const updateTree = async () => {
    return await runSchematic(runner, appTree, 'addCapability', {
      names: 'dynamodb',
      stateMachine: 'processBucket',
    })
  }

  beforeEach(() => {
    runner = new SchematicTestRunner('schematics', collectionPath)
    appTree = new UnitTestTree(Tree.empty())
    appTree.create(
      '/src/stateMachines/machines/processBucket/processBucket.createChain.ts',
      `import { ApplyCapabilities, StateChain, Capability } from '@libs/stateMachine'
import { LambdaCapability } from '@libs/aws/lambda'
import { StateName, taskToResourceMap } from './constants'

type TaskToResourceMap = typeof taskToResourceMap
const BaseChain = StateChain<StateName, TaskToResourceMap>

@Capability(LambdaCapability)
class ProcessBucketChain extends BaseChain {}

type CapabilityTypes = [LambdaCapability<StateName, TaskToResourceMap>]

export const createChain = () => {
  return new ProcessBucketChain(taskToResourceMap) as ApplyCapabilities<
    typeof BaseChain,
    CapabilityTypes
  >
}
`
    )
  })

  it('modifies createChain.ts file content', async () => {
    const tree = await updateTree()
    expect(
      tree.readContent(
        '/src/stateMachines/machines/processBucket/processBucket.createChain.ts'
      )
    )
      .toEqual(`import { ApplyCapabilities, StateChain, Capability } from '@libs/stateMachine'
import { LambdaCapability } from '@libs/aws/lambda'
import { StateName, taskToResourceMap } from './constants'
import { DynamodbCapability } from "@libs/aws/dynamodb";

type TaskToResourceMap = typeof taskToResourceMap
const BaseChain = StateChain<StateName, TaskToResourceMap>

@Capability(LambdaCapability)
@Capability(DynamodbCapability)
class ProcessBucketChain extends BaseChain {}

type CapabilityTypes = [DynamodbCapability<StateName, TaskToResourceMap>, LambdaCapability<StateName, TaskToResourceMap>]

export const createChain = () => {
  return new ProcessBucketChain(taskToResourceMap) as ApplyCapabilities<
    typeof BaseChain,
    CapabilityTypes
  >
}
`)
  })
})
