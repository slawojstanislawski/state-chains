import { getStateMachineNames } from './utils/getStateMachineNames'

const fs = require('fs')

const stateMachineNames = getStateMachineNames()

fs.writeFileSync(
  './schematics/src/stateMachineNames.json',
  JSON.stringify(stateMachineNames)
)
