// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  searchHistoryRequest: null,
  searchHistorySuccess: ['data'],
  searchHistoryFailure: null,
  saveSearchHistoryRequest: ['data'],
  saveSearchHistorySuccess: null,
  saveSearchHistoryFailure: null
})

export const SearchHistoryTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  prevState: null,
  data: null,
  saving: false
})

/* ------------- Reducers ------------- */
export const request = (state) => state.merge({ fetching: true, data: null })

export const saveRequest = (state) => state.merge({ saving: true })

export const success = (state, { data }) =>
  state.merge({
    fetching: false,
    data
  })

export const saveSuccess = (state) => state.merge({ saving: false })

export const failure = (state) =>
  state.merge({ fetching: false })

export const saveFailure = (state) =>
  state.merge({ saving: false })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.SEARCH_HISTORY_SUCCESS]: success,
  [Types.SEARCH_HISTORY_REQUEST]: request,
  [Types.SEARCH_HISTORY_FAILURE]: failure,
  [Types.SAVE_SEARCH_HISTORY_REQUEST]: saveRequest,
  [Types.SAVE_SEARCH_HISTORY_SUCCESS]: saveSuccess,
  [Types.SAVE_SEARCH_HISTORY_FAILURE]: saveFailure
})
