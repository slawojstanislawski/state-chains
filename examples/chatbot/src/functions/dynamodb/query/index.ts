import {
  AwsFunctionSpec,
  handlerPath,
  getStageSpecificConfig,
} from '@libs/aws/lambda'

export { handler } from './handler'
export const spec: AwsFunctionSpec = {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  ...getStageSpecificConfig(__dirname),
}
export const name = 'dynamodbQuery'
