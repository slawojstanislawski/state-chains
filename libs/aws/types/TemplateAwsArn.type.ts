type AccountId = string
type ResourceName = string

export type TemplateAwsArn<AwsServiceName extends string> =
  `arn:aws:${AwsServiceName}:\${aws:region}:${AccountId}:${ResourceName}`
