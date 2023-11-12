import { TypeAliasDeclaration, ts, TupleTypeNode } from 'ts-morph'

export function addTypeToTupleType(
  typeAlias: TypeAliasDeclaration,
  newTypeName: string
) {
  const typeNode = typeAlias.getTypeNodeOrThrow()

  if (typeNode.getKind() === ts.SyntaxKind.TupleType) {
    const tupleTypeNode = typeNode as TupleTypeNode

    const existingTypes = tupleTypeNode
      .getElements()
      .map((typeNode) => typeNode.getText())
    if (existingTypes.includes(newTypeName)) {
      return
    }

    const openParenthesisPos = tupleTypeNode.getStart() + 1 // Assuming the tuple starts with an open parenthesis
    tupleTypeNode
      .getSourceFile()
      .insertText(openParenthesisPos, `${newTypeName}, `)
  }
}
