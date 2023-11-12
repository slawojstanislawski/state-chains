import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing'

export const runSchematic = async (
  runner: SchematicTestRunner,
  appTree: UnitTestTree,
  schematicName: string,
  options: object
) => {
  return runner.runSchematic(schematicName, options, appTree)
}
