import { classify } from '@angular-devkit/core/src/utils/strings'
import { Rule, chain } from '@angular-devkit/schematics'
import path from 'path'

import {
  modifyFileWithTsMorph,
  addNamedImport,
  addTypeToTupleType,
  addClassDecorator,
} from '../utils'
import { createNewProject } from '../utils'
import { Schema as AddCapabilityOptions } from './schema'
import { getCapabilityNames } from './utils/getCapabilityNames'

process.chdir(path.join(__dirname, '../../../'))

export const addCapability = (options: AddCapabilityOptions): Rule => {
  const { stateMachine } = options

  return chain([
    modifyFileWithTsMorph(
      modifyQueryChainFileTsMorph,
      `./src/stateMachines/machines/${stateMachine}/${stateMachine}.createChain.ts`,
      options
    ),
  ])
}

function modifyQueryChainFileTsMorph(
  sourceCode: string,
  options: AddCapabilityOptions
): string {
  const project = createNewProject()
  const sourceFile = project.createSourceFile('temp.ts', sourceCode)

  const capabilityNames = getCapabilityNames()
  const names = options.names.replace(/\s/g, '').split(',').filter(Boolean)

  // Validate all provided capability names
  names.forEach((capability) => {
    if (!capabilityNames.includes(capability.toLowerCase())) {
      throw new Error(
        `Capability ${capability} not available. Available capabilities: ${capabilityNames.join(
          ', '
        )}.`
      )
    }
  })

  // Iterate through the capability names and make the necessary modifications
  names
    .map((name) => name.toLowerCase())
    .forEach((capability) => {
      const ucFirstCapabilityName = classify(capability)

      // 1. Add the Capability import to the file
      addNamedImport(
        sourceFile,
        `@libs/aws/${capability}`,
        `${ucFirstCapabilityName}Capability`
      )

      // 2. Add Capability type for the capability to the CapabilityTypes type array
      const capabilityTypes = sourceFile.getTypeAliasOrThrow('CapabilityTypes')
      const capabilityName = `${ucFirstCapabilityName}Capability`
      addTypeToTupleType(
        capabilityTypes,
        `${capabilityName}<StateName, TaskToResourceMap>`
      )

      const ucFirstStateMachineName = classify(options.stateMachine)

      // 3. add @Capability decorator
      addClassDecorator(
        sourceFile,
        `${ucFirstStateMachineName}Chain`,
        'Capability',
        [capabilityName]
      )
    })

  return sourceFile.getFullText()
}
