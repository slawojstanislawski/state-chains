import { Region } from '../../../serverless.types'

type AccountId = string
type ResourceName = string

export type AwsArn<AwsServiceName extends string> =
  `arn:aws:${AwsServiceName}:${Region}:${AccountId}:${ResourceName}`
