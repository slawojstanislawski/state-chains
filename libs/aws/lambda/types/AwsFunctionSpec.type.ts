import { AWS } from '@serverless/typescript'

/**
 * Represents the specification of an AWS function as defined
 * in TypeScript definitions for Serverless Framework.
 */
export type AwsFunctionSpec = AWS['functions'][string]
