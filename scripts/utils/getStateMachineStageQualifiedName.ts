import dotenv from 'dotenv'

dotenv.config()
export const getStateMachineStageQualifiedName = (
  stateMachineName: string,
  stage: string
) => {
  return `${process.env.PROJECT_NAME}-${stage}-${stateMachineName}`
}
