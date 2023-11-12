import { Tree } from '@angular-devkit/schematics'
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing'
import * as path from 'path'

import { runSchematic } from '../utils/testUtils'

const collectionPath = path.join(__dirname, '../collection.json')
describe('happyPathTest schematic', () => {
  let appTree: UnitTestTree
  let runner: SchematicTestRunner

  const updateTree = async () => {
    return await runSchematic(runner, appTree, 'happyPathTest', {
      stateMachine: 'processBucket',
    })
  }

  beforeEach(() => {
    runner = new SchematicTestRunner('schematics', collectionPath)
    appTree = new UnitTestTree(Tree.empty())
    appTree.create(
      '/src/stateMachines/machines/processBucket/test/processBucket.testSuiteMocks.type.ts',
      `export type TestSuiteMockName = 'Dummy_SUCCESS'`
    )
    appTree.create(
      '/src/stateMachines/machines/processBucket/test/processBucket.testSuiteMocks.ts',
      `import { MockedServiceIntegrations } from '@libs/stateMachine'

import { createMockNameToMockedIntegrationMap } from '../../../utils/mockNameToMockedIntegration'
import { StateName } from '../constants'
import { TestSuiteMockName } from './processBucket.testSuiteMocks.type'
import { TaskResultMap } from './types'

export const testSuiteMocks: MockedServiceIntegrations<
  TaskResultMap,
  TestSuiteMockName
> = {
  [StateName.Dummy]: {
    Dummy_SUCCESS: {
      '0': {
        Return: 'Success! Input: 98765',
      },
    },
  },
}

export const mockedIntegrations = createMockNameToMockedIntegrationMap<
  TaskResultMap,
  TestSuiteMockName
>(testSuiteMocks)
`
    )
    appTree.create(
      '/src/stateMachines/machines/processBucket/constants/taskToResourceMap.ts',
      `import { Dummy } from '@functions'
import { SomeOtherFn } from '@functions'
import { StateName } from './StateName.enum'

export const taskToResourceMap = {
  [StateName.Dummy]: {
    name: Dummy.name,
    resource: Dummy.handler,
  },
  [StateName.SomeOtherTask]: {
    name: SomeOtherFn.name,
    resource: SomeOtherFn.handler,
  },
}`
    )
    appTree.create(
      '/src/stateMachines/machines/processBucket/test/processBucket.testSuite.ts',
      `import { StateMachineTestCases } from '@libs/stateMachine'

import { StateName } from '../constants'
import { testSuiteInputs } from './processBucket.testSuiteInputs.js'
import { TestSuiteMockName } from './processBucket.testSuiteMocks.type'
import { TaskResultMap } from './types'

export const testSuite: StateMachineTestCases<
  TaskResultMap,
  TestSuiteMockName,
  keyof typeof testSuiteInputs & string
> = {
  TestCases: {
    HappyPath: {
      [StateName.Dummy]: 'Dummy_SUCCESS',
    },
  },
}
`
    )
  })

  it('modifies testSuiteMocks.ts file content', async () => {
    const tree = await updateTree()
    expect(
      tree.readContent(
        '/src/stateMachines/machines/processBucket/test/processBucket.testSuiteMocks.ts'
      )
    ).toEqual(`import { MockedServiceIntegrations } from '@libs/stateMachine'

import { createMockNameToMockedIntegrationMap } from '../../../utils/mockNameToMockedIntegration'
import { StateName } from '../constants'
import { TestSuiteMockName } from './processBucket.testSuiteMocks.type'
import { TaskResultMap } from './types'

export const testSuiteMocks: MockedServiceIntegrations<
  TaskResultMap,
  TestSuiteMockName
> = {
  [StateName.Dummy]: {
    Dummy_SUCCESS: {
      '0': {
        Return: 'Success! Input: 98765',
      },
    },
  },
  [StateName.SomeOtherTask]: {
      SomeOtherTask_SUCCESS: {
        '0': {
          Return: {},
        },
      },
    }
}

export const mockedIntegrations = createMockNameToMockedIntegrationMap<
  TaskResultMap,
  TestSuiteMockName
>(testSuiteMocks)
`)
  })

  it('modifies testSuiteMocks.type.ts file content', async () => {
    const tree = await updateTree()
    expect(
      tree.readContent(
        '/src/stateMachines/machines/processBucket/test/processBucket.testSuiteMocks.type.ts'
      )
    ).toEqual(
      `export type TestSuiteMockName = 'Dummy_SUCCESS' | 'SomeOtherTask_SUCCESS'`
    )
  })

  it('modifies testSuite.ts file content', async () => {
    const tree = await updateTree()
    expect(
      tree.readContent(
        '/src/stateMachines/machines/processBucket/test/processBucket.testSuite.ts'
      )
    ).toEqual(`import { StateMachineTestCases } from '@libs/stateMachine'

import { StateName } from '../constants'
import { testSuiteInputs } from './processBucket.testSuiteInputs.js'
import { TestSuiteMockName } from './processBucket.testSuiteMocks.type'
import { TaskResultMap } from './types'

export const testSuite: StateMachineTestCases<
  TaskResultMap,
  TestSuiteMockName,
  keyof typeof testSuiteInputs & string
> = {
  TestCases: {
    HappyPath: {
      [StateName.Dummy]: 'Dummy_SUCCESS',
      [StateName.SomeOtherTask]: 'SomeOtherTask_SUCCESS'
    },
  },
}
`)
  })
})
