// import Immutable from 'immutable'
import * as types from './constants'
import initialState from './initialState'

export function reducer (state = initialState, action) {
  switch (action.type) {
    case types.RECEIVE_SELECTED_TAB:
      state = state.setIn(['selectedAlgorithm'], action.data)

      break
    default:
  }

  return state
}