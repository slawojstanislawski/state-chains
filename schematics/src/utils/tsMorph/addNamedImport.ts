import { SourceFile } from 'ts-morph'

/**
 * Adds a named import to an existing import declaration in a given `sourceFile`.
 * If no such import declaration exists, a new one will be created.
 *
 * @param sourceFile - The source file where the named import will be added or modified.
 * @param moduleName - The name of the module from which the named import originates.
 * @param importName - The specific named import to be added.
 *
 * @example
 * ```typescript
 * addNamedImport(source, './myModule', 'MyFunction');
 * ```
 *
 * If there's an existing import declaration:
 * ```typescript
 * import { AnotherFunction } from './myModule';
 * ```
 * After executing the function, it will be:
 * ```typescript
 * import { AnotherFunction, MyFunction } from './myModule';
 * ```
 *
 * If no such import declaration exists, it will add:
 * ```typescript
 * import { MyFunction } from './myModule';
 * ```
 *
 * Note: The function ensures no duplicate named imports are added. If a matching named import
 * is already present in the `sourceFile`, the content will remain unchanged.
 */
export function addNamedImport(
  sourceFile: SourceFile,
  moduleName: string,
  importName: string
) {
  // Try to find the import declaration for the specified module
  // let importDeclaration = sourceFile.getImportDeclaration('@resources/dynamodb')
  let importDeclaration = sourceFile.getImportDeclaration(moduleName)

  if (importDeclaration) {
    // If the import declaration exists, check if the named import exists
    const namedImports = importDeclaration.getNamedImports()
    const isImportAlreadyPresent = namedImports.some(
      (namedImport) => namedImport.getName() === importName
    )

    // Add the named import if it's not already present
    if (!isImportAlreadyPresent) {
      importDeclaration.addNamedImport(importName)
    }
  } else {
    // If the import declaration does not exist, add it
    sourceFile.addImportDeclaration({
      moduleSpecifier: moduleName,
      namedImports: [importName],
    })
  }
}
