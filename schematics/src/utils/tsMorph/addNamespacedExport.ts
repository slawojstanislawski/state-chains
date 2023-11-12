import { SourceFile } from 'ts-morph'

/**
 * Adds a namespaced export to a given `sourceFile` if it doesn't already exist.
 *
 * @param sourceFile - The source file to which the namespaced export will be appended.
 * @param namespaceExport - The desired namespace for the exported module contents.
 * @param moduleSpecifier - The module or path from which the contents are being exported.
 *
 * @example
 * ```typescript

 * addNamespacedExport(source, 'ExportedNamespace', './anotherModule');
 * ```
 *
 * After executing the function, the export in the source file will appear as:
 * ```typescript
 * export * as ExportedNamespace from './anotherModule';
 * ```
 *
 * Note: The function takes care to avoid duplicate entries. If a matching namespaced export
 * already resides in the `sourceFile`, no changes will be made.
 */
export function addNamespacedExport(
  sourceFile: SourceFile,
  namespaceExport: string,
  moduleSpecifier: string
) {
  const existingExport = sourceFile
    .getExportDeclarations()
    .find(
      (exportDeclaration) =>
        exportDeclaration.getNamespaceExport()?.getName() === namespaceExport &&
        exportDeclaration.getModuleSpecifierValue() === moduleSpecifier
    )
  if (existingExport) {
    return
  }
  sourceFile.addExportDeclaration({
    namespaceExport,
    moduleSpecifier,
  })
}
