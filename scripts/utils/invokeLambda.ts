import {
  InvokeCommand,
  InvokeCommandInput,
  LambdaClient,
} from '@aws-sdk/client-lambda'
import dotenv from 'dotenv'

dotenv.config()

const lambdaClient = new LambdaClient({
  region: process.env.OFFLINE_REGION,
  endpoint: `http://${process.env.OFFLINE_HOST}:${process.env.OFFLINE_LAMBDA_PORT}`,
})

export const invokeLambda = async (functionName: string, payload: any) => {
  const invokeCommandInput: InvokeCommandInput = {
    FunctionName: `${process.env.PROJECT_NAME}-offline-${functionName}`,
    Payload: payload,
  }
  const response = await lambdaClient.send(
    new InvokeCommand(invokeCommandInput)
  )
  console.log('Lambda Status:', response.StatusCode)
  const result = Buffer.from(response.Payload as Uint8Array).toString('utf-8')
  console.log('Lambda Response:\n', result)
}
