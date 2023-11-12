import { TemplateAwsArn } from '../types'

export function getResourceNameFromArn(arn: TemplateAwsArn<any>): string {
  const fragments = arn.split(':')
  return fragments[fragments.length - 1]
}
