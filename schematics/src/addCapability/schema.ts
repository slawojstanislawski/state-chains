export interface Schema {
  /**
   * Names of the AWS capabilities supported by the library
   */
  names: string
  /**
   * Name of the state machine to add the capability to
   */
  stateMachine: string
}
