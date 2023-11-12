import { SourceFile } from 'ts-morph'

/**
 * Adds a named export to an existing export block in a given `sourceFile`.
 * If no export block exists, it will create a new one.
 *
 * @param sourceFile - The source file in which the named export will be added or modified.
 * @param name - The name of the export to be added to the export block.
 *
 * @example
 * ```typescript
 * addToExportBlock(source, 'MyFunction');
 * ```
 *
 * If there's an existing export block:
 * ```typescript
 * export { SomeExport };
 * ```
 * After executing the function, it will look like:
 * ```typescript
 * export { SomeExport, MyFunction };
 * ```
 *
 * If there's no existing export block, it will add:
 * ```typescript
 * export { MyFunction };
 * ```
 *
 * Note: This function intelligently chooses between adding to an existing block or
 * creating a new one based on the current structure of the source file.
 */
export function addToExportBlock(sourceFile: SourceFile, name: string) {
  let exportDecl = sourceFile
    .getExportDeclarations()
    .find((decl) => decl.hasNamedExports()) // Removed the check for decl.getNamedExports().length === 0

  if (exportDecl) {
    // adds to the existing 'export { ... }'
    exportDecl.addNamedExport({
      name,
    })
  } else {
    // If there's no 'export { ... }', add a new one with the name
    sourceFile.addExportDeclaration({
      namedExports: [name],
    })
  }
}
