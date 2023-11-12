import { Project, SourceFile } from 'ts-morph'

import { addImport } from './addImport'

describe('addImport', () => {
  let project: Project
  let sourceFile: SourceFile

  beforeEach(() => {
    project = new Project()
    sourceFile = project.createSourceFile('test.ts', '')
  })

  it('should add the import when it does not exist', () => {
    addImport(sourceFile, './myModule', 'myAlias')
    const importDeclaration = sourceFile.getImportDeclarations()[0]
    expect(importDeclaration.getModuleSpecifierValue()).toBe('./myModule')
    expect(importDeclaration.getDefaultImport()?.getText()).toBe('myAlias')
  })

  it('should not add the import when it already exists', () => {
    addImport(sourceFile, './myModule', 'myAlias') // Add the import once
    addImport(sourceFile, './myModule', 'myAlias') // Attempt to add the same import again
    const importDeclarations = sourceFile.getImportDeclarations()
    expect(importDeclarations.length).toBe(1) // Only one import should exist
  })
})
