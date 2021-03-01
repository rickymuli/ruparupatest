// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  reorderInvoiceRequest: ['data'],
  reorderInvoiceSuccess: ['data'],
  reorderInvoiceFailure: ['err'],
  confirmationRequest: ['data'],
  confirmationSuccess: ['data'],
  confirmationFailure: ['err'],
  confirmationDeliveryRequest: ['data'],
  confirmationDeliverySuccess: ['data'],
  confirmationDeliveryFailure: ['err'],
  reorderInit: null,
  reorderCartInit: null

})

export const ReorderTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  data: null,
  err: null,
  successConfirmation: false,
  successDelivery: false
})

/* ------------- Reducers ------------- */
export const reorderInit = (state) =>
  state.merge({
    data: null,
    err: null,
    successConfirmation: false,
    successDelivery: false
  })

export const reorderCartInit = (state) =>
  state.merge({
    cartData: null
  })

// get invoice detail
export const reorderInvoiceRequest = (state) =>
  state.merge({ fetching: true })

export const reorderInvoiceSuccess = (state, { data }) =>
  state.merge({
    fetching: false,
    err: null,
    data,
    success: true,
    successConfirmation: false
  })

export const reorderInvoiceFailure = (state, { err }) =>
  state.merge({ fetching: false, err })

export const confirmationRequest = (state) =>
  state.merge({ fetching: true })

export const confirmationSuccess = (state, { data }) =>
  state.merge({
    fetching: false,
    err: null,
    confirmationData: data,
    success: true,
    successConfirmation: true
  })

export const confirmationFailure = (state, { err }) =>
  state.merge({ fetching: false, err })

export const confirmationDeliveryRequest = (state) =>
  state.merge({ fetching: true })

export const confirmationDeliverySuccess = (state, { data }) =>
  state.merge({
    fetching: false,
    err: null,
    cartData: data,
    success: true,
    successDelivery: true
  })

export const confirmationDeliveryFailure = (state, { err }) =>
  state.merge({ fetching: false, err, successDelivery: false })
/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.REORDER_INVOICE_REQUEST]: reorderInvoiceRequest,
  [Types.REORDER_INVOICE_SUCCESS]: reorderInvoiceSuccess,
  [Types.REORDER_INVOICE_FAILURE]: reorderInvoiceFailure,
  [Types.CONFIRMATION_REQUEST]: confirmationRequest,
  [Types.CONFIRMATION_SUCCESS]: confirmationSuccess,
  [Types.CONFIRMATION_FAILURE]: confirmationFailure,
  [Types.CONFIRMATION_DELIVERY_REQUEST]: confirmationDeliveryRequest,
  [Types.CONFIRMATION_DELIVERY_SUCCESS]: confirmationDeliverySuccess,
  [Types.CONFIRMATION_DELIVERY_FAILURE]: confirmationDeliveryFailure,
  [Types.REORDER_INIT]: reorderInit,
  [Types.REORDER_CART_INIT]: reorderCartInit

})
