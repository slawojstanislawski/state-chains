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

const collectionPath = path.join(__dirname, '../collection.json')
const pathFromProjectRoot = '/src/resources/sqs/queues'
const name = 'notifications'
describe('sqsQueue schematic', () => {
  let appTree: UnitTestTree
  let runner: SchematicTestRunner

  const updateTree = async () => {
    return await runSchematic(runner, appTree, 'sqsQueue', { name })
  }

  beforeEach(() => {
    runner = new SchematicTestRunner('schematics', collectionPath)
    appTree = new UnitTestTree(Tree.empty())
    appTree.create('serverless.ts', initialServerlessTsFile)
    appTree.create('/src/resources/sqs/index.ts', initialResourceIndexFile)
  })

  it('creates correct files in correct directories', async () => {
    const tree = await updateTree()

    const files = [
      `${pathFromProjectRoot}/${name}/${name}.queue.ts`,
      `${pathFromProjectRoot}/${name}/spec.ts`,
    ]
    files.forEach((fileName) => {
      expect(tree.files).toContain(fileName)
    })
  })

  it('produces a correct spec file', async () => {
    const tree = await updateTree()
    expect(tree.readContent(`${pathFromProjectRoot}/${name}/spec.ts`))
      .toEqual(`import { SqsQueueStageConfig } from '@libs/aws/sqs'
import { StageConfigMap } from '@libs/aws/types'

export const config: StageConfigMap<SqsQueueStageConfig> = {
  default: {},
}
`)
  })

  it('produces a correct queue file', async () => {
    const tree = await updateTree()
    expect(tree.readContent(`${pathFromProjectRoot}/${name}/${name}.queue.ts`))
      .toEqual(`import { getStageSpecificConfig, SqsQueue } from '@libs/aws/sqs'
import { TemplateAwsArn } from '@libs/aws/types'
import { createTemplateArn } from '@libs/aws/utils'
import { toStageQualifiedName } from '@libs/utils'

export const name = 'notificationsQueue'
export const stageQualifiedName = toStageQualifiedName(name)

export const spec: SqsQueue = {
  Type: 'AWS::SQS::Queue',
  Properties: {
    QueueName: stageQualifiedName,
    ...getStageSpecificConfig(__dirname),
  },
}

export const arn: TemplateAwsArn<'sqs'> = createTemplateArn(
  'sqs',
  stageQualifiedName
)
`)
  })

  it('modifies serverless.ts file content', async () => {
    const tree = await updateTree()
    expect(tree.readContent('/serverless.ts'))
      .toEqual(`import dotenv from 'dotenv'

import { CustomServerless } from './serverless.types'
import { SqsQueueNotifications } from "@resources/sqs";

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
    Resources: {
      [SqsQueueNotifications.name]: SqsQueueNotifications.spec
    }
  },
  functions: {},
  stepFunctions: {
    stateMachines: {},
  },
}

module.exports = serverlessConfiguration`)
  })

  it('modifies resources/sqs/index file content', async () => {
    const tree = await updateTree()
    expect(tree.readContent('/src/resources/sqs/index.ts')).toEqual(
      `import * as SqsQueueNotifications from "./queues/notifications/notifications.queue";

// \`export {}\` - do not remove until after first resource import+export is generated (generators need it)
export { SqsQueueNotifications }`
    )
  })
})
