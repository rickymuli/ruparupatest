// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* --- Types and Action Creators --- */

const { Types, Creators } = createActions({
  registerRequest: ['data'],
  registerSuccess: ['data', 'errors', 'messages'],
  registerFailure: ['err'],
  registerReset: null,
  registerAceRequest: ['data'],
  registerAceSuccess: ['data', 'errors', 'messages'],
  registerAceFailure: ['err']
})

export const RegisterTypes = Types
export default Creators

/* --- Initial State --- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  err: null,
  messages: null,
  navigation: null,
  aceSuccess: null
})

/* --- Reducers --- */

// We're attempting to register
export const request = (state: Object) => state.merge({
  fetching: true,
  err: null
})

export const aceRequest = (state: Object) => state.merge({
  fetching: true,
  err: null
})

// We've successfully register
export const success = (state: Object, { data, errors, messages }: Object) => state.merge({
  fetching: false,
  err: null
})

export const aceSuccess = (state: Object, { data, errors, messages }: Object) => state.merge({
  fetching: false,
  err: null,
  aceSuccess: data,
  navigation: 'MemberUpgrade'
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

export const aceFailure = (state: Object, { err }: any) => {
  return state.merge({
    fetching: false,
    err
  })
}

export const registerReset = (state: Object) => state.merge({
  fetching: false,
  err: null,
  navigation: null
})

/* --- Hookup Reducers to Types --- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.REGISTER_SUCCESS]: success,
  [Types.REGISTER_REQUEST]: request,
  [Types.REGISTER_FAILURE]: failure,
  [Types.REGISTER_RESET]: registerReset,
  [Types.REGISTER_ACE_SUCCESS]: aceSuccess,
  [Types.REGISTER_ACE_REQUEST]: aceRequest,
  [Types.REGISTER_ACE_FAILURE]: aceFailure
})
