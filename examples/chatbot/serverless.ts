import dotenv from 'dotenv'

import {
  CalendarAddQuickEvent,
  ContextResourcesToContextString,
  DdbBatchGetItem,
  DdbQuery,
  DdbScan,
  OpenAiCompletion,
  OpenAiEmbedding,
  OpenAiActionPrepare,
  OpenAiConversationPrepare,
  OpenAiIdentifyQueryCategoryPrepare,
  OpenAiResourceEnrichPrepare,
  OpenAiSystemMessageActionsPrepare,
  OpenAiSystemMessageMemoriesPrepare,
  PineconeQuery,
  PineconeUpsert,
  VectorSearchResultsProcess,
} from '@functions'
import { getRegion } from '@libs/utils/getRegion'
import { getStage } from '@libs/utils/getStage'
import {
  DdbTableResources,
  DdbTableConversation,
  DdbTableLatestConversationId,
  DdbTableActions,
  DdbTableContext,
} from '@resources/dynamodb'
import {
  Query,
  PopulateActions,
  ActionAddQuickEvent,
  ResourceVectorSave,
  ResourceTextSave,
} from '@stateMachines/machines'

import { CustomServerless } from './serverless.types'

dotenv.config()
const { env } = process

const stage = getStage()
const region = getRegion()

const serverlessConfiguration: CustomServerless = {
  service: env.PROJECT_NAME,
  frameworkVersion: '3',
  useDotenv: true,
  plugins: [
    'serverless-step-functions',
    'serverless-esbuild',
    'serverless-offline-lambda',
    'serverless-dynamodb-local',
    'serverless-offline-sns',
    'serverless-offline-sqs',
    'serverless-offline',
    'serverless-step-functions-local',
  ],
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      target: 'node18',
      exclude: ['aws-sdk'],
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    stepFunctionsLocal: {
      accountId: env.OFFLINE_ACCOUNT_ID,
      region: env.OFFLINE_REGION,
      externalInstance: true,
      TaskResourceMapping: {
        ...PopulateActions.stateChain.getTaskToResourceMap(),
        ...Query.stateChain.getTaskToResourceMap(),
        ...ResourceTextSave.stateChain.getTaskToResourceMap(),
        ...ResourceVectorSave.stateChain.getTaskToResourceMap(),
        ...ActionAddQuickEvent.stateChain.getTaskToResourceMap(),
      },
    },
    dynamodb: {
      stages: ['offline'],
      start: {
        docker: true,
        port: env.OFFLINE_DYNAMODB_PORT,
        inMemory: true,
        migrate: true,
        seed: true,
        convertEmptyValues: true,
        noStart: true,
      },
      seed: {
        standard: {
          sources: [
            {
              table: DdbTableResources.stageQualifiedName,
              sources: ['./seed/resources.json'],
            },
          ],
        },
      },
    },
    'serverless-offline-sns': {
      accountId: env.OFFLINE_ACCOUNT_ID,
      port: env.OFFLINE_SNS_PORT,
      debug: false,
      host: env.OFFLINE_HOST,
    },
    'serverless-offline-sqs': {
      autoCreate: true, // create queue if one doesn't exist
      apiVersion: '2012-11-05',
      endpoint: `http://0.0.0.0:${env.OFFLINE_SQS_PORT}`,
      region: env.OFFLINE_REGION,
      skipCacheInvalidation: false,
      debug: false,
    },
  },
  provider: {
    name: 'aws',
    region: region,
    runtime: 'nodejs18.x',
    timeout: 30,
    environment: {
      REGION: region,
      ACCOUNT_ID: env.ACCOUNT_ID,
      OFFLINE_ACCOUNT_ID: env.OFFLINE_ACCOUNT_ID,
      OFFLINE_HOST: env.OFFLINE_HOST,
      OFFLINE_SNS_PORT: env.OFFLINE_SNS_PORT,
      OFFLINE_SQS_PORT: env.OFFLINE_SQS_PORT,
      PROJECT_NAME: '${self:service}',
      STAGE: stage,
      PINECONE_INDEX_URL: 'ENTER_INDEX_URL',
      PINECONE_API_KEY: '${ssm:/pinecone/apikey}',
      OPENAI_API_KEY: '${ssm:/openai/apikey}',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:BatchGetItem',
            ],
            Resource: 'arn:aws:dynamodb:${aws:region}:${aws:accountId}:table/*',
          },
          {
            Effect: 'Allow',
            Action: ['sns:Publish'],
            Resource: 'arn:aws:sns:${aws:region}:${aws:accountId}:*',
          },
          {
            Effect: 'Allow',
            Action: ['sqs:SendMessage'],
            Resource: 'arn:aws:sqs:${aws:region}:${aws:accountId}:*',
          },
        ],
      },
    },
  },
  resources: {
    Resources: {
      [DdbTableConversation.resourceKey]: DdbTableConversation.spec,
      [DdbTableResources.resourceKey]: DdbTableResources.spec,
      [DdbTableLatestConversationId.resourceKey]:
        DdbTableLatestConversationId.spec,
      [DdbTableContext.resourceKey]: DdbTableContext.spec,
      [DdbTableActions.resourceKey]: DdbTableActions.spec,
    },
  },
  functions: {
    // misc
    [CalendarAddQuickEvent.name]: CalendarAddQuickEvent.spec,
    [VectorSearchResultsProcess.name]: VectorSearchResultsProcess.spec,
    [ContextResourcesToContextString.name]:
      ContextResourcesToContextString.spec,
    // dynamodb
    [DdbScan.name]: DdbScan.spec,
    [DdbBatchGetItem.name]: DdbBatchGetItem.spec,
    [DdbQuery.name]: DdbQuery.spec,
    // pinecone
    [PineconeQuery.name]: PineconeQuery.spec,
    [PineconeUpsert.name]: PineconeUpsert.spec,
    // openai prepare
    [OpenAiActionPrepare.name]: OpenAiActionPrepare.spec,
    [OpenAiConversationPrepare.name]: OpenAiConversationPrepare.spec,
    [OpenAiResourceEnrichPrepare.name]: OpenAiResourceEnrichPrepare.spec,
    [OpenAiIdentifyQueryCategoryPrepare.name]:
      OpenAiIdentifyQueryCategoryPrepare.spec,
    [OpenAiSystemMessageActionsPrepare.name]:
      OpenAiSystemMessageActionsPrepare.spec,
    [OpenAiSystemMessageMemoriesPrepare.name]:
      OpenAiSystemMessageMemoriesPrepare.spec,
    // openai
    [OpenAiCompletion.name]: OpenAiCompletion.spec,
    [OpenAiEmbedding.name]: OpenAiEmbedding.spec,
  },
  stepFunctions: {
    stateMachines: {
      [Query.name]: Query.spec,
      [ResourceTextSave.name]: ResourceTextSave.spec,
      [ResourceVectorSave.name]: ResourceVectorSave.spec,
      [ActionAddQuickEvent.name]: ActionAddQuickEvent.spec,
      [PopulateActions.name]: PopulateActions.spec,
    },
  },
}

module.exports = serverlessConfiguration
