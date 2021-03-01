// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  orderRequest: ['orderId', 'email'],
  orderSuccess: ['data'],
  orderFailure: ['err'],
  orderServer: ['orderId', 'email'],
  orderListRequest: null,
  orderListSuccess: ['payload'],
  orderListFailure: ['err'],
  orderInit: null,
  orderInitHideDiv: null,
  orderStatusUpdateRequest: ['data'],
  orderStatusUpdateSuccess: ['payload'],
  orderStatusUpdateFailure: ['err']
})

export const OrderTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  success: false,
  data: null,
  orderList: null,
  orderListErr: null,
  orderStatusUpdate: null,
  orderStatusErr: null,
  err: null
})

/* ------------- Reducers ------------- */
export const server = (state, { orderId }) => state

export const request = (state) => {
  return state.merge({
    fetching: true,
    success: false,
    orderStatusUpdate: null,
    err: null
  })
}

export const success = (state, { data }) => {
  return state.merge({
    fetching: false,
    success: true,
    data,
    err: null
  })
}

export const failure = (state, { err }) => state.merge({
  fetching: false,
  success: false,
  data: null,
  err
})

export const listRequest = (state) => {
  return state.merge({
    fetching: true,
    success: false,
    orderList: null,
    orderListErr: null
  })
}

export const listSuccess = (state, { payload }) => {
  return state.merge({
    fetching: false,
    success: true,
    orderList: payload,
    orderListErr: null
  })
}

export const listFailure = (state, { err }) => state.merge({
  fetching: false,
  success: false,
  orderList: null,
  orderListErr: err
})

export const statusUpdateRequest = (state) => {
  return state.merge({
    fetching: true,
    success: false,
    orderStatusErr: null
  })
}

export const statusUpdateSuccess = (state) => {
  return state.merge({
    fetching: false,
    success: true,
    orderStatusUpdate: 'Success',
    orderStatusErr: null
  })
}

export const statusUpdateFailure = (state, { err }) => state.merge({
  fetching: false,
  success: false,
  orderStatusUpdate: 'Failure',
  orderStatusErr: err
})

export const init = (state) => state.merge({
  fetching: false,
  success: false,
  data: null,
  orderList: null,
  orderListErr: null,
  err: null
})

export const initForHideDiv = (state) => state.merge({
  fetching: false,
  success: false,
  data: null,
  err: null
})

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ORDER_SUCCESS]: success,
  [Types.ORDER_REQUEST]: request,
  [Types.ORDER_FAILURE]: failure,
  [Types.ORDER_SERVER]: server,
  [Types.ORDER_LIST_REQUEST]: listRequest,
  [Types.ORDER_LIST_SUCCESS]: listSuccess,
  [Types.ORDER_LIST_FAILURE]: listFailure,
  [Types.ORDER_STATUS_UPDATE_REQUEST]: statusUpdateRequest,
  [Types.ORDER_STATUS_UPDATE_SUCCESS]: statusUpdateSuccess,
  [Types.ORDER_STATUS_UPDATE_FAILURE]: statusUpdateFailure,
  [Types.ORDER_INIT]: init,
  [Types.ORDER_INIT_HIDE_DIV]: initForHideDiv
})
