import { Project, SourceFile } from 'ts-morph'

import { addNamespacedExport } from './addNamespacedExport'

describe('addNamespacedExport', () => {
  let project: Project
  let sourceFile: SourceFile

  beforeEach(() => {
    project = new Project()
    sourceFile = project.createSourceFile('test.ts', '//some comment\n')
  })

  it('should add the namespaced export when it does not exist', () => {
    addNamespacedExport(sourceFile, 'myNamespace', './myModule')
    const exportDeclaration = sourceFile.getExportDeclarations()[0]
    expect(exportDeclaration.getNamespaceExport()?.getName()).toBe(
      'myNamespace'
    )
    expect(exportDeclaration.getModuleSpecifierValue()).toBe('./myModule')
  })

  it('should not add the namespaced export when it already exists', () => {
    addNamespacedExport(sourceFile, 'myNamespace', './myModule') // Add the export once
    addNamespacedExport(sourceFile, 'myNamespace', './myModule') // Attempt to add the same export again
    const exportDeclarations = sourceFile.getExportDeclarations()
    expect(exportDeclarations.length).toBe(1) // Only one export should exist
    expect(exportDeclarations[0].getNamespaceExport()?.getName()).toBe(
      'myNamespace'
    ) // Fixed line
    expect(exportDeclarations[0].getModuleSpecifierValue()).toBe('./myModule')
  })
})
