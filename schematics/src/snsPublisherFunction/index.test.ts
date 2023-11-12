import { Tree } from '@angular-devkit/schematics'
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing'
import * as path from 'path'

import { initialServerlessTsFile, runSchematic } from '../utils/testUtils'

const collectionPath = path.join(__dirname, '../collection.json')
const pathFromProjectRoot = '/src/functions'
const name = 'snsPublisher'
const topicName = 'super'

describe('snsPublisherFunction schematic', () => {
  let appTree: UnitTestTree
  let runner: SchematicTestRunner

  const updateTree = async () => {
    return await runSchematic(runner, appTree, 'snsPublisherFunction', {
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
      `${pathFromProjectRoot}/snsPublisher/spec.ts`,
      `${pathFromProjectRoot}/snsPublisher/handler.ts`,
      `${pathFromProjectRoot}/snsPublisher/index.ts`,
    ]
    files.forEach((fileName) => {
      expect(tree.files).toContain(fileName)
    })
  })

  it('produces a correct default spec file', async () => {
    const tree = await updateTree()
    expect(tree.readContent(`${pathFromProjectRoot}/snsPublisher/spec.ts`))
      .toEqual(`import { LambdaStageConfig } from '@libs/aws/lambda'
import { StageConfigMap } from '@libs/aws/types'

export const config: StageConfigMap<LambdaStageConfig> = {
  default: {},
}
`)
  })

  it('produces a correct index.ts file', async () => {
    const tree = await updateTree()
    expect(tree.readContent(`${pathFromProjectRoot}/snsPublisher/index.ts`))
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
export const name = 'snsPublisher'
`)
  })

  it('produces a correct handler.ts file', async () => {
    const tree = await updateTree()
    expect(tree.readContent(`${pathFromProjectRoot}/snsPublisher/handler.ts`))
      .toEqual(`import { PublishCommand } from '@aws-sdk/client-sns'

import { getClient } from '@libs/aws/sns'

export const handler = async () => {
  const sns = getClient()
  const command = new PublishCommand({
    Message: '{"default": "hello!"}',
    MessageStructure: 'json',
    TopicArn: process.env.SUPER_TOPIC_ARN,
  })

  let results
  try {
    results = await sns.send(command)
  } catch (error) {
    console.error('error', error)
    console.error('error.$response', error.$response)
  }

  console.log('Delivered SNS message', results)
}
`)
  })

  it('modifies serverless.ts file content', async () => {
    const tree = await updateTree()
    expect(tree.readContent('/serverless.ts'))
      .toEqual(`import dotenv from 'dotenv'

import { CustomServerless } from './serverless.types'
import { SnsPublisher } from "@functions";

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
    environment: {
      SUPER_TOPIC_ARN: SnsTopicSuper.arn
    }
  },
  resources: {
    Resources: {}
  },
  functions: {
    [SnsPublisher.name]: SnsPublisher.spec
  },
  stepFunctions: {
    stateMachines: {},
  },
}

module.exports = serverlessConfiguration`)
  })
})
