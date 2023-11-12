import dotenv from 'dotenv'

import { selectAndRunStateMachine } from './utils/selectAndRunStateMachine'

dotenv.config()

async function main() {
  await selectAndRunStateMachine('dev')
}

main()
