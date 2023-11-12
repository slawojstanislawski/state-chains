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
  addProperty,
  getVariableDeclaration,
  modifyFileWithTsMorph,
  getObjectAtPath,
  createNewProject,
  addNamespacedImport,
  addToExportBlock,
  addNamedImport,
} from '../utils'
import { Schema as FunctionOptions } from './schema'

// change directory to project root
process.chdir(process.cwd())

export const lambda = (options: FunctionOptions): Rule => {
  return chain([
    generateFiles(options),
    modifyFileWithTsMorph(
      modifyServerlessFileTsMorph,
      'serverless.ts',
      options
    ),
    modifyFileWithTsMorph(
      modifyFunctionsIndex,
      'src/functions/index.ts',
      options
    ),
  ])
}

function generateFiles(options: FunctionOptions): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const templateSource = apply(url('./files'), [
      template({
        ...options,
        ...strings,
      }),
      move('./src/functions'),
    ])

    return mergeWith(templateSource)
  }
}

function modifyServerlessFileTsMorph(
  sourceCode: string,
  options: FunctionOptions
): string {
  const project = createNewProject()
  const sourceFile = project.createSourceFile('temp.ts', sourceCode)
  const functionName = options.name
  const ucFirstFunctionName = classify(functionName)

  // add the function import
  addNamedImport(sourceFile, '@functions', ucFirstFunctionName)

  // Add the function to 'functions' prop of serverless config
  const serverlessConfig = getVariableDeclaration(
    'serverlessConfiguration',
    sourceFile
  )
  const functions = getObjectAtPath(serverlessConfig, ['functions'])
  addProperty(
    functions,
    `[${ucFirstFunctionName}.name]`,
    `${ucFirstFunctionName}.spec`
  )

  return sourceFile.getFullText()
}

function modifyFunctionsIndex(
  sourceCode: string,
  options: FunctionOptions
): string {
  const project = createNewProject()
  const sourceFile = project.createSourceFile('temp.ts', sourceCode)
  const functionName = options.name
  const ucFirstFunctionName = classify(functionName)

  addNamespacedImport(sourceFile, ucFirstFunctionName, `./${functionName}`)
  addToExportBlock(sourceFile, ucFirstFunctionName)

  return sourceFile.getFullText()
}
