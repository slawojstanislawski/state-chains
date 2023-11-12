import type { AWS } from '@serverless/typescript'

export interface CustomServerless extends AWS {
  stepFunctions: {
    stateMachines: StateMachines
    validate?: boolean
  }
}
export type Region = CustomServerless['provider']['region']

export type StateMachine = {
  id: string
  name: string
  definition: Definition
  tracingConfig?: TracingConfig
}

type StateMachines = {
  [stateMachine: string]: StateMachine
}

type TracingConfig = {
  enabled: boolean
}

type Definition = {
  Comment?: string
  StartAt: string
  States: States
  TimeoutSeconds?: number
}

export type State =
  | Choice
  | Fail
  | Map
  | Task
  | Parallel
  | Pass
  | Wait
  | Succeed

export type States = Partial<Record<string, State>>
type StateBaseNew = {
  Comment?: string
}

type StateCommonProps = {
  Next?: string
  End?: boolean
  InputPath?: string
  OutputPath?: string
}

type ActionStateCommonProps = {
  Catch?: Catcher[]
  Retry?: Retrier[]
  ResultPath?: string
  ResultSelector?: { [key: string]: string | { [key: string]: string } }
}

type ChoiceRuleComparison = {
  Variable: string
  BooleanEquals?: boolean
  BooleanEqualsPath?: string
  IsBoolean?: boolean
  IsNull?: boolean
  IsNumeric?: boolean
  IsPresent?: boolean
  IsString?: boolean
  IsTimestamp?: boolean
  NumericEquals?: number
  NumericEqualsPath?: string
  NumericGreaterThan?: number
  NumericGreaterThanPath?: string
  NumericGreaterThanEquals?: number
  NumericGreaterThanEqualsPath?: string
  NumericLessThan?: number
  NumericLessThanPath?: string
  NumericLessThanEquals?: number
  NumericLessThanEqualsPath?: string
  StringEquals?: string
  StringEqualsPath?: string
  StringGreaterThan?: string
  StringGreaterThanPath?: string
  StringGreaterThanEquals?: string
  StringGreaterThanEqualsPath?: string
  StringLessThan?: string
  StringLessThanPath?: string
  StringLessThanEquals?: string
  StringLessThanEqualsPath?: string
  StringMatches?: string
  TimestampEquals?: string
  TimestampEqualsPath?: string
  TimestampGreaterThan?: string
  TimestampGreaterThanPath?: string
  TimestampGreaterThanEquals?: string
  TimestampGreaterThanEqualsPath?: string
  TimestampLessThan?: string
  TimestampLessThanPath?: string
  TimestampLessThanEquals?: string
  TimestampLessThanEqualsPath?: string
}

type ChoiceRuleNot = {
  Not: ChoiceRuleComparison
  Next: string
}

type ChoiceRuleAnd = {
  And: ChoiceRuleComparison[]
  Next: string
}

type ChoiceRuleOr = {
  Or: ChoiceRuleComparison[]
  Next: string
}

type ChoiceRuleSimple = ChoiceRuleComparison & {
  Next: string
}

type ChoiceRule =
  | ChoiceRuleSimple
  | ChoiceRuleNot
  | ChoiceRuleAnd
  | ChoiceRuleOr

export type Choice = StateBaseNew &
  Omit<StateCommonProps, 'End' | 'Next'> & {
    Type: 'Choice'
    Choices: ChoiceRule[]
    Default?: string
  }

export type Fail = StateBaseNew & {
  Type: 'Fail'
  Cause?: string
  Error?: string
}

export type Succeed = {
  Type: 'Succeed'
}

export type Map = StateBaseNew &
  StateCommonProps &
  ActionStateCommonProps & {
    Type: 'Map'
    // ItemProcessor usage results in 'InvalidDefinition' error even in Docker image version 1.3
    ItemProcessor?: {
      ProcessorConfig?: {
        // 'DISTRIBUTED' mode not supported in SF Local
        Mode: 'INLINE'
        // ExecutionType not supported in SF Local
        // ExecutionType?: 'STANDARD' | 'EXPRESS'
      }
      StartAt: string
      States: States
    }
    Iterator?: Definition //legacy, but have to keep, SF local doesn't support ItemProcessor
    ItemsPath?: string
    ItemSelector?: object
    MaxConcurrency?: number
  }

type Resource =
  | string
  | { 'Fn::GetAtt': [string, 'Arn'] }
  | { 'Fn::Join': [string, Resource[]] }

export type Task = StateBaseNew &
  StateCommonProps &
  ActionStateCommonProps & {
    Type: 'Task'
    Resource: Resource
    Parameters?: { [key: string]: any }
    Credentials?: any
    TimeoutSeconds?: number
    TimeoutSecondsPath?: string
    HeartbeatSeconds?: number
    HeartbeatSecondsPath?: string
  }

export type Pass = StateBaseNew &
  StateCommonProps &
  Pick<ActionStateCommonProps, 'ResultPath'> & {
    Result?: any
    Type: 'Pass'
    Parameters?: {
      [key: string]: string | Array<unknown> | { [key: string]: string }
    }
  }

export type Parallel = StateBaseNew &
  StateCommonProps &
  ActionStateCommonProps & {
    Type: 'Parallel'
    Branches: Definition[]
  }

export type Wait = StateBaseNew &
  StateCommonProps & {
    Type: 'Wait'
    Seconds?: number
    Timestamp?: string
    SecondsPath?: string
    TimestampPath?: string
  }

type Catcher = {
  ErrorEquals: ErrorName[]
  Next: string
  ResultPath?: string
}

type Retrier = {
  ErrorEquals: string[]
  IntervalSeconds?: number
  MaxAttempts?: number
  BackoffRate?: number
}

type ErrorName =
  | 'States.ALL'
  | 'States.DataLimitExceeded'
  | 'States.Runtime'
  | 'States.Timeout'
  | 'States.TaskFailed'
  | 'States.Permissions'
  | string
