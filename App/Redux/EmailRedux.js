// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  emailB2bRequest: ['data'],
  emailB2bFailure: ['err'],
  emailB2bSuccess: null
})

export const EmailTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  err: null,
  success: false
})

/* ------------- Reducers ------------- */
// we're attempting to fetch
export const request = (state: Object) => state.merge({ fetching: true })

export const success = (state: Object) =>
  state.merge({
    fetching: false,
    success: true,
    err: null
  })

export const failure = (state: Object, { err }: Object) =>
  state.merge({
    fetching: false,
    success: false,
    err
  })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.EMAIL_B2B_REQUEST]: request,
  [Types.EMAIL_B2B_SUCCESS]: success,
  [Types.EMAIL_B2B_FAILURE]: failure
})
