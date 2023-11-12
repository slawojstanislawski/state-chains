import { writeFile } from 'fs'
import path from 'path'

import { TestSuite } from '../../../libs/stateMachine'

export const creteMockFileJson = (
  config: TestSuite<any, any>,
  skipSuccessLog = false
) => {
  writeFile(
    path.join(
      process.cwd(),
      'src',
      'stateMachines',
      'tests',
      'tmp',
      'MockConfigFile.json'
    ),
    JSON.stringify(config, null, 2),
    (err) => {
      if (err) {
        throw err
      } else if (!skipSuccessLog) {
        console.log('✔ Test suite configuration written to MockConfigFile\n')
      }
    }
  )
}
