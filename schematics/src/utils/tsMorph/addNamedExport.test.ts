import { Project, SourceFile } from 'ts-morph'

import { addNamedExport } from './addNamedExport'

describe('addNamedExport', () => {
  let project: Project
  let sourceFile: SourceFile

  beforeEach(() => {
    project = new Project()
    sourceFile = project.createSourceFile('test.ts', '')
  })

  it('should add the named export alias when it does not exist', () => {
    addNamedExport(sourceFile, 'myName', 'myAlias', './myModule')
    const exportDeclaration = sourceFile.getExportDeclarations()[0]
    const namedExport = exportDeclaration.getNamedExports()[0]
    expect(exportDeclaration.getModuleSpecifierValue()).toBe('./myModule')
    expect(namedExport.getName()).toBe('myName')
    expect(namedExport.getAliasNode()?.getText()).toBe('myAlias')
  })

  it('should not add the named export alias when it already exists', () => {
    addNamedExport(sourceFile, 'myName', 'myAlias', './myModule') // Add the named export once
    addNamedExport(sourceFile, 'myName', 'myAlias', './myModule') // Attempt to add the same named export again
    const exportDeclarations = sourceFile.getExportDeclarations()
    expect(exportDeclarations.length).toBe(1) // Only one export declaration should exist
    const namedExports = exportDeclarations[0].getNamedExports()
    expect(namedExports.length).toBe(1) // Only one named export should exist
    expect(namedExports[0].getName()).toBe('myName')
    expect(namedExports[0].getAliasNode()?.getText()).toBe('myAlias')
  })
})
