import {
  Fail,
  State as AwsStateMachineState,
  States as AwsStateMachineDefinitionStates,
  Succeed,
  Map,
  Pass,
  Wait,
  Parallel,
  Choice,
  Task,
} from '../../../serverless.types'
import { createTemplateArn } from '../../aws/utils'
import { TaskToResourceMapType } from '../types/ResourceTypes'
import { State } from '../types/State.type'
import { isChoiceState, isFailState, isSucceedState } from './typeGuards'

export class StateChain<
  StateNames extends string,
  TaskToResourceMap extends TaskToResourceMapType<any>
> {
  public states: State[] = []

  constructor(protected readonly stateToResourceMap: TaskToResourceMap) {}

  public addState(stateName: StateNames, stateDetails: AwsStateMachineState) {
    if (stateDetails.Type === 'Task' && !stateDetails.ResultPath) {
      stateDetails.ResultPath = `$.${stateName}`
    }
    this.states.push({ stateName, stateDetails })
    return this
  }

  public addChoiceState(stateName: StateNames, state: Omit<Choice, 'Type'>) {
    const choiceState: Choice = {
      Type: 'Choice',
      ...state,
    }
    return this.addState(stateName, choiceState)
  }

  public addSucceedState(stateName: StateNames) {
    const succeedState: Succeed = {
      Type: 'Succeed',
    }
    return this.addState(stateName, succeedState)
  }

  public addFailState(stateName: StateNames, state: Omit<Fail, 'Type'>) {
    const failState: Fail = {
      Type: 'Fail',
      ...state,
    }
    return this.addState(stateName, failState)
  }

  public addMapState(stateName: StateNames, state: Omit<Map, 'Type'>) {
    const mapState: Map = {
      Type: 'Map',
      ...state,
    }
    return this.addState(stateName, mapState)
  }

  public addPassState(stateName: StateNames, state: Omit<Pass, 'Type'>) {
    const passState: Pass = {
      Type: 'Pass',
      ...state,
    }
    return this.addState(stateName, passState)
  }

  public addWaitState(stateName: StateNames, state: Omit<Wait, 'Type'>) {
    const waitState: AwsStateMachineState = {
      Type: 'Wait',
      ...state,
    }
    return this.addState(stateName, waitState)
  }

  public addTaskState(stateName: StateNames, state: Omit<Task, 'Type'>) {
    const taskState: AwsStateMachineState = {
      Type: 'Task',
      ...state,
    }
    return this.addState(stateName, taskState)
  }

  public addParallelState(
    stateName: StateNames,
    state: Omit<Parallel, 'Type'>
  ) {
    const parallelState: AwsStateMachineState = {
      Type: 'Parallel',
      ...state,
    }
    return this.addState(stateName, parallelState)
  }

  getStartingStateName(): string {
    return this.states?.[0]?.stateName || ''
  }

  build(): AwsStateMachineDefinitionStates {
    let stateMachineStates: AwsStateMachineDefinitionStates = {}

    this.states.forEach((state, index) => {
      const nextState = this.states[index + 1]
      // conveniently set the state' `Next` property to next state's key/name,
      // unless the state has 'Next' property or is of type Fail/Succeed/Choice,
      // or is the "End:true" state
      const { stateDetails, stateName } = state
      if (
        nextState &&
        !isChoiceState(stateDetails) &&
        !isSucceedState(stateDetails) &&
        !isFailState(stateDetails) &&
        !stateDetails.Next &&
        !stateDetails.End
      ) {
        stateDetails.Next = nextState.stateName
      }

      stateMachineStates[stateName] = stateDetails
    })

    return stateMachineStates
  }

  addChain(
    _description: string,
    chain: StateChain<StateNames, TaskToResourceMap>
  ) {
    this.states = this.states.concat(chain.states)
    return this
  }

  public getTaskToResourceMap() {
    const taskStates = this.states.filter((s) => {
      return s.stateDetails.Type === 'Task'
    })
    return taskStates.reduce((acc, currentValue) => {
      const taskStateName = currentValue.stateName
      const taskStateDefinition = currentValue.stateDetails as Task
      const taskResource = taskStateDefinition.Resource
      if (typeof taskResource === 'string') {
        return acc
      }
      const taskStateFunctionName = taskResource['Fn::GetAtt'][0]

      acc[taskStateName] = createTemplateArn(
        'lambda',
        `function:\${self:service}-offline-${taskStateFunctionName}`
      )
      return acc
    }, {})
  }
}
