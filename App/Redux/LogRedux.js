// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

const { Types, Creators } = createActions({
  logCreateRequest: ['data'],
  logCreateFailure: ['err'],
  logCreateSuccess: ['data'],
  logUpdateSuccess: ['data'],
  popularSearchRequest: null,
  popularSearchFailure: ['err'],
  popularSearchSuccess: ['data']
})

export const LogTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  fetchingPopularSearch: false,
  err: null,
  success: false,
  data: null,
  popularSearch: null
})

/* ------------- Reducers ------------- */
// special for SSR
export const server = (state: Object, { payload }: Object) => state
// we're attempting to fetch
export const request = (state: Object) => state.merge({ fetching: true })

export const popularRequest = (state: Object) => state.merge({ fetchingPopularSearch: true })

export const logSuccess = (state: Object, { data }: Object) =>
  state.merge({
    fetching: false,
    success: true,
    data: data
  })

export const logUpdateSuccess = (state: Object, { data }: Object) =>
  state.merge({
    fetching: false,
    success: true
  })

export const popularSuccess = (state: Object, { data }: Object) =>
  state.merge({
    fetchingPopularSearch: false,
    popularSearch: data
  })

export const logFailure = (state: Object, { err }: Object) =>
  state.merge({
    fetching: false,
    err
  })

export const popularFailure = (state: Object, { err }: Object) =>
  state.merge({
    fetchingPopularSearch: false,
    err
  })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOG_CREATE_REQUEST]: request,
  [Types.LOG_CREATE_SUCCESS]: logSuccess,
  [Types.LOG_CREATE_FAILURE]: logFailure,
  [Types.LOG_UPDATE_SUCCESS]: logUpdateSuccess,
  [Types.POPULAR_SEARCH_REQUEST]: popularRequest,
  [Types.POPULAR_SEARCH_SUCCESS]: popularSuccess,
  [Types.POPULAR_SEARCH_FAILURE]: popularFailure
})
