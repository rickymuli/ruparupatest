// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  cartInit: null,
  cartPaymentRequest: ['data'],
  cartRequest: ['data', 'callback'],
  cartTypeRequest: ['data'],
  TypeRequest: ['data'],
  cartSuccess: ['data'],
  cartServer: ['data'],
  cartFailure: ['err'],
  cartCreateRequest: ['data'],
  cartCreateSuccess: ['data'],
  cartCreateFailure: ['err'],
  cartUpdateRequest: ['data'],
  cartUpdateSuccess: null,
  cartUpdateFailure: ['err'],
  cartDeleteItemRequest: ['data'],
  cartDeleteItemSuccess: null,
  cartDeleteItemFailure: ['err'],
  cartDeleteRequest: null,
  cartDeleteSuccess: null
})

export const CartTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  data: null,
  err: null
})

/* ------------- Reducers ------------- */
// special for SSR
export const server = (state: Object, { data }: Object) => state

export const init = (state: Object) => {
  return state.merge({
    fetching: false,
    success: false,
    err: null,
    data: null
  })
}

export const request = (state: Object) => {
  return state.merge({
    fetching: true,
    success: false,
    err: null
  })
}

export const cartTypeRequest = (state: Object) => state

export const success = (state, { data }) => {
  return state.merge({
    fetching: false,
    success: true,
    err: null,
    data
  })
}

export const failure = (state, { err }) => state.merge({
  fetching: false,
  success: false,
  err
})

export const createSuccess = (state: Object) => {
  return state.merge({
    fetching: false,
    success: true
  })
}

export const createFailure = (state: Object, { err }: Object) => {
  return state.merge({
    fetching: false,
    success: false,
    err
  })
}

export const updateSuccess = (state: Object) => {
  return state.merge({
    fetching: false,
    err: null,
    success: true
  })
}

export const updateFailure = (state: Object, { err }: Object) => {
  return state.merge({
    fetching: false,
    success: false,
    err
  })
}

export const deleteItemSuccess = (state: Object) => {
  return state.merge({
    fetching: false,
    err: null,
    success: true
  })
}

export const deleteItemFailure = (state: Object, { err }: Object) => {
  return state.merge({
    fetching: false,
    success: false,
    err
  })
}

export const deleteSuccess = (state: Object) => {
  return state.merge({
    fetching: false,
    err: null,
    success: true,
    data: null
  })
}

export const reducer =
  createReducer(INITIAL_STATE, {
    [Types.CART_INIT]: init,
    [Types.CART_PAYMENT_REQUEST]: request,
    [Types.CART_REQUEST]: request,
    [Types.CART_TYPE_REQUEST]: cartTypeRequest,
    [Types.CART_SUCCESS]: success,
    [Types.CART_FAILURE]: failure,
    [Types.CART_SERVER]: server,
    [Types.CART_CREATE_REQUEST]: request,
    [Types.CART_CREATE_SUCCESS]: createSuccess,
    [Types.CART_CREATE_FAILURE]: createFailure,
    [Types.CART_UPDATE_REQUEST]: request,
    [Types.CART_UPDATE_SUCCESS]: updateSuccess,
    [Types.CART_UPDATE_FAILURE]: updateFailure,
    [Types.CART_DELETE_ITEM_REQUEST]: request,
    [Types.CART_DELETE_ITEM_SUCCESS]: deleteItemSuccess,
    [Types.CART_DELETE_ITEM_FAILURE]: deleteItemFailure,
    [Types.CART_DELETE_REQUEST]: request,
    [Types.CART_DELETE_SUCCESS]: deleteSuccess
  }
  )
