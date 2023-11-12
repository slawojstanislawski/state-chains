import { ObjectLiteralExpression } from 'ts-morph'

export function addProperty(
  node: ObjectLiteralExpression,
  name: string,
  value: string
) {
  const existingProperty = node.getProperty(name)
  if (existingProperty) {
    return
  }
  node.addPropertyAssignment({
    name,
    initializer: value,
  })
}
