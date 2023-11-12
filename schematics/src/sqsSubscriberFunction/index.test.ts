import { Tree } from '@angular-devkit/schematics'
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing'
import * as path from 'path'

import { initialServerlessTsFile, runSchematic } from '../utils/testUtils'

const collectionPath = path.join(__dirname, '../collection.json')
const pathFromProjectRoot = '/src/functions'
const name = 'sqsSubscriber'
const queueName = 'super'

describe('sqsSubscriberFunction schematic', () => {
  let appTree: UnitTestTree
  let runner: SchematicTestRunner

  const updateTree = async () => {
    return await runSchematic(runner, appTree, 'sqsSubscriberFunction', {
      name,
      queueName,
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
      `${pathFromProjectRoot}/sqsSubscriber/spec.ts`,
      `${pathFromProjectRoot}/sqsSubscriber/handler.ts`,
      `${pathFromProjectRoot}/sqsSubscriber/index.ts`,
    ]
    files.forEach((fileName) => {
      expect(tree.files).toContain(fileName)
    })
  })

  it('produces a correct default spec file', async () => {
    const tree = await updateTree()
    expect(tree.readContent(`${pathFromProjectRoot}/sqsSubscriber/spec.ts`))
      .toEqual(`import { LambdaStageConfig } from '@libs/aws/lambda'
import { createSqsEventLambdaTrigger } from '@libs/aws/sqs'
import { StageConfigMap } from '@libs/aws/types'
import { SqsQueueSuper } from '@resources/sqs'

export const config: StageConfigMap<LambdaStageConfig> = {
  default: {
    events: [createSqsEventLambdaTrigger(SqsQueueSuper.name)],
  },
}
`)
  })

  it('produces a correct index.ts file', async () => {
    const tree = await updateTree()
    expect(tree.readContent(`${pathFromProjectRoot}/sqsSubscriber/index.ts`))
      .toContain(`import {
  AwsFunctionSpec,
  handlerPath,
  getStageSpecificConfig,
} from '@libs/aws/lambda'

export { handler } from './handler'
export const spec: AwsFunctionSpec = {
  handler: \`$\{handlerPath(__dirname)}/handler.handler\`,
  ...getStageSpecificConfig(__dirname),
}
export const name = 'sqsSubscriber'
`)
  })

  it('produces a correct handler.ts file', async () => {
    const tree = await updateTree()
    expect(tree.readContent(`${pathFromProjectRoot}/sqsSubscriber/handler.ts`))
      .toContain(`import { SQSEvent } from 'aws-lambda/trigger/sqs'

export const handler = async (event: SQSEvent) => {
  console.log('Received SQS event', event)
}
`)
  })

  it('modifies serverless.ts file content', async () => {
    const tree = await updateTree()
    expect(tree.readContent('/serverless.ts'))
      .toEqual(`import dotenv from 'dotenv'

import { CustomServerless } from './serverless.types'
import { SqsSubscriber } from "@functions";

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
    [SqsSubscriber.name]: SqsSubscriber.spec
  },
  stepFunctions: {
    stateMachines: {},
  },
}

module.exports = serverlessConfiguration`)
  })
})
