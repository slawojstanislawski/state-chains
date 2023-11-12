import { Tree } from '@angular-devkit/schematics'
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing'
import * as path from 'path'

import { initialServerlessTsFile, runSchematic } from '../utils/testUtils'

const collectionPath = path.join(__dirname, '../collection.json')
const pathFromProjectRoot = '/src/functions'
const name = 'snsSubscriber'
const topicName = 'super'

describe('snsSubscriberFunction schematic', () => {
  let appTree: UnitTestTree
  let runner: SchematicTestRunner

  const updateTree = async () => {
    return await runSchematic(runner, appTree, 'snsSubscriberFunction', {
      name,
      topicName,
    })
  }

  beforeEach(() => {
    runner = new SchematicTestRunner('schematics', collectionPath)
    appTree = new UnitTestTree(Tree.empty())
    appTree.create('serverless.ts', initialServerlessTsFile)
  })

  it('creates correct files in correct directories', async () => {
    const tree = await updateTree()
    const files = [
      `${pathFromProjectRoot}/snsSubscriber/spec.ts`,
      `${pathFromProjectRoot}/snsSubscriber/handler.ts`,
      `${pathFromProjectRoot}/snsSubscriber/index.ts`,
    ]
    files.forEach((fileName) => {
      expect(tree.files).toContain(fileName)
    })
  })

  it('produces a correct default spec file', async () => {
    const tree = await updateTree()
    expect(tree.readContent(`${pathFromProjectRoot}/snsSubscriber/spec.ts`))
      .toEqual(`import { LambdaStageConfig } from '@libs/aws/lambda'
import { createSnsEventLambdaTrigger } from '@libs/aws/sns'
import { StageConfigMap } from '@libs/aws/types'
import { SnsTopicSuper } from '@resources/sns'

export const config: StageConfigMap<LambdaStageConfig> = {
  default: {
    events: [
      createSnsEventLambdaTrigger(
        SnsTopicSuper.name,
        SnsTopicSuper.stageQualifiedName
      ),
    ],
  },
}
`)
  })

  it('produces a correct index.ts file', async () => {
    const tree = await updateTree()
    expect(tree.readContent(`${pathFromProjectRoot}/snsSubscriber/index.ts`))
      .toEqual(`import {
  AwsFunctionSpec,
  handlerPath,
  getStageSpecificConfig,
} from '@libs/aws/lambda'

export { handler } from './handler'
export const spec: AwsFunctionSpec = {
  handler: \`\${handlerPath(__dirname)}/handler.handler\`,
  ...getStageSpecificConfig(__dirname),
}
export const name = 'snsSubscriber'
`)
  })

  it('produces a correct handler.ts file', async () => {
    const tree = await updateTree()
    expect(tree.readContent(`${pathFromProjectRoot}/snsSubscriber/handler.ts`))
      .toEqual(`export const handler = async (message: any) => {
  console.log('Received SNS message', message)
}
`)
  })

  it('modifies serverless.ts file content', async () => {
    const tree = await updateTree()
    expect(tree.readContent('/serverless.ts'))
      .toEqual(`import dotenv from 'dotenv'

import { CustomServerless } from './serverless.types'
import { SnsSubscriber } from "@functions";

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
  functions: {
    [SnsSubscriber.name]: SnsSubscriber.spec
  },
  stepFunctions: {
    stateMachines: {},
  },
}

module.exports = serverlessConfiguration`)
  })
})
