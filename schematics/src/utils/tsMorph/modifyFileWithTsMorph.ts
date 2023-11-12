import { Rule, Tree } from '@angular-devkit/schematics'

export function modifyFileWithTsMorph<OptionsType>(
  morphFunction: (sourceCode: string, options: OptionsType) => string,
  filePath: string,
  options: OptionsType
): Rule {
  return (tree: Tree) => {
    const content = tree.read(filePath)?.toString()
    if (content) {
      const updatedContent = morphFunction(content, options)
      tree.overwrite(filePath, updatedContent)
    }
    return tree
  }
}
