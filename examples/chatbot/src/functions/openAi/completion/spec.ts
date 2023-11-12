import { LambdaStageConfig } from '@libs/aws/lambda'
import { StageConfigMap } from '@libs/aws/types'

export const config: StageConfigMap<LambdaStageConfig> = {
  default: {
    environment: {
      OPENAI_API_COMPLETION_URL: 'https://api.openai.com/v1/chat/completions',
    },
  },
}
