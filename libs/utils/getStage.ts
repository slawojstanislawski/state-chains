export const getStage = () => {
  if (process.env.STAGE) {
    return process.env.STAGE
  }
  const args = process.argv
  const stageIndex = args.indexOf('--stage')
  return stageIndex !== -1 ? args[stageIndex + 1] : 'dev'
}
