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
import { ts, TypeLiteralNode } from 'ts-morph'

import {
  addImport,
  modifyFileWithTsMorph,
  addProperty,
  getVariableDeclaration,
  createNewProject,
  getObjectAtPath,
  addNamespacedImport,
  addToExportBlock,
  addNamedImport,
} from '../utils'
import { Schema as StateMachineOptions } from './schema'

process.chdir(process.cwd())
export const stateMachine = (options: StateMachineOptions): Rule => {
  return chain([
    generateFiles(options),
    modifyFileWithTsMorph(
      modifyServerlessFileTsMorph,
      'serverless.ts',
      options
    ),
    modifyFileWithTsMorph(
      modifyStateMachinesIndex,
      'src/stateMachines/machines/index.ts',
      options
    ),
    modifyFileWithTsMorph(
      modifyTestSuitesConfigurationTsMorph,
      './src/stateMachines/tests/index.ts',
      options
    ),
  ])
}
function generateFiles(options: StateMachineOptions): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const templateSource = apply(url('./files'), [
      template({ ...options, ...strings }),
      move('./src/stateMachines/machines'),
    ])
    return mergeWith(templateSource)
  }
}
function modifyTestSuitesConfigurationTsMorph(
  sourceCode: string,
  options: StateMachineOptions
) {
  const project = createNewProject()
  const sourceFile = project.createSourceFile('temp.ts', sourceCode)
  const stateMachineName = options.name
  const ucFirstStateMachineName = classify(stateMachineName)
  addImport(
    sourceFile,
    `@stateMachines/machines/${stateMachineName}`,
    `* as ${ucFirstStateMachineName}`
  )
  addImport(
    sourceFile,
    `@stateMachines/machines/${stateMachineName}/test`,
    `* as ${ucFirstStateMachineName}Test`
  )
  const typeAlias = sourceFile.getTypeAliasOrThrow('TestSuiteConfiguration')
  const typeNode = typeAlias.getTypeNodeOrThrow()
  if (typeNode.getKind() === ts.SyntaxKind.TypeLiteral) {
    const typeLiteralNode = typeNode as TypeLiteralNode
    typeLiteralNode.addProperty({
      name: `[${ucFirstStateMachineName}.name]`,
      type: `${ucFirstStateMachineName}Test.TaskResultMap`,
    })
  }
  const testCasesUnit = getVariableDeclaration('testCasesUnit', sourceFile)
  const StateMachinesUnit = getObjectAtPath(testCasesUnit, ['StateMachines'])
  addProperty(
    StateMachinesUnit,
    `[${ucFirstStateMachineName}.name]`,
    `${ucFirstStateMachineName}Test.testSuiteUnit`
  )
  const testCasesE2E = getVariableDeclaration('testCasesE2E', sourceFile)
  const StateMachinesE2E = getObjectAtPath(testCasesE2E, ['StateMachines'])
  addProperty(
    StateMachinesE2E,
    `[${ucFirstStateMachineName}.name]`,
    `${ucFirstStateMachineName}Test.testSuiteE2E`
  )
  const mockedIntegrations = getVariableDeclaration(
    'mockedIntegrations',
    sourceFile
  )
  const MockedResponses = getObjectAtPath(mockedIntegrations, [
    'MockedResponses',
  ])
  MockedResponses.addSpreadAssignment({
    expression: `${ucFirstStateMachineName}Test.mockedIntegrations`,
  })

  // Add to union type
  const mockNamesTypeAlias = sourceFile.getTypeAlias('TestSuiteMockNames')
  const text = mockNamesTypeAlias!.getFullText()
  mockNamesTypeAlias!.replaceWithText(
    text.replace('undefined', '').trim() +
      ` | ${ucFirstStateMachineName}Test.TestSuiteMockName`
  )

  return sourceFile.getFullText()
}
function modifyServerlessFileTsMorph(
  sourceCode: string,
  options: StateMachineOptions
): string {
  const project = createNewProject()
  const sourceFile = project.createSourceFile('temp.ts', sourceCode)
  const stateMachineName = options.name
  const ucFirstStateMachineName = classify(stateMachineName)
  addNamedImport(sourceFile, `@stateMachines/machines`, ucFirstStateMachineName)

  const serverlessConfig = getVariableDeclaration(
    'serverlessConfiguration',
    sourceFile
  )
  const taskResourceMapping = getObjectAtPath(serverlessConfig, [
    'custom',
    'stepFunctionsLocal',
    'TaskResourceMapping',
  ])
  taskResourceMapping.addSpreadAssignment({
    expression: `${ucFirstStateMachineName}.stateChain.getTaskToResourceMap(),`,
  })
  const stateMachinesBlock = getObjectAtPath(serverlessConfig, [
    'stepFunctions',
    'stateMachines',
  ])
  addProperty(
    stateMachinesBlock,
    `[${ucFirstStateMachineName}.name]`,
    `${ucFirstStateMachineName}.spec`
  )
  return sourceFile.getFullText()
}

function modifyStateMachinesIndex(
  sourceCode: string,
  options: StateMachineOptions
): string {
  const project = createNewProject()
  const sourceFile = project.createSourceFile('temp.ts', sourceCode)
  const stateMachineName = options.name
  const ucFirstStateMachineName = classify(stateMachineName)

  addNamespacedImport(
    sourceFile,
    ucFirstStateMachineName,
    `./${stateMachineName}`
  )
  addToExportBlock(sourceFile, ucFirstStateMachineName)

  return sourceFile.getFullText()
}
