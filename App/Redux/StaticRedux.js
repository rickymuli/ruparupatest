// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  staticServer: ['data'],
  staticSuccess: ['payload'],
  staticFailure: ['err']
})

export const StaticTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  payload: null,
  err: null
})

/* ------------- Reducers ------------- */
// special for SSR
export const server = (state: Object, { category }: Object) =>
  state.merge({ fetching: true })

// we've successfully fetch data
export const success = (state: Object, { payload }: Object) =>
  state.merge({
    fetching: false,
    payload
  })

// we've had a problem fetch data
export const failure = (state: Object) =>
  state.merge({ fetching: false })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.STATIC_SERVER]: server,
  [Types.STATIC_SUCCESS]: success,
  [Types.STATIC_FAILURE]: failure
})
