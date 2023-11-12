import { Project, ObjectLiteralExpression, ts } from 'ts-morph'

import { getComputedProperty } from './getComputedProperty'

describe('getComputedProperty', () => {
  let project: Project
  let objLiteralExpression: ObjectLiteralExpression

  beforeEach(() => {
    project = new Project()
    const sourceFile = project.createSourceFile(
      'test.ts',
      `const obj = { 'key1': 'value1', 'key2': 'value2' };`
    )
    objLiteralExpression = sourceFile.getFirstDescendantByKindOrThrow(
      ts.SyntaxKind.ObjectLiteralExpression
    )
  })

  it('should return the computed property if it exists', () => {
    const computedProperty = getComputedProperty(
      objLiteralExpression,
      "'key1': 'value1'"
    )
    expect(computedProperty.getText()).toBe("'key1': 'value1'")
  })

  it('should throw an error if the computed property does not exist', () => {
    expect(() =>
      getComputedProperty(objLiteralExpression, "'key3': 'value3'")
    ).toThrowError("Computed property 'key3': 'value3' not found.")
  })
})
