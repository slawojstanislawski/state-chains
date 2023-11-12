import { Project, TypeAliasDeclaration } from 'ts-morph'

import { addTypeToTupleType } from './addTypeToTupleType'

describe('addTypeToTupleType', () => {
  let project: Project
  let sourceFile: any
  let typeAlias: TypeAliasDeclaration

  beforeEach(() => {
    project = new Project()
    sourceFile = project.createSourceFile(
      'test.ts',
      'type MyTuple = [string, number];'
    )
    typeAlias = sourceFile.getTypeAliasOrThrow('MyTuple')
  })

  it('should add the type to the tuple type when it does not exist', () => {
    addTypeToTupleType(typeAlias, 'boolean')
    expect(sourceFile.getText()).toBe(
      'type MyTuple = [boolean, string, number];'
    )
  })

  it('should not add the type to the tuple type when it already exists', () => {
    addTypeToTupleType(typeAlias, 'string')
    expect(sourceFile.getText()).toBe('type MyTuple = [string, number];')
  })
})
