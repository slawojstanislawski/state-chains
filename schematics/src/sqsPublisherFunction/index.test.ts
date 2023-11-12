import { Tree } from '@angular-devkit/schematics'
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing'
import * as path from 'path'

import { initialServerlessTsFile, runSchematic } from '../utils/testUtils'

const collectionPath = path.join(__dirname, '../collection.json')
const pathFromProjectRoot = '/src/functions'
const name = 'sqsPublisher'
const queueName = 'super'

describe('sqsPublisherFunction schematic', () => {
  let appTree: UnitTestTree
  let runner: SchematicTestRunner

  const updateTree = async () => {
    return await runSchematic(runner, appTree, 'sqsPublisherFunction', {
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
      `${pathFromProjectRoot}/sqsPublisher/spec.ts`,
      `${pathFromProjectRoot}/sqsPublisher/handler.ts`,
      `${pathFromProjectRoot}/sqsPublisher/index.ts`,
    ]
    files.forEach((fileName) => {
      expect(tree.files).toContain(fileName)
    })
  })

  it('produces a correct default spec file', async () => {
    const tree = await updateTree()
    expect(tree.readContent(`${pathFromProjectRoot}/sqsPublisher/spec.ts`))
      .toEqual(`import { LambdaStageConfig } from '@libs/aws/lambda'
import { StageConfigMap } from '@libs/aws/types'

export const config: StageConfigMap<LambdaStageConfig> = {
  default: {},
}
`)
  })

  it('produces a correct index.ts file', async () => {
    const tree = await updateTree()
    expect(
      tree.readContent(`${pathFromProjectRoot}/sqsPublisher/index.ts`)
    ).toEqual(
      `import {
  AwsFunctionSpec,
  handlerPath,
  getStageSpecificConfig,
} from '@libs/aws/lambda'

export { handler } from './handler'
export const spec: AwsFunctionSpec = {
  handler: \`\${handlerPath(__dirname)}/handler.handler\`,
  ...getStageSpecificConfig(__dirname),
}
export const name = 'sqsPublisher'
`
    )
  })

  it('produces a correct handler.ts file', async () => {
    const tree = await updateTree()
    expect(tree.readContent(`${pathFromProjectRoot}/sqsPublisher/handler.ts`))
      .toEqual(`import { SendMessageCommand } from '@aws-sdk/client-sqs'

import { getClient, getQueueUrl } from '@libs/aws/sqs'
import { TemplateAwsArn } from '@libs/aws/types/TemplateAwsArn.type'
import { getResourceNameFromArn } from '@libs/aws/utils'

export const handler = async () => {
  const sqs = getClient()
  const queueName = getResourceNameFromArn(
    process.env.SUPER_QUEUE_ARN as TemplateAwsArn<'sqs'>
  )
  const command = new SendMessageCommand({
    QueueUrl: getQueueUrl(queueName),
    MessageBody: JSON.stringify({
      id: '123',
      message: 'Hello from Lambda!',
    }),
    MessageAttributes: {
      id: {
        DataType: 'String',
        StringValue: '123',
      },
    },
  })

  let results
  try {
    results = await sqs.send(command)
  } catch (error) {
    console.error('error', error)
    console.error('error.$response', error.$response)
  }

  console.log('Delivered SQS message', results)
}
`)
  })

  it('modifies serverless.ts file content', async () => {
    const tree = await updateTree()
    expect(tree.readContent('/serverless.ts'))
      .toEqual(`import dotenv from 'dotenv'

import { CustomServerless } from './serverless.types'
import { SqsPublisher } from "@functions";

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
      SUPER_QUEUE_ARN: SqsQueueSuper.arn
    }
  },
  resources: {
    Resources: {}
  },
  functions: {
    [SqsPublisher.name]: SqsPublisher.spec
  },
  stepFunctions: {
    stateMachines: {},
  },
}

module.exports = serverlessConfiguration`)
  })
})
