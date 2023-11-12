import dotenv from 'dotenv'

import { Dummy, SqsPublisher, SqsSubscriber } from '@functions'
import { getRegion } from '@libs/utils/getRegion'
import { getStage } from '@libs/utils/getStage'
import { SqsQueueSuper } from '@resources/sqs'
import { SqsPubSub } from '@stateMachines/machines'

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
        ...SqsPubSub.stateChain.getTaskToResourceMap(),
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
          sources: [],
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
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SUPER_QUEUE_ARN: SqsQueueSuper.arn,
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
      [SqsQueueSuper.name]: SqsQueueSuper.spec,
    },
  },
  functions: {
    [Dummy.name]: Dummy.spec,
    [SqsPublisher.name]: SqsPublisher.spec,
    [SqsSubscriber.name]: SqsSubscriber.spec,
  },
  stepFunctions: {
    stateMachines: {
      [SqsPubSub.name]: SqsPubSub.spec,
    },
  },
}

module.exports = serverlessConfiguration
