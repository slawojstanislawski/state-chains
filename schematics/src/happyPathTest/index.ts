import { Rule, chain } from '@angular-devkit/schematics'

import {
  addProperty,
  getComputedProperty,
  getVariableDeclaration,
  modifyFileWithTsMorph,
  getObjectAtPath,
  createNewProject,
} from '../utils'
import { Schema as AddCapabilityOptions } from './schema'

process.chdir(process.cwd())

let taskStateNames: string[]
export const happyPathTest = (options: AddCapabilityOptions): Rule => {
  const { stateMachine } = options

  return chain([
    modifyFileWithTsMorph(
      retrieveTaskStateNames,
      `./src/stateMachines/machines/${stateMachine}/constants/taskToResourceMap.ts`,
      options
    ),
    modifyFileWithTsMorph(
      createMockTypes,
      `./src/stateMachines/machines/${stateMachine}/test/${stateMachine}.testSuiteMocks.type.ts`,
      options
    ),
    modifyFileWithTsMorph(
      createTestSuite,
      `./src/stateMachines/machines/${stateMachine}/test/${stateMachine}.testSuite.ts`,
      options
    ),
    modifyFileWithTsMorph(
      createTestSuiteMockDefinition,
      `./src/stateMachines/machines/${stateMachine}/test/${stateMachine}.testSuiteMocks.ts`,
      options
    ),
  ])
}

function retrieveTaskStateNames(sourceCode: string): string {
  const project = createNewProject()
  const sourceFile = project.createSourceFile('temp.ts', sourceCode)
  const taskToResourceMap = getVariableDeclaration(
    'taskToResourceMap',
    sourceFile
  )
  const props = taskToResourceMap.getProperties()

  taskStateNames = props.map((p) => {
    const propertyAssignmentText = p.getText()
    return propertyAssignmentText
      .split(']')[0]
      .replace('[', '')
      .replace('StateName.', '')
  })

  return sourceFile.getFullText()
}

function createMockTypes(sourceCode: string): string {
  const project = createNewProject()
  const sourceFile = project.createSourceFile('temp.ts', sourceCode)
  const mockNameTypeAlias = sourceFile.getTypeAlias('TestSuiteMockName')
  const typeAlias = mockNameTypeAlias!.getType()
  const unionTypes = typeAlias.getUnionTypes()
  const unionTypeTexts = unionTypes.map((union) => {
    return union.getText().replace(/"/g, '')
  })
  const taskNamesWithNoSuccessMock = taskStateNames.filter((taskStateName) => {
    return !unionTypeTexts.includes(`${taskStateName}_SUCCESS`)
  })
  const finalUnionTypeTexts = [
    ...unionTypeTexts.map((taskName) => {
      return `'${taskName}'`
    }),
    ...taskNamesWithNoSuccessMock.map((taskName) => {
      return `'${taskName}_SUCCESS'`
    }),
  ]
  mockNameTypeAlias!.replaceWithText(
    `export type TestSuiteMockName = ${finalUnionTypeTexts.join(' | ')}`
  )
  return sourceFile.getFullText()
}

function createTestSuite(sourceCode: string): string {
  const project = createNewProject()
  const sourceFile = project.createSourceFile('temp.ts', sourceCode)
  const testSuite = getVariableDeclaration('testSuite', sourceFile)
  const HappyPath = getObjectAtPath(testSuite, ['TestCases', 'HappyPath'])

  taskStateNames.forEach((taskStateName) => {
    let alreadyPresent = false
    const propName = `[StateName.${taskStateName}]`
    try {
      getComputedProperty(HappyPath, propName)
      alreadyPresent = true
    } catch (e) {}
    if (!alreadyPresent) {
      addProperty(HappyPath, propName, `'${taskStateName}_SUCCESS'`)
    }
  })

  return sourceFile.getFullText()
}

function createTestSuiteMockDefinition(sourceCode: string): string {
  const project = createNewProject()
  const sourceFile = project.createSourceFile('temp.ts', sourceCode)
  const testSuiteMocks = getVariableDeclaration('testSuiteMocks', sourceFile)
  taskStateNames.forEach((taskStateName) => {
    let alreadyPresent = false
    const propName = `[StateName.${taskStateName}]`
    try {
      getComputedProperty(testSuiteMocks, propName)
      alreadyPresent = true
    } catch (e) {}
    if (!alreadyPresent) {
      addProperty(
        testSuiteMocks,
        propName,
        `{
  ${taskStateName}_SUCCESS: {
    '0': {
      Return: {},
    },
  },
}
`
      )
    }
  })

  return sourceFile.getFullText()
}
