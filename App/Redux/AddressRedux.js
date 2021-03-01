// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  addressInit: null,
  addressResetSuccess: null,
  addressRequest: ['data'],
  addressOneRequest: ['data'],
  addressOneSuccess: ['payload'],
  addressSuccess: ['data'],
  addressCreateRequest: ['data'],
  addressCreateFailure: ['err'],
  addressCreateSuccess: ['data'],
  addressPrimaryRequest: ['data'],
  addressDeleteRequest: ['data'],
  addressServer: ['payload'],
  addressSelect: ['selected'],
  addressFailure: ['err']
})

export const AddressTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  payload: null,
  err: null,
  data: null,
  selected: null,
  success: false,
  addressCreateSuccess: false
})

/* ------------- Reducers ------------- */
// special for SSR
export const server = (state: Object, { payload }: Object) => state
// we're attempting to login
export const request = (state: Object) => state.merge({ fetching: true })

// we've successfully logged in
export const success = (state: Object, { data }: Object) =>
  state.merge({
    fetching: false,
    data
  })

export const oneSuccess = (state: Object, { payload }: Object) =>
  state.merge({
    fetching: false,
    payload
  })

export const createSuccess = (state: Object) =>
  state.merge({
    fetching: false,
    success: true,
    addressCreateSuccess: true
  })

export const init = (state: Object) =>
  state.merge({
    fetching: false,
    payload: null,
    err: null,
    data: null,
    selected: null,
    success: false
  })

export const resetSuccess = (state: Object) =>
  state.merge({
    fetching: false,
    err: null,
    success: false
  })

export const selectAddress = (state: Object, { selected }: Object) =>
  state.merge({
    selected
  })

// we've had a problem logging in
export const failure = (state: Object, { err }: any) =>
  state.merge({ fetching: false, success: false, err })

export const createFailure = (state: Object, { err }: any) =>
  state.merge({ fetching: false, err })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer =
  createReducer(INITIAL_STATE, {
    [Types.ADDRESS_INIT]: init,
    [Types.ADDRESS_RESET_SUCCESS]: resetSuccess,
    [Types.ADDRESS_SELECT]: selectAddress,
    [Types.ADDRESS_SUCCESS]: success,
    [Types.ADDRESS_SERVER]: server,
    [Types.ADDRESS_REQUEST]: request,
    [Types.ADDRESS_ONE_REQUEST]: request,
    [Types.ADDRESS_ONE_SUCCESS]: oneSuccess,
    [Types.ADDRESS_PRIMARY_REQUEST]: request,
    [Types.ADDRESS_DELETE_REQUEST]: request,
    [Types.ADDRESS_CREATE_REQUEST]: request,
    [Types.ADDRESS_CREATE_SUCCESS]: createSuccess,
    [Types.ADDRESS_CREATE_FAILURE]: createFailure,
    [Types.ADDRESS_FAILURE]: failure
  })
