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
const pathFromProjectRoot = '/src/resources/sns/topics'
const name = 'notifications'
describe('snsTopic schematic', () => {
  let appTree: UnitTestTree
  let runner: SchematicTestRunner

  const updateTree = async () => {
    return await runSchematic(runner, appTree, 'snsTopic', { name })
  }

  beforeEach(() => {
    runner = new SchematicTestRunner('schematics', collectionPath)
    appTree = new UnitTestTree(Tree.empty())
    appTree.create('serverless.ts', initialServerlessTsFile)
    appTree.create('/src/resources/sns/index.ts', initialResourceIndexFile)
  })

  it('creates correct files in correct directories', async () => {
    const tree = await updateTree()
    const files = [
      `${pathFromProjectRoot}/${name}/${name}.topic.ts`,
      `${pathFromProjectRoot}/${name}/spec.ts`,
    ]
    files.forEach((fileName) => {
      expect(tree.files).toContain(fileName)
    })
  })

  it('produces a correct spec file', async () => {
    const tree = await updateTree()
    expect(tree.readContent(`${pathFromProjectRoot}/${name}/spec.ts`))
      .toEqual(`import { SnsTopicStageConfig } from '@libs/aws/sns'
import { StageConfigMap } from '@libs/aws/types'

export const config: StageConfigMap<SnsTopicStageConfig> = {
  default: {},
}
`)
  })

  it('produces a correct topic file', async () => {
    const tree = await updateTree()
    expect(tree.readContent(`${pathFromProjectRoot}/${name}/${name}.topic.ts`))
      .toEqual(`import { SnsTopic } from '@libs/aws/sns'
import { getStageSpecificConfig } from '@libs/aws/sns'
import { TemplateAwsArn } from '@libs/aws/types'
import { createTemplateArn } from '@libs/aws/utils'
import { toStageQualifiedName } from '@libs/utils'

export const name = 'notificationsTopic'
export const stageQualifiedName = toStageQualifiedName(name)

export const spec: SnsTopic = {
  Type: 'AWS::SNS::Topic',
  Properties: {
    TopicName: stageQualifiedName,
    ...getStageSpecificConfig(__dirname),
  },
}

export const arn: TemplateAwsArn<'sns'> = createTemplateArn(
  'sns',
  stageQualifiedName
)
`)
  })

  it('modifies serverless.ts file content', async () => {
    const tree = await updateTree()
    expect(tree.readContent('/serverless.ts'))
      .toEqual(`import dotenv from 'dotenv'

import { CustomServerless } from './serverless.types'
import { SnsTopicNotifications } from "@resources/sns";

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
      [SnsTopicNotifications.name]: SnsTopicNotifications.spec
    }
  },
  functions: {},
  stepFunctions: {
    stateMachines: {},
  },
}

module.exports = serverlessConfiguration`)
  })

  it('modifies resources/sns/index file content', async () => {
    const tree = await updateTree()
    expect(tree.readContent('/src/resources/sns/index.ts')).toEqual(
      `import * as SnsTopicNotifications from "./topics/notifications/notifications.topic";

// \`export {}\` - do not remove until after first resource import+export is generated (generators need it)
export { SnsTopicNotifications }`
    )
  })
})
