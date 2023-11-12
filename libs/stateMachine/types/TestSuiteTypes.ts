type TestCase<StateNameToOutputType, MockNames> = Partial<{
  [StateName in keyof StateNameToOutputType]: MockNames
}>

export type StateMachineTestCases<
  StateNameToOutputType,
  MockNames,
  TestName extends string = string
> = {
  TestCases: Record<TestName, TestCase<StateNameToOutputType, MockNames>>
}

type StateMachines<StateNameToOutputTypeForStateMachines, MockNames> = {
  [StateMachineName in keyof StateNameToOutputTypeForStateMachines]: StateMachineTestCases<
    StateNameToOutputTypeForStateMachines[StateMachineName],
    MockNames
  >
}

export type TestCasesConfig<StateNameToOutputTypeForStateMachines, MockNames> =
  {
    StateMachines: StateMachines<
      StateNameToOutputTypeForStateMachines,
      MockNames
    >
  }

export type MockedIntegration<
  StateNameToOutputType,
  StateName extends keyof StateNameToOutputType
> = {
  [
    key: `${number}` | `${number}-${number}`
  ]: // number or range of executions (0, 1-3, 4 etc.)
  | {
        Return: StateNameToOutputType[StateName]
      }
    | {
        Throw: any
      }
}

export type MockedServiceIntegrations<
  StateToResultMap,
  MockNames extends string
> = Partial<{
  [StateName in keyof StateToResultMap]: Partial<
    Record<MockNames, MockedIntegration<StateToResultMap, StateName>>
  >
}>

type MockedResponsesConfig<MockNames extends string> = {
  MockedResponses: Partial<Record<MockNames, any>>
}

export type TestSuite<
  StateNameToOutputTypeForStateMachines,
  MockNames extends string
> = TestCasesConfig<StateNameToOutputTypeForStateMachines, MockNames> &
  MockedResponsesConfig<MockNames>
