import { classify } from '@angular-devkit/core/src/utils/strings'
import dotenv from 'dotenv'

dotenv.config()

export const toStageQualifiedLogicalId = (name: string) => {
  return `${classify(
    process.env.PROJECT_NAME
  )}Dash\${sls:stage}Dash${name}` as const
}
