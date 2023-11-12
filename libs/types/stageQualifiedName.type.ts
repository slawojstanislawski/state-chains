type ResourceName = string

export type StageQualifiedName =
  `\${self:service}-\${sls:stage}-${ResourceName}`
