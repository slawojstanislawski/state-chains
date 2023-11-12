import { SourceFile } from 'ts-morph'

/**
 * Adds a namespaced import to a given `sourceFile` if it doesn't already exist.
 *
 * @param sourceFile - The source file to which the namespaced import will be added.
 * @param namespaceImport - The desired namespace for the imported module contents.
 * @param moduleSpecifier - The module or path from which the contents are imported.
 *
 * @example
 * ```typescript

 * addNamespacedImport(source, 'MyNamespace', './myModule');
 * ```
 *
 * After executing the function, the import in the source file will look like:
 * ```typescript
 * import * as MyNamespace from './myModule';
 * ```
 *
 * Note: The function ensures no duplicates are added. If a matching namespaced import
 * already exists in the `sourceFile`, the content remains unchanged.
 */
export function addNamespacedImport(
  sourceFile: SourceFile,
  namespaceImport: string,
  moduleSpecifier: string
) {
  const existingImport = sourceFile
    .getImportDeclarations()
    .find(
      (importDeclaration) =>
        importDeclaration.getNamespaceImport()?.getText() === namespaceImport &&
        importDeclaration.getModuleSpecifierValue() === moduleSpecifier
    )
  if (existingImport) {
    return
  }
  sourceFile.addImportDeclaration({
    namespaceImport,
    moduleSpecifier,
  })
}
