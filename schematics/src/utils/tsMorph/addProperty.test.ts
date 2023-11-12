import { Project, ObjectLiteralExpression, SyntaxKind } from 'ts-morph'

import { addProperty } from './addProperty'

describe('addProperty', () => {
  let project: Project
  let node: ObjectLiteralExpression

  beforeEach(() => {
    project = new Project()
    const sourceFile = project.createSourceFile('test.ts', 'const obj = {}')
    node = sourceFile.getFirstDescendantByKindOrThrow(
      SyntaxKind.ObjectLiteralExpression
    )
  })

  it('should add the property when it does not exist', () => {
    addProperty(node, 'name', '"John"')
    const property = node.getProperty('name')
    expect(property).toBeDefined()
    expect(property!.getText()).toBe('name: "John"')
  })

  it('should not add the property when it already exists', () => {
    node.addPropertyAssignment({
      name: 'name',
      initializer: '"Doe"',
    })
    addProperty(node, 'name', '"John"') // Attempting to add the same property again
    const properties = node.getProperties()
    expect(properties.length).toBe(1) // Only one property should exist
    expect(properties[0].getText()).toBe('name: "Doe"') // The original property should remain unchanged
  })
})
