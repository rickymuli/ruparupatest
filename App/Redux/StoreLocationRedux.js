// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  storeLocationRequest: ['data'],
  storeLocationSuccess: ['data'],
  storeLocationFailure: ['err']
})

export const StoreLocationTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  data: null,
  err: null
})

/* ------------- Reducers ------------- */

export const storeLocationRequest = (state = INITIAL_STATE) => state.merge({ fetching: true, err: null })

export const storeLocationSuccess = (state = INITIAL_STATE, { data }) => state.merge({ fetching: false, data, err: null })

export const storeLocationFailure = (state = INITIAL_STATE, { err }) => state.merge({ fetching: false, err })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.STORE_LOCATION_REQUEST]: storeLocationRequest,
  [Types.STORE_LOCATION_SUCCESS]: storeLocationSuccess,
  [Types.STORE_LOCATION_FAILURE]: storeLocationFailure
})
