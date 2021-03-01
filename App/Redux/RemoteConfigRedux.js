// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* --- Types and Action Creators --- */
const { Types, Creators } = createActions({
  RemoteConfigSetup: ['data'],
  RemoteConfigReset: null
})

export const RemoteConfigTypes = Types
export default Creators

/* --- Initial State --- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  err: null,
  data: null
})

/* --- Reducers --- */

// We're attempting to register
export const setup = (state: Object, { data }: Object) => state.merge({
  fetching: false,
  err: null,
  data
})

export const init = (state: Object) => state.merge({
  fetching: false,
  err: null,
  data: null
})

/* --- Hookup Reducers to Types --- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.REMOTE_CONFIG_SETUP]: setup,
  [Types.REMOTE_CONFIG_RESET]: init
})
