// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  filterRequest: ['category', 'keyword', 'isRuleBased', 'categoryId', 'storeCode', 'companyCode'],
  filterSuccess: ['data'],
  filterFailure: ['err'],
  filterInit: null
})

export const NavigationFilterTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  data: null,
  err: null
})

/* ------------- Reducers ------------- */
// we're attempting to login
export const request = (state, data) => state.merge({ fetching: true, err: null, data: null })

// we've successfully logged in
export const success = (state: Object, { data }: Object) =>
  state.merge({
    fetching: false,
    data,
    err: null
  })

// we've had a problem logging in
export const failure = (state: Object, { err }: Object) =>
  state.merge({ fetching: false, err })

// init states
export const init = (state) =>
  state.merge({ fetching: false, data: null, err: null })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.FILTER_SUCCESS]: success,
  [Types.FILTER_REQUEST]: request,
  [Types.FILTER_FAILURE]: failure,
  [Types.FILTER_INIT]: init
})
