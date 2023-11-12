import { SourceFile, ts } from 'ts-morph'

export function getVariableDeclaration(
  variableName: string,
  sourceFile: SourceFile
) {
  return sourceFile
    .getVariableDeclarationOrThrow(variableName)
    .getInitializerIfKindOrThrow(ts.SyntaxKind.ObjectLiteralExpression)
}
