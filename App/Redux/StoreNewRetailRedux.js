// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  storeNewRetailSuccess: ['data'],
  storeNewRetailFailure: ['err'],
  getStoreNewRetail: ['data'],
  setStoreNewRetail: ['data'],
  retrieveStoreNewRetail: ['data']
})

export const StoreNewRetailTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: false,
  err: null
})

/* ------------- Reducers ------------- */

export const set = (state, { data }) =>
  state.merge({ data })

export const get = (state) =>
  state.merge({ fetching: true, err: null })

export const success = (state, { data }) =>
  state.merge({ fetching: false, data })

export const failure = (state, { err }) =>
  state.merge({ fetching: false, err, data: null })

export const retrieve = (state) =>
  state.merge({ fetching: true, err: null })

export const reducer =
  createReducer(INITIAL_STATE, {
    [Types.GET_STORE_NEW_RETAIL]: get,
    [Types.SET_STORE_NEW_RETAIL]: set,
    [Types.RETRIEVE_STORE_NEW_RETAIL]: retrieve,
    [Types.STORE_NEW_RETAIL_SUCCESS]: success,
    [Types.STORE_NEW_RETAIL_FAILURE]: failure
  })
