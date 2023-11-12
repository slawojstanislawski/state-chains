import { Tree } from '@angular-devkit/schematics'
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing'
import * as path from 'path'

import {
  initialResourceIndexFile,
  initialServerlessTsFile,
  runSchematic,
} from '../utils/testUtils'

const collectionPath = path.join(__dirname, '..', 'collection.json')
const pathFromProjectRoot = '/src/resources/dynamodb/tables'
const name = 'users'
describe('ddbTable schematic', () => {
  let appTree: UnitTestTree
  let runner: SchematicTestRunner

  const updateTree = async () => {
    return await runSchematic(runner, appTree, 'ddbTable', {
      name,
    })
  }

  beforeEach(() => {
    runner = new SchematicTestRunner('schematics', collectionPath)
    appTree = new UnitTestTree(Tree.empty())
    appTree.create('serverless.ts', initialServerlessTsFile)
    appTree.create('/src/resources/dynamodb/index.ts', initialResourceIndexFile)
  })

  it('creates correct files in correct directories', async () => {
    const tree = await updateTree()
    const files = [
      `${pathFromProjectRoot}/${name}/spec.ts`,
      `${pathFromProjectRoot}/${name}/${name}.table.ts`,
    ]
    files.forEach((fileName) => {
      expect(tree.files).toContain(fileName)
    })
  })

  it('produces a correct default spec file', async () => {
    const tree = await updateTree()
    expect(tree.readContent(`${pathFromProjectRoot}/${name}/spec.ts`))
      .toEqual(`import { DdbTableStageConfig } from '@libs/aws/dynamodb'
import { StageConfigMap } from '@libs/aws/types'

import { RecordType } from './users.table'

export const config: StageConfigMap<DdbTableStageConfig<RecordType>> = {
  default: {
    BillingMode: 'PAY_PER_REQUEST',
  },
}
`)
  })

  it('produces a correct table file', async () => {
    const tree = await updateTree()
    expect(tree.readContent(`${pathFromProjectRoot}/${name}/${name}.table.ts`))
      .toEqual(`import {
  DdbTable,
  getStageSpecificConfig,
  InferKey,
  KeySchema,
} from '@libs/aws/dynamodb'
import { toStageQualifiedName } from '@libs/utils'

export const name = 'users'
export const resourceKey = 'usersTable'
export const stageQualifiedName = toStageQualifiedName(name)

export type RecordType = {
  id: string
}

const keySchema = [
  {
    AttributeName: 'id',
    KeyType: 'HASH',
  },
] satisfies KeySchema<RecordType>

export const spec: DdbTable<RecordType> = {
  Type: 'AWS::DynamoDB::Table',
  Properties: {
    TableName: stageQualifiedName,
    BillingMode: 'PAY_PER_REQUEST',
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S',
      },
    ],
    KeySchema: keySchema,
    ...getStageSpecificConfig(__dirname),
  },
}

export type KeysType = InferKey<typeof keySchema>
`)
  })

  it('produces a correct seed file', async () => {
    const tree = await updateTree()
    expect(tree.readContent(`/seed/${name}.ts`))
      .toEqual(`import { DdbTableUsers } from '@resources/dynamodb'

export const records = [] as DdbTableUsers.RecordType[]
`)
  })

  it('modifies serverless.ts file content', async () => {
    const tree = await updateTree()
    expect(tree.readContent('/serverless.ts'))
      .toEqual(`import dotenv from 'dotenv'

import { CustomServerless } from './serverless.types'
import { DdbTableUsers } from "@resources/dynamodb";

dotenv.config()

const serverlessConfiguration: CustomServerless = {
  service: 'stepfunctions',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: [],
  package: { individually: true },
  custom: {
    stepFunctionsLocal: {
      TaskResourceMapping: {},
    },
    dynamodb: {
      seed: {
        standard: {
          sources: [{
              table: DdbTableUsers.stageQualifiedName,
              sources: ['./seed/users.json'],
            }],
        },
      },
    },
  },
  provider: {
    environment: {}
  },
  resources: {
    Resources: {
      [DdbTableUsers.resourceKey]: DdbTableUsers.spec
    }
  },
  functions: {},
  stepFunctions: {
    stateMachines: {},
  },
}

module.exports = serverlessConfiguration`)
  })

  it('modifies resources/dynamodb/index file content', async () => {
    const tree = await updateTree()
    expect(tree.readContent('/src/resources/dynamodb/index.ts'))
      .toEqual(`import * as DdbTableUsers from "./tables/users/users.table";

// \`export {}\` - do not remove until after first resource import+export is generated (generators need it)
export { DdbTableUsers }`)
  })
})
