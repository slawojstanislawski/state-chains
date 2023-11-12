import path from 'path'
import { ObjectLiteralExpression, Node, SourceFile } from 'ts-morph'
import { Project } from 'ts-morph'

import { getArrayAtPath, getObjectAtPath } from './getProperty'

const getObject = (sourceFile: SourceFile) => {
  return sourceFile
    .getVariableDeclarationOrThrow('obj')
    .getInitializerOrThrow() as ObjectLiteralExpression
}

describe('getObjectAtPath', () => {
  let project: Project
  let sourceFile: SourceFile

  beforeEach(() => {
    project = new Project()
    sourceFile = project.createSourceFile(
      'temp.ts',
      `
    const obj = {
      a: {
        b: {
          c: {}
        }
      }
    };
    `
    )
  })

  it('should return object at given path', () => {
    const obj = getObject(sourceFile)
    const result = getObjectAtPath(obj, ['a', 'b', 'c'])
    expect(Node.isObjectLiteralExpression(result)).toBe(true)
    expect(result.getText()).toBe('{}')
  })

  it('should throw error if no object found at given path', () => {
    const obj = getObject(sourceFile)
    expect(() => getObjectAtPath(obj, ['a', 'b', 'x'])).toThrowError(
      `No object found at path ${path.join('a', 'b', 'x')}`
    )
  })

  afterEach(() => {
    project.removeSourceFile(sourceFile)
  })
})

describe('getArrayAtPath', () => {
  let project: Project
  let sourceFile: SourceFile

  beforeEach(() => {
    project = new Project()
    sourceFile = project.createSourceFile(
      'temp.ts',
      `
    const obj = {
      a: {
        b: {
          c: []
        }
      }
    };
    `
    )
  })

  it('should return array at given path', () => {
    const obj = getObject(sourceFile)
    const result = getArrayAtPath(obj, ['a', 'b', 'c'])
    expect(Node.isArrayLiteralExpression(result)).toBe(true)
    expect(result.getText()).toBe('[]')
  })

  it('should throw error if no array found at given path', () => {
    const obj = getObject(sourceFile)
    expect(() => getArrayAtPath(obj, ['a', 'b', 'x'])).toThrowError(
      `No array found at path ${path.join('a', 'b', 'x')}`
    )
  })

  afterEach(() => {
    project.removeSourceFile(sourceFile)
  })
})
