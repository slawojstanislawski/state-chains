import { Project, SourceFile } from 'ts-morph'

import { addToExportBlock } from './addToExportBlock'

describe('addToExportBlock', () => {
  let project: Project
  let sourceFile: SourceFile

  beforeEach(() => {
    project = new Project()
    sourceFile = project.createSourceFile('temp.ts', '')
  })

  it('should add to an existing empty export block', () => {
    sourceFile.addStatements('export {}')
    addToExportBlock(sourceFile, 'TestExport')

    const exportDeclarations = sourceFile.getExportDeclarations()
    expect(exportDeclarations.length).toEqual(1)
    expect(exportDeclarations[0].getNamedExports().length).toEqual(1)
    expect(exportDeclarations[0].getNamedExports()[0].getName()).toEqual(
      'TestExport'
    )
  })

  it('should create a new export block if none exists', () => {
    addToExportBlock(sourceFile, 'TestExport')

    const exportDeclarations = sourceFile.getExportDeclarations()
    expect(exportDeclarations.length).toEqual(1)
    expect(exportDeclarations[0].getNamedExports().length).toEqual(1)
    expect(exportDeclarations[0].getNamedExports()[0].getName()).toEqual(
      'TestExport'
    )
  })

  it('should add to a non-empty export block', () => {
    sourceFile.addStatements('export { ExistingExport }')
    addToExportBlock(sourceFile, 'TestExport')

    const exportDeclarations = sourceFile.getExportDeclarations()
    expect(exportDeclarations.length).toEqual(1)
    expect(exportDeclarations[0].getNamedExports().length).toEqual(2)
    expect(exportDeclarations[0].getNamedExports()[0].getName()).toEqual(
      'ExistingExport'
    )
    expect(exportDeclarations[0].getNamedExports()[1].getName()).toEqual(
      'TestExport'
    )
  })
})
