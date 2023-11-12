import { strings } from '@angular-devkit/core'
import { classify } from '@angular-devkit/core/src/utils/strings'
import {
  apply,
  url,
  template,
  move,
  mergeWith,
  Rule,
  Tree,
  SchematicContext,
  chain,
} from '@angular-devkit/schematics'

import {
  modifyFileWithTsMorph,
  addProperty,
  getVariableDeclaration,
  addNamedImport,
  createNewProject,
  getObjectAtPath,
  addNamespacedImport,
  addToExportBlock,
} from '../utils'
import { Schema as SqsQueueOptions } from './schema'

// change directory to project root
process.chdir(process.cwd())

export const sqsQueue = (options: SqsQueueOptions): Rule => {
  return chain([
    generateFiles(options),
    modifyFileWithTsMorph(
      modifyServerlessFileTsMorph,
      'serverless.ts',
      options
    ),
    modifyFileWithTsMorph(
      modifyResourcesSqsIndex,
      './src/resources/sqs/index.ts',
      options
    ),
  ])
}

function generateFiles(options: SqsQueueOptions): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const templateSource = apply(url('./files'), [
      template({
        ...options,
        ...strings,
      }),
      move('./src/resources/sqs/queues'),
    ])

    return mergeWith(templateSource)
  }
}

function modifyResourcesSqsIndex(sourceCode: string, options: SqsQueueOptions) {
  const project = createNewProject()
  const sourceFile = project.createSourceFile('temp.ts', sourceCode)
  const queueName = options.name
  const ucFirstQueueName = classify(queueName)

  addNamespacedImport(
    sourceFile,
    `SqsQueue${ucFirstQueueName}`,
    `./queues/${queueName}/${queueName}.queue`
  )
  addToExportBlock(sourceFile, `SqsQueue${ucFirstQueueName}`)

  return sourceFile.getFullText()
}

function modifyServerlessFileTsMorph(
  sourceCode: string,
  options: SqsQueueOptions
): string {
  const project = createNewProject()
  const sourceFile = project.createSourceFile('temp.ts', sourceCode)
  const queueName = options.name
  const ucFirstQueueName = classify(queueName)

  // add sqsQueue import
  addNamedImport(sourceFile, `@resources/sqs`, `SqsQueue${ucFirstQueueName}`)

  // Add queue to 'resources' prop of serverless config
  const serverlessConfig = getVariableDeclaration(
    'serverlessConfiguration',
    sourceFile
  )
  const resources = getObjectAtPath(serverlessConfig, [
    'resources',
    'Resources',
  ])
  addProperty(
    resources,
    `[SqsQueue${ucFirstQueueName}.name]`,
    `SqsQueue${ucFirstQueueName}.spec`
  )

  return sourceFile.getFullText()
}
