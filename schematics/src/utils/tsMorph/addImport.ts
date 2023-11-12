import { SourceFile } from 'ts-morph'

export function addImport(
  sourceFile: SourceFile,
  module: string,
  alias: string
) {
  const existingImportDeclaration = sourceFile
    .getImportDeclarations()
    .find(
      (importDeclaration) =>
        importDeclaration.getModuleSpecifierValue() === module &&
        importDeclaration.getDefaultImport()?.getText() === alias
    )

  if (!existingImportDeclaration) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: module,
      defaultImport: alias,
    })
  }
}
