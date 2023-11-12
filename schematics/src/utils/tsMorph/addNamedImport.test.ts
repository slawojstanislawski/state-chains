import { Project, SourceFile } from 'ts-morph'

import { addNamedImport } from './addNamedImport'

describe('addNamedImport', () => {
  let project: Project
  let sourceFile: SourceFile

  beforeEach(() => {
    project = new Project()
    sourceFile = project.createSourceFile('test.ts', '')
  })

  it('should add the import when the module does not exist', () => {
    addNamedImport(sourceFile, './myModule', 'myImport')
    const importDeclaration = sourceFile.getImportDeclarations()[0]
    expect(importDeclaration.getModuleSpecifierValue()).toBe('./myModule')
    expect(importDeclaration.getNamedImports()[0].getName()).toBe('myImport')
  })

  it('should add the named import when the module exists but the import does not', () => {
    sourceFile.addImportDeclaration({
      moduleSpecifier: './myModule',
      namedImports: ['existingImport'],
    })
    addNamedImport(sourceFile, './myModule', 'myImport')
    const importDeclaration = sourceFile.getImportDeclarations()[0]
    expect(importDeclaration.getModuleSpecifierValue()).toBe('./myModule')
    const namedImports = importDeclaration.getNamedImports()
    expect(namedImports.length).toBe(2)
    expect(namedImports[0].getName()).toBe('existingImport')
    expect(namedImports[1].getName()).toBe('myImport')
  })

  it('should not add the named import when it already exists', () => {
    sourceFile.addImportDeclaration({
      moduleSpecifier: './myModule',
      namedImports: ['myImport'],
    })
    addNamedImport(sourceFile, './myModule', 'myImport')
    const importDeclaration = sourceFile.getImportDeclarations()[0]
    expect(importDeclaration.getModuleSpecifierValue()).toBe('./myModule')
    const namedImports = importDeclaration.getNamedImports()
    expect(namedImports.length).toBe(1)
    expect(namedImports[0].getName()).toBe('myImport')
  })
})
