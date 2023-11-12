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
  addToArray,
  createNewProject,
  getArrayAtPath,
  getObjectAtPath,
  addToExportBlock,
  addNamespacedImport,
} from '../utils'
import { Schema as DdbTableOptions } from './schema'

// change directory to project root
process.chdir(process.cwd())

export const ddbTable = (options: DdbTableOptions): Rule => {
  return chain([
    generateFiles(options),
    modifyFileWithTsMorph(
      modifyServerlessFileTsMorph,
      'serverless.ts',
      options
    ),
    modifyFileWithTsMorph(
      modifyResourcesDynamodbIndex,
      './src/resources/dynamodb/index.ts',
      options
    ),
    generateSeedTsFile(options),
  ])
}

function generateFiles(options: DdbTableOptions): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const templateSource = apply(url('./files'), [
      template({
        ...options,
        ...strings,
      }),
      move('./src/resources/dynamodb/tables'),
    ])

    return mergeWith(templateSource)
  }
}

function generateSeedTsFile(options: DdbTableOptions): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const templateSource = apply(url('./importFile'), [
      template({
        ...options,
        ...strings,
      }),
      move('./seed'),
    ])

    return mergeWith(templateSource)
  }
}

function modifyResourcesDynamodbIndex(
  sourceCode: string,
  options: DdbTableOptions
) {
  const project = createNewProject()
  const sourceFile = project.createSourceFile('temp.ts', sourceCode)
  const tableName = options.name
  const ucFirstTableName = classify(tableName)

  addNamespacedImport(
    sourceFile,
    `DdbTable${ucFirstTableName}`,
    `./tables/${tableName}/${tableName}.table`
  )
  addToExportBlock(sourceFile, `DdbTable${ucFirstTableName}`)

  return sourceFile.getFullText()
}

function modifyServerlessFileTsMorph(
  sourceCode: string,
  options: DdbTableOptions
): string {
  const project = createNewProject()
  const sourceFile = project.createSourceFile('temp.ts', sourceCode)
  const tableName = options.name
  const ucFirstTableName = classify(tableName)

  // add ddbTable import
  addNamedImport(
    sourceFile,
    `@resources/dynamodb`,
    `DdbTable${ucFirstTableName}`
  )

  // Add table to 'resources' prop of serverless config
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
    `[DdbTable${ucFirstTableName}.resourceKey]`,
    `DdbTable${ucFirstTableName}.spec`
  )

  // add ddb insert configuration
  const sources = getArrayAtPath(serverlessConfig, [
    'custom',
    'dynamodb',
    'seed',
    'standard',
    'sources',
  ])
  addToArray(
    sources,
    `{
  table: DdbTable${ucFirstTableName}.stageQualifiedName,
  sources: ['./seed/${tableName}.json'],
}`
  )

  return sourceFile.getFullText()
}
