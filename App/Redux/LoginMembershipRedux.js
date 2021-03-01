// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* --- Types and Action Creators --- */

const { Types, Creators } = createActions({
  loginMemberRequest: ['data'],
  loginMemberSuccess: ['data', 'errors', 'messages'],
  loginMemberFailure: ['err'],
  loginMemberReset: null
})

export const LoginMemberTypes = Types
export default Creators

/* --- Initial State --- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  err: null,
  messages: null,
  data: null
  // retrieveSuccess: false,
  // navigation: null
})

/* --- Reducers --- */

// We're attempting to register
export const request = (state: Object, { data }) => state.merge({
  fetching: true,
  err: null
  // navigation: data
})

// We've successfully register
export const success = (state: Object, { data, errors, messages }: Object) => state.merge({
  fetching: false,
  err: null,
  data: data
  // navigation: null
})

// we've had a problem register
// Possible errors:
// * email is already registered
// err shoud be an instance of Error class
// nevermind, seamless-immutable cannot handle Error object
// Only display the message err.message

export const failure = (state: Object, { err }: any) => {
  return state.merge({
    fetching: false,
    err
  })
}

export const loginMemberReset = (state: Object) => state.merge({
  fetching: false,
  err: null
  // navigation: null
})

/* --- Hookup Reducers to Types --- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOGIN_MEMBER_SUCCESS]: success,
  [Types.LOGIN_MEMBER_REQUEST]: request,
  [Types.LOGIN_MEMBER_FAILURE]: failure,
  [Types.LOGIN_MEMBER_RESET]: loginMemberReset
})
