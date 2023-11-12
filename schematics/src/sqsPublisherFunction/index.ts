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
  toUpperCase,
  createNewProject,
  getObjectAtPath,
  addNamedImport,
} from '../utils'
import { Schema as FunctionOptions } from './schema'

// change directory to project root
process.chdir(process.cwd())

export const sqsPublisherFunction = (options: FunctionOptions): Rule => {
  return chain([
    generateFiles(options),
    modifyFileWithTsMorph(
      modifyServerlessFileTsMorph,
      'serverless.ts',
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
        toUpperCase,
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
  const { name: functionName, queueName } = options
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
  // add queue environment variable
  const environment = getObjectAtPath(serverlessConfig, [
    'provider',
    'environment',
  ])
  addProperty(
    environment,
    `${toUpperCase(queueName)}_QUEUE_ARN`,
    `SqsQueue${classify(queueName)}.arn`
  )

  return sourceFile.getFullText()
}
