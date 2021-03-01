// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  retrieveMembership: ['membership', 'user'],
  membershipFailure: ['err'],
  membershipSuccess: ['data'],
  membershipInit: null,
  membershipReset: null
})

export const MembershipTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  err: null,
  data: null
})

/* ------------- Reducers ------------- */

// we've successfully fetched
export const failure = (state, { err }) =>
  state.merge({ fetching: false, err, data: null })

export const retrieve = (state) =>
  state.merge({ fetching: true, err: null })

export const success = (state, { data }) =>
  state.merge({ fetching: false, data })

export const init = (state: Object) => state.merge({ fetching: false, err: null })

export const reset = (state: Object) => state.merge({ fetching: false, err: null, data: null })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.MEMBERSHIP_FAILURE]: failure,
  [Types.MEMBERSHIP_SUCCESS]: success,
  [Types.RETRIEVE_MEMBERSHIP]: retrieve,
  [Types.MEMBERSHIP_INIT]: init,
  [Types.MEMBERSHIP_RESET]: reset
})
