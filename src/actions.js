import * as types from './constants'

export function setSelectedTab (data) {
  return {
    type: types.RECEIVE_SELECTED_TAB,
    data
  }
}