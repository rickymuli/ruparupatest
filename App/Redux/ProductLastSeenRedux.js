// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  productLastSeenRequest: null,
  productLastSeenSuccess: ['data'],
  productLastSeenFailure: ['err'],
  productLastSeenUpdateRequest: ['item']
})

export const ProductLastSeenTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  data: null,
  err: null
})

/* ------------- Reducers ------------- */
// special for SSR
// export const server = (state: Object, { data }: Object) => state
// we're attempting to login
export const request = (state: Object) => state.merge({ fetching: true, err: null })

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

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.PRODUCT_LAST_SEEN_SUCCESS]: success,
  [Types.PRODUCT_LAST_SEEN_REQUEST]: request,
  [Types.PRODUCT_LAST_SEEN_FAILURE]: failure,
  [Types.PRODUCT_LAST_SEEN_UPDATE_REQUEST]: request
})
