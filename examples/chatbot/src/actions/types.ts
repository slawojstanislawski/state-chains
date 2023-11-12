export type ActionStateMachineArn = {
  'Fn::GetAtt': [string, 'Arn']
}

export type ActionDefinition = {
  id: `action-${string}`
  title: string
  description: string
  stateMachineArn: ActionStateMachineArn
}
