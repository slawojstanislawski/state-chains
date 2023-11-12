import { Project, SourceFile } from 'ts-morph'

import { getVariableDeclaration } from './getVariableDeclaration'

describe('getVariableDeclaration', () => {
  let project: Project
  let sourceFile: SourceFile

  beforeEach(() => {
    project = new Project()
    sourceFile = project.createSourceFile('test.ts', 'const myVariable = {};\n')
  })

  it('should get the variable declaration when it exists', () => {
    const variableDeclaration = getVariableDeclaration('myVariable', sourceFile)
    expect(variableDeclaration.getText()).toBe('{}')
  })

  it('should throw an error when the variable declaration does not exist', () => {
    expect(() =>
      getVariableDeclaration('nonExistentVariable', sourceFile)
    ).toThrow()
  })

  it('should throw an error when the initializer is not an object literal expression', () => {
    sourceFile = project.createSourceFile(
      'test2.ts',
      'const myVariable = 123;\n'
    )
    expect(() => getVariableDeclaration('myVariable', sourceFile)).toThrow()
  })
})
