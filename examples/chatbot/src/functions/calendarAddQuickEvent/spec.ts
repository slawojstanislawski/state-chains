import { LambdaStageConfig } from '@libs/aws/lambda'
import { StageConfigMap } from '@libs/aws/types'

export const config: StageConfigMap<LambdaStageConfig> = {
  default: {
    environment: {
      OAUTH_CLIENT_ID: '${ssm:/googleapis/calendar/client_id}',
      OAUTH_CLIENT_SECRET: '${ssm:/googleapis/calendar/client_secret}',
      OAUTH_CLIENT_REFRESH_TOKEN: '${ssm:/googleapis/calendar/refreshtoken}',
    },
  },
}
