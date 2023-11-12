import { Project, SourceFile } from 'ts-morph'

import { addClassDecorator } from './addClassDecorator'

describe('addClassDecorator', () => {
  let project: Project
  let sourceFile: SourceFile

  beforeEach(() => {
    project = new Project()
    sourceFile = project.createSourceFile('test.ts', 'class MyClass {}')
  })

  it('should add the decorator to the class when it does not exist', () => {
    addClassDecorator(sourceFile, 'MyClass', 'MyDecorator', ['arg1', 'arg2'])
    expect(sourceFile.getText()).toBe(
      '@MyDecorator(arg1, arg2)\nclass MyClass {}'
    )
  })

  it('should not add the decorator to the class when the same decorator with the same arguments already exists', () => {
    addClassDecorator(sourceFile, 'MyClass', 'MyDecorator', ['arg1', 'arg2'])
    addClassDecorator(sourceFile, 'MyClass', 'MyDecorator', ['arg1', 'arg2'])
    expect(sourceFile.getText()).toBe(
      '@MyDecorator(arg1, arg2)\nclass MyClass {}'
    )
  })

  it('should add the decorator to the class when the same decorator with different arguments already exists', () => {
    addClassDecorator(sourceFile, 'MyClass', 'MyDecorator', ['arg1', 'arg2'])
    addClassDecorator(sourceFile, 'MyClass', 'MyDecorator', ['arg3', 'arg4'])
    expect(sourceFile.getText()).toBe(
      '@MyDecorator(arg1, arg2)\n@MyDecorator(arg3, arg4)\nclass MyClass {}'
    )
  })

  it('should add the decorator to the class when a different decorator already exists', () => {
    addClassDecorator(sourceFile, 'MyClass', 'AnotherDecorator', [
      'arg1',
      'arg2',
    ])
    addClassDecorator(sourceFile, 'MyClass', 'MyDecorator', ['arg1', 'arg2'])
    expect(sourceFile.getText()).toBe(
      '@AnotherDecorator(arg1, arg2)\n@MyDecorator(arg1, arg2)\nclass MyClass {}'
    )
  })
})
