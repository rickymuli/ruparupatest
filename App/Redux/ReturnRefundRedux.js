// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* --- Types and Action Creators --- */

const { Types, Creators } = createActions({
  userAddressRequest: ['customerToken'],
  userAddressSuccess: ['data'],
  userAddressFailure: ['err'],
  orderDataRequest: ['orderNo', 'email'],
  orderDataSuccess: ['data'],
  orderDataFailure: ['err'],
  getReasonDataRequest: null,
  getReasonDataSuccess: ['data'],
  getReasonDataFailure: ['err'],
  uploadImageRequest: ['image'],
  uploadImageSuccess: ['imageData'],
  uploadImageFailure: ['err'],
  returnMethodRequest: null,
  returnMethodSuccess: ['data'],
  returnMethodFailure: ['err'],
  getEstimationRequest: ['data'],
  getEstimationSuccess: ['data'],
  getEstimationFailure: ['err'],
  submitReturnRefundRequest: ['data'],
  submitReturnRefundFailure: ['err'],
  submitReturnRefundSuccess: ['data'],
  userStatusReturnRequest: ['orderNo', 'email'],
  userStatusReturnSuccess: ['data'],
  userStatusReturnFailure: ['err'],
  editRefundRequest: ['data'],
  editRefundSuccess: null,
  editRefundFailure: ['err'],
  resetResult: null,
  initReturnRefundData: null,
  initEstimationData: null,
  initEditRefund: null
})

export const ReturnRefundTypes = Types
export default Creators

/* --- Initial State --- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  fetchingAddress: false,
  fetchingReason: false,
  fetchingUploadImage: false,
  fetchingReturnMethod: false,
  fetchingEstimation: false,
  fetchingResult: false,
  fetchingStatusReturn: false,
  fetchingEditRefund: false,
  address: null,
  data: null,
  result: null,
  customerEmail: '',
  reasons: null,
  imageData: null,
  returnMethod: null,
  estimationData: [],
  statusReturn: null,
  successEdit: false,
  err: null,
  errAddress: null,
  errReason: null,
  errUploadImage: null,
  errReturnMethod: null,
  errEstimation: null,
  errResult: null,
  errStatusReturn: null,
  errEditRefund: null
})

/* --- Reducers --- */

export const request = (state, { orderNo, email }) => state.merge({
  fetching: true,
  customerEmail: email,
  err: null
})

export const requestAddress = (state) => state.merge({
  fetchingAddress: true,
  address: null
})

export const success = (state, { data }) => state.merge({
  fetching: false,
  data
})

export const successAddress = (state, { data }) => state.merge({
  fetchingAddress: false,
  address: data
})

export const failure = (state, { err }) => {
  return state.merge({
    fetching: false,
    err
  })
}

export const addressFailure = (state, { err }) => state.merge({
  fetchingAddress: false,
  errAddress: err
})

export const reasonRequest = (state) => state.merge({
  fetchingReason: true,
  reasons: null
})

export const reasonSuccess = (state, { data }) => state.merge({
  reasons: data,
  fetchingReason: false
})

export const reasonFailure = (state, { err }) => state.merge({
  errReason: err,
  fetchingReason: false
})

export const uploadImageRequest = (state) => state.merge({
  fetchingUploadImage: true,
  errUploadImage: null
})

export const uploadImageSuccess = (state, { imageData }) => state.merge({
  imageData,
  fetchingUploadImage: false
})

export const uploadImageFailure = (state, { err }) => state.merge({
  fetchingUploadImage: false,
  errUploadImage: err
})

export const returnMethodRequest = (state) => state.merge({
  fetchingReturnMethod: true,
  errReturnMethod: null
})

export const returnMethodSuccess = (state, { data }) => state.merge({
  fetchingReturnMethod: false,
  returnMethod: data
})

export const returnMethodFailure = (state, { err }) => state.merge({
  fetchingReturnMethod: false,
  errReturnMethod: err
})

export const estimationRequest = (state) => state.merge({
  fetchingEstimation: true,
  errEstimation: null
})

export const estimationSuccess = (state, { data }) => state.merge({
  fetchingEstimation: false,
  estimationData: data
})

export const estimationFailure = (state, { err }) => state.merge({
  fetchingEstimation: false,
  errEstimation: err
})

export const submitRequest = (state) => state.merge({
  fetchingResult: true,
  errResult: null
})

export const submitSuccess = (state, { data }) => state.merge({
  fetchingResult: false,
  result: data
})

export const submitFailure = (state, { err }) => state.merge({
  fetchingResult: false,
  errResult: err
})

export const resetResult = (state) => state.merge({
  result: null,
  errResult: null
})

export const initData = (state) => state.merge({
  data: null,
  err: null
})

export const userStatusReturnRequest = (state) => state.merge({
  fetchingStatusReturn: true,
  errStatusReturn: null
})

export const userStatusReturnSuccess = (state, { data }) => state.merge({
  fetchingStatusReturn: false,
  statusReturn: data.return_refund || null
})

export const userStatusReturnFailure = (state, { err }) => state.merge({
  errStatusReturn: err,
  fetchingStatusReturn: false
})

export const initEstimation = (state) => state.merge({
  estimationData: null,
  errEstimation: null
})

export const editRefundRequest = (state) => state.merge({
  fetchingEditRefund: true,
  errEditRefund: null
})

export const editRefundSuccess = (state) => state.merge({
  fetchingEditRefund: false,
  successEdit: true
})

export const editRefundFailure = (state, { err }) => state.merge({
  fetchingEditRefund: false,
  errEditRefund: err
})

export const initEditRefund = (state) => state.merge({
  errEditRefund: null,
  successEdit: false
})

/* --- Hookup Reducers to Types --- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.ORDER_DATA_SUCCESS]: success,
  [Types.ORDER_DATA_REQUEST]: request,
  [Types.ORDER_DATA_FAILURE]: failure,
  [Types.USER_ADDRESS_REQUEST]: requestAddress,
  [Types.USER_ADDRESS_SUCCESS]: successAddress,
  [Types.USER_ADDRESS_FAILURE]: addressFailure,
  [Types.GET_REASON_DATA_REQUEST]: reasonRequest,
  [Types.GET_REASON_DATA_SUCCESS]: reasonSuccess,
  [Types.GET_REASON_DATA_FAILURE]: reasonFailure,
  [Types.UPLOAD_IMAGE_REQUEST]: uploadImageRequest,
  [Types.UPLOAD_IMAGE_SUCCESS]: uploadImageSuccess,
  [Types.UPLOAD_IMAGE_FAILURE]: uploadImageFailure,
  [Types.RETURN_METHOD_REQUEST]: returnMethodRequest,
  [Types.RETURN_METHOD_SUCCESS]: returnMethodSuccess,
  [Types.RETURN_METHOD_FAILURE]: returnMethodFailure,
  [Types.GET_ESTIMATION_REQUEST]: estimationRequest,
  [Types.GET_ESTIMATION_FAILURE]: estimationFailure,
  [Types.GET_ESTIMATION_SUCCESS]: estimationSuccess,
  [Types.SUBMIT_RETURN_REFUND_REQUEST]: submitRequest,
  [Types.SUBMIT_RETURN_REFUND_SUCCESS]: submitSuccess,
  [Types.SUBMIT_RETURN_REFUND_FAILURE]: submitFailure,
  [Types.USER_STATUS_RETURN_REQUEST]: userStatusReturnRequest,
  [Types.USER_STATUS_RETURN_SUCCESS]: userStatusReturnSuccess,
  [Types.USER_STATUS_RETURN_FAILURE]: userStatusReturnFailure,
  [Types.EDIT_REFUND_REQUEST]: editRefundRequest,
  [Types.EDIT_REFUND_SUCCESS]: editRefundSuccess,
  [Types.EDIT_REFUND_FAILURE]: editRefundFailure,
  [Types.RESET_RESULT]: resetResult,
  [Types.INIT_RETURN_REFUND_DATA]: initData,
  [Types.INIT_ESTIMATION_DATA]: initEstimation,
  [Types.INIT_EDIT_REFUND]: initEditRefund
})
