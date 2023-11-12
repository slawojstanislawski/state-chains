import { Tree } from '@angular-devkit/schematics'
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing'
import * as path from 'path'

import {
  initialServerlessTsFile,
  initialTestsIndexFile,
  runSchematic,
} from '../utils/testUtils'
import { initialStateMachinesIndex } from '../utils/testUtils/initialStateMachinesIndexFile'

const collectionPath = path.join(__dirname, '../collection.json')
const pathFromProjectRoot = '/src/stateMachines/machines'
const name = 'mynewstatemachine'
describe('stateMachine schematic', () => {
  let appTree: UnitTestTree
  let runner: SchematicTestRunner

  const updateTree = async () => {
    return await runSchematic(runner, appTree, 'stateMachine', { name })
  }

  beforeEach(() => {
    runner = new SchematicTestRunner('schematics', collectionPath)
    appTree = new UnitTestTree(Tree.empty())
    appTree.create('serverless.ts', initialServerlessTsFile)
    appTree.create('src/stateMachines/tests/index.ts', initialTestsIndexFile)
    appTree.create(
      'src/stateMachines/machines/index.ts',
      initialStateMachinesIndex
    )
  })

  it('creates correct files in correct directories', async () => {
    const tree = await updateTree()
    const files = [
      `${pathFromProjectRoot}/mynewstatemachine/constants/index.ts`,
      `${pathFromProjectRoot}/mynewstatemachine/constants/StateName.enum.ts`,
      `${pathFromProjectRoot}/mynewstatemachine/constants/taskToResourceMap.ts`,
      `${pathFromProjectRoot}/mynewstatemachine/test/index.ts`,
      `${pathFromProjectRoot}/mynewstatemachine/test/types/index.ts`,
      `${pathFromProjectRoot}/mynewstatemachine/test/types/TaskResultMap.type.ts`,
      `${pathFromProjectRoot}/mynewstatemachine/test/e2e/mynewstatemachine.testSuite.e2e.ts`,
      `${pathFromProjectRoot}/mynewstatemachine/test/e2e/mynewstatemachine.testSuiteInputs.e2e.js`,
      `${pathFromProjectRoot}/mynewstatemachine/test/unit/mynewstatemachine.testSuite.unit.ts`,
      `${pathFromProjectRoot}/mynewstatemachine/test/unit/mynewstatemachine.testSuiteInputs.unit.js`,
      `${pathFromProjectRoot}/mynewstatemachine/test/mynewstatemachine.testSuiteMocks.ts`,
      `${pathFromProjectRoot}/mynewstatemachine/test/mynewstatemachine.testSuiteMocks.type.ts`,
      `${pathFromProjectRoot}/mynewstatemachine/test/index.ts`,
      `${pathFromProjectRoot}/mynewstatemachine/mynewstatemachine.createChain.ts`,
      `${pathFromProjectRoot}/mynewstatemachine/mynewstatemachine.stateMachine.ts`,
      `${pathFromProjectRoot}/mynewstatemachine/index.ts`,
    ]
    files.forEach((fileName) => {
      expect(tree.files).toContain(fileName)
    })
  })

  it('produces a correct constants/index.ts file', async () => {
    const tree = await updateTree()
    expect(
      tree.readContent(
        `${pathFromProjectRoot}/mynewstatemachine/constants/index.ts`
      )
    ).toEqual(`import { toStageQualifiedLogicalId } from '@libs/stateMachine'
import { toStageQualifiedName } from '@libs/utils'

export const name = 'mynewstatemachine'
export const stageQualifiedName = toStageQualifiedName(name)
export const stageQualifiedId = toStageQualifiedLogicalId(name)

export * from './StateName.enum'
export * from './taskToResourceMap'
`)
  })

  it('produces a correct createChain file', async () => {
    const tree = await updateTree()
    expect(
      tree.readContent(
        `${pathFromProjectRoot}/mynewstatemachine/mynewstatemachine.createChain.ts`
      )
    )
      .toEqual(`import { ApplyCapabilities, StateChain, Capability } from '@libs/stateMachine'
import { LambdaCapability } from '@libs/aws/lambda'
import { StateName, taskToResourceMap } from './constants'

type TaskToResourceMap = typeof taskToResourceMap
const BaseChain = StateChain<
  StateName,
  TaskToResourceMap
>

@Capability(LambdaCapability)
class MynewstatemachineChain extends BaseChain {}

type CapabilityTypes = [LambdaCapability<StateName, TaskToResourceMap>]

export const createChain = () => {
  return new MynewstatemachineChain(taskToResourceMap) as ApplyCapabilities<
    typeof BaseChain,
    CapabilityTypes
  >
}
`)
  })

  it('produces a correct stateMachine file', async () => {
    const tree = await updateTree()
    expect(
      tree.readContent(
        `${pathFromProjectRoot}/mynewstatemachine/mynewstatemachine.stateMachine.ts`
      )
    ).toEqual(`import { isOffline } from '@libs/utils'

import { StateMachine } from '../../../../serverless.types'
import { createChain } from './mynewstatemachine.createChain'
import {
  stageQualifiedId,
  stageQualifiedName,
  name,
  StateName,
} from './constants'

export const stateChain = createChain().addLambdaTaskState(StateName.Dummy, {
  // Equivalent to passing undefined as that's basically the entire input
  // to the state machine. Using explicit params for example's sake.
  payload: { 'dummyInput.$': '$.dummyInput' },
  task: {
    End: true,
  },
})

export const spec: StateMachine = {
  name: isOffline() ? name : stageQualifiedName,
  id: stageQualifiedId,
  definition: {
    StartAt: stateChain.getStartingStateName(),
    States: stateChain.build(),
  },
}
`)
  })

  it('produces a correct e2e testSuite file', async () => {
    const tree = await updateTree()
    expect(
      tree.readContent(
        `${pathFromProjectRoot}/mynewstatemachine/test/e2e/mynewstatemachine.testSuite.e2e.ts`
      )
    ).toEqual(`import { StateMachineTestCases } from '@libs/stateMachine'

import { TestSuiteMockName } from '../mynewstatemachine.testSuiteMocks.type'
import { TaskResultMap } from '../types'
import { testSuiteInputs } from './mynewstatemachine.testSuiteInputs.e2e.js'

export const testSuiteE2E: StateMachineTestCases<
  TaskResultMap,
  TestSuiteMockName,
  keyof typeof testSuiteInputs & string
> = {
  TestCases: {
    HappyPath: {},
  },
}
`)
  })

  it('produces a correct e2e testSuiteInputs file', async () => {
    const tree = await updateTree()
    expect(
      tree.readContent(
        `${pathFromProjectRoot}/mynewstatemachine/test/e2e/mynewstatemachine.testSuiteInputs.e2e.js`
      )
    ).toEqual(`module.exports = {
  testSuiteInputs: {
    HappyPath: {
      dummyInput: 98765,
    },
  },
}
`)
  })

  it('produces a correct unit testSuite file', async () => {
    const tree = await updateTree()
    expect(
      tree.readContent(
        `${pathFromProjectRoot}/mynewstatemachine/test/unit/mynewstatemachine.testSuite.unit.ts`
      )
    ).toEqual(`import { StateMachineTestCases } from '@libs/stateMachine'

import { StateName } from '../../constants'
import { TestSuiteMockName } from '../mynewstatemachine.testSuiteMocks.type'
import { TaskResultMap } from '../types'
import { testSuiteInputs } from './mynewstatemachine.testSuiteInputs.unit.js'

export const testSuiteUnit: StateMachineTestCases<
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
`)
  })

  it('produces a correct unit testSuiteInputs file', async () => {
    const tree = await updateTree()
    expect(
      tree.readContent(
        `${pathFromProjectRoot}/mynewstatemachine/test/unit/mynewstatemachine.testSuiteInputs.unit.js`
      )
    ).toEqual(`module.exports = {
  testSuiteInputs: {
    HappyPath: {
      dummyInput: 98765,
    },
  },
}
`)
  })

  it('produces a correct testSuiteMocks file', async () => {
    const tree = await updateTree()
    expect(
      tree.readContent(
        `${pathFromProjectRoot}/mynewstatemachine/test/mynewstatemachine.testSuiteMocks.ts`
      )
    )
      .toEqual(`import { createMockNameToMockedIntegrationMap } from '@libs/aws/stepfunctions'
import { MockedServiceIntegrations } from '@libs/stateMachine'

import { StateName } from '../constants'
import { TestSuiteMockName } from './mynewstatemachine.testSuiteMocks.type'
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
`)
  })

  it('produces a correct tests index file', async () => {
    const tree = await updateTree()
    expect(
      tree.readContent(`${pathFromProjectRoot}/mynewstatemachine/test/index.ts`)
    ).toEqual(`export * from './types'
export * from './unit/mynewstatemachine.testSuite.unit'
export * from './e2e/mynewstatemachine.testSuite.e2e'
export * from './mynewstatemachine.testSuiteMocks'
export * from './mynewstatemachine.testSuiteMocks.type'
`)
  })

  it('modifies serverless.ts file content', async () => {
    const tree = await updateTree()
    expect(tree.readContent('/serverless.ts'))
      .toEqual(`import dotenv from 'dotenv'

import { CustomServerless } from './serverless.types'
import { Mynewstatemachine } from "@stateMachines/machines";

dotenv.config()

const serverlessConfiguration: CustomServerless = {
  service: 'stepfunctions',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: [],
  package: { individually: true },
  custom: {
    stepFunctionsLocal: {
      TaskResourceMapping: {
        ...Mynewstatemachine.stateChain.getTaskToResourceMap(),
      },
    },
    dynamodb: {
      seed: {
        standard: {
          sources: [],
        },
      },
    },
  },
  provider: {
    environment: {}
  },
  resources: {
    Resources: {}
  },
  functions: {},
  stepFunctions: {
    stateMachines: {
      [Mynewstatemachine.name]: Mynewstatemachine.spec
    },
  },
}

module.exports = serverlessConfiguration`)
  })

  it('modifies test suite index file content', async () => {
    const tree = await updateTree()
    expect(tree.readContent('/src/stateMachines/tests/index.ts'))
      .toEqual(`import { TestSuite } from '@libs/stateMachine'
import * as Mynewstatemachine from "@stateMachines/machines/mynewstatemachine";
import * as MynewstatemachineTest from "@stateMachines/machines/mynewstatemachine/test";

type TestSuiteConfiguration = {
  [Mynewstatemachine.name]: MynewstatemachineTest.TaskResultMap;
}

const testCasesUnit = {
  StateMachines: {
    [Mynewstatemachine.name]: MynewstatemachineTest.testSuiteUnit
  },
}

const testCasesE2E = {
  StateMachines: {
    [Mynewstatemachine.name]: MynewstatemachineTest.testSuiteE2E
  },
}

const mockedIntegrations = {
  MockedResponses: {
    ...MynewstatemachineTest.mockedIntegrations
  },
}

type TestSuiteMockNames = | MynewstatemachineTest.TestSuiteMockName

export const testSuitesUnit: TestSuite<TestSuiteConfiguration, TestSuiteMockNames> = {
  ...testCasesUnit,
  ...mockedIntegrations,
}

export const testSuitesE2E: TestSuite<TestSuiteConfiguration, TestSuiteMockNames> = {
  ...testCasesE2E,
  ...mockedIntegrations,
}
`)
  })

  it('modifies state machines index file content', async () => {
    const tree = await updateTree()
    expect(tree.readContent('/src/stateMachines/machines/index.ts')).toEqual(
      `import * as Mynewstatemachine from "./mynewstatemachine";

// \`export {}\`  - do not remove until after first state machine import+export is generated (generators need it)

export { Mynewstatemachine }
`
    )
  })
})
