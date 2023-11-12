import { SourceFile } from 'ts-morph'

/**
 * Adds a named export with an optional alias to a given `sourceFile` if it doesn't already exist.
 *
 * @param sourceFile - The source file where the named export with alias will be added.
 * @param name - The name of the exported item.
 * @param alias - The alias for the exported item.
 * @param module - The module or path from which the item is exported.
 *
 * @example
 * ```typescript

 * addNamedExport(source, 'OriginalName', 'ExportedAlias', './modulePath');
 * ```
 *
 * After executing the function, the export in the source file will look like:
 * ```typescript
 * export { OriginalName as ExportedAlias } from './modulePath';
 * ```
 *
 * Note: The function is designed to avoid redundancies. If an identical named export with the
 * same alias from the same module already exists in the `sourceFile`, no changes will be introduced.
 */
export function addNamedExport(
  sourceFile: SourceFile,
  name: string,
  alias: string,
  module: string
) {
  const existingExportDeclarations = sourceFile.getExportDeclarations()
  const existingAlias = existingExportDeclarations.some(
    (exportDeclaration) =>
      exportDeclaration.getModuleSpecifierValue() === module &&
      exportDeclaration
        .getNamedExports()
        .some(
          (namedExport) =>
            namedExport.getName() === name &&
            namedExport.getAliasNode()?.getText() === alias
        )
  )

  if (!existingAlias) {
    sourceFile.addExportDeclaration({
      moduleSpecifier: module,
      namedExports: [
        {
          name: name,
          alias: alias,
        },
      ],
    })
  }
}
