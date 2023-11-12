import { StageQualifiedName } from '../types'

export const toStageQualifiedName = (name: string): StageQualifiedName => {
  return `\${self:service}-\${sls:stage}-${name}` as const
}
