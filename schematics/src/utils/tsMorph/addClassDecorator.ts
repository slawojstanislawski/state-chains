import { SourceFile } from 'ts-morph'

export const addClassDecorator = (
  sourceFile: SourceFile,
  className: string,
  decoratorName: string,
  decoratorArgs: string[]
) => {
  const myClass = sourceFile.getClass(className)
  if (myClass) {
    // Check if the same decorator with the same arguments already exists
    const existingDecorators = myClass.getDecorators()
    const sameDecoratorExists = existingDecorators.some((decorator) => {
      const decoratorArguments = decorator
        .getArguments()
        .map((arg) => arg.getText())
      return (
        decorator.getName() === decoratorName &&
        JSON.stringify(decoratorArguments) === JSON.stringify(decoratorArgs)
      )
    })

    if (sameDecoratorExists) {
      // Same decorator with the same arguments already exists, so return without adding it
      return
    }

    // Add a decorator to the class
    myClass.addDecorator({
      name: decoratorName,
      arguments: decoratorArgs,
    })
  }
}
