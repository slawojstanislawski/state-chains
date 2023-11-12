import { Choice, Fail, Succeed } from '../../../serverless.types'

export function isChoiceState(state: any): state is Choice {
  return state && state.Type === 'Choice'
}

export function isSucceedState(state: any): state is Succeed {
  return state && state.Type === 'Succeed'
}

export function isFailState(state: any): state is Fail {
  return state && state.Type === 'Fail'
}
