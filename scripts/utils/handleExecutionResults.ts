import chalk from 'chalk'

import { ExecutionHistoryResults } from '../../libs/aws/stepfunctions/types/ExecutionHistoryResults.type'

export const handleExecutionResults = (
  res: ExecutionHistoryResults,
  name: string,
  succeeded: string[] = [],
  failed: string[] = []
) => {
  const logSuccessEvents = process.argv.includes('--logSuccessEvents')
  if (res.type === 'ExecutionSucceeded') {
    console.log(chalk.green(`${name} Succeeded!`))
    if (logSuccessEvents) {
      console.log(chalk.green(`Events:`))
      console.log(res.events)
    }
    succeeded.push(name)
    console.log(chalk.green(res.value))
  } else {
    console.log(chalk.red(`${name} Failed!`))
    console.log(chalk.red(`Events:`))
    console.log(res.events)
    failed.push(name)
    console.log(chalk.red(res.value))
  }
}
