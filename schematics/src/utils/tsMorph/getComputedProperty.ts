import { ObjectLiteralExpression } from 'ts-morph'

export function getComputedProperty(
  objLiteralExpression: ObjectLiteralExpression,
  computedPropertyText: string
) {
  for (const property of objLiteralExpression.getProperties()) {
    if (property.getText().includes(computedPropertyText)) {
      return property
    }
  }

  throw new Error(`Computed property ${computedPropertyText} not found.`)
}
