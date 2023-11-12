import { ArrayLiteralExpression } from 'ts-morph'

export function addToArray(
  arrayLiteral: ArrayLiteralExpression,
  whatToAdd: string
) {
  if (arrayLiteral) {
    arrayLiteral.insertElements(arrayLiteral.getElements().length, [whatToAdd])
  }
}
