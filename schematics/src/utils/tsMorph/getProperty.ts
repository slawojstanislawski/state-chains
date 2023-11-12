import path from 'path'
import {
  ObjectLiteralExpression,
  ArrayLiteralExpression,
  SyntaxKind,
  Node,
} from 'ts-morph'

function getPropertyOrArray(
  variable: ObjectLiteralExpression,
  pathSegments: string[]
): Node | undefined {
  return pathSegments.reduce<Node | undefined>((previousValue, pathPart) => {
    if (!previousValue) return undefined

    const property = (previousValue as ObjectLiteralExpression).getProperty(
      pathPart
    )

    if (!property || !Node.isPropertyAssignment(property)) return undefined

    const initializer = property.getInitializer()

    if (!initializer) return undefined

    if (initializer.getKind() === SyntaxKind.ObjectLiteralExpression) {
      return initializer as ObjectLiteralExpression
    }

    if (initializer.getKind() === SyntaxKind.ArrayLiteralExpression) {
      return initializer as ArrayLiteralExpression
    }

    return undefined
  }, variable)
}

export function getObjectAtPath(
  variable: ObjectLiteralExpression,
  pathSegments: string[]
): ObjectLiteralExpression {
  const node = getPropertyOrArray(variable, pathSegments)
  if (Node.isObjectLiteralExpression(node)) {
    return node
  } else {
    throw new Error(`No object found at path ${path.join(...pathSegments)}`)
  }
}

export function getArrayAtPath(
  variable: ObjectLiteralExpression,
  pathSegments: string[]
): ArrayLiteralExpression {
  const node = getPropertyOrArray(variable, pathSegments)
  if (Node.isArrayLiteralExpression(node)) {
    return node
  } else {
    throw new Error(`No array found at path ${path.join(...pathSegments)}`)
  }
}
