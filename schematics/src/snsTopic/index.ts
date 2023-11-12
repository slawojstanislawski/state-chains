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
import { Schema as SnsTopicOptions } from './schema'

// change directory to project root
process.chdir(process.cwd())

export const snsTopic = (options: SnsTopicOptions): Rule => {
  return chain([
    generateFiles(options),
    modifyFileWithTsMorph(
      modifyServerlessFileTsMorph,
      'serverless.ts',
      options
    ),
    modifyFileWithTsMorph(
      modifyResourcesSnsIndex,
      './src/resources/sns/index.ts',
      options
    ),
  ])
}

function generateFiles(options: SnsTopicOptions): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const templateSource = apply(url('./files'), [
      template({
        ...options,
        ...strings,
      }),
      move('./src/resources/sns/topics'),
    ])

    return mergeWith(templateSource)
  }
}

function modifyResourcesSnsIndex(sourceCode: string, options: SnsTopicOptions) {
  const project = createNewProject()
  const sourceFile = project.createSourceFile('temp.ts', sourceCode)
  const topicName = options.name
  const ucFirstTopicName = classify(topicName)

  addNamespacedImport(
    sourceFile,
    `SnsTopic${ucFirstTopicName}`,
    `./topics/${topicName}/${topicName}.topic`
  )
  addToExportBlock(sourceFile, `SnsTopic${ucFirstTopicName}`)

  return sourceFile.getFullText()
}

function modifyServerlessFileTsMorph(
  sourceCode: string,
  options: SnsTopicOptions
): string {
  const project = createNewProject()
  const sourceFile = project.createSourceFile('temp.ts', sourceCode)
  const topicName = options.name
  const ucFirstTopicName = classify(topicName)

  // add snsTopic import
  addNamedImport(sourceFile, `@resources/sns`, `SnsTopic${ucFirstTopicName}`)

  // Add topic to 'resources' prop of serverless config
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
    `[SnsTopic${ucFirstTopicName}.name]`,
    `SnsTopic${ucFirstTopicName}.spec`
  )

  return sourceFile.getFullText()
}
