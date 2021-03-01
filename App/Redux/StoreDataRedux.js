// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  storeDataRequest: ['data'],
  storeDataFailure: ['err'],
  storeDataSuccess: ['data'],
  removeStoreData: null,
  checkStoreData: null,
  saveStoreData: ['data']
})

export const StoreDataTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: false,
  err: null
})

/* ------------- Reducers ------------- */
export const save = (state, { data }) =>
  state.merge({ data })

export const remove = (state) =>
  state.merge({
    data: null
  })

export const check = (state) =>
  state.merge({ data: null })

export const storeDataRequest = (state) =>
  state.merge({ fetching: true, err: null })

export const storeDataSuccess = (state, { data }) =>
  state.merge({ fetching: false, data })

export const storeDataFailure = (state, { err }) =>
  state.merge({ fetching: false, err })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.SAVE_STORE_DATA]: save,
  [Types.REMOVE_STORE_DATA]: remove,
  [Types.CHECK_STORE_DATA]: check,
  [Types.STORE_DATA_REQUEST]: storeDataRequest,
  [Types.STORE_DATA_SUCCESS]: storeDataSuccess,
  [Types.STORE_DATA_FAILURE]: storeDataFailure

})
