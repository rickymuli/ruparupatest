import { baseListen, baseFetchNoToken } from './BaseSagas'
import ReturnRefundActions, { ReturnRefundTypes } from '../Redux/ReturnRefundRedux'

export function * getOrderData (api) {
  yield baseListen(ReturnRefundTypes.ORDER_DATA_REQUEST, getOrderDataApi, api)
}

function * getOrderDataApi (api, { orderNo, email }) {
  yield baseFetchNoToken(api.getOrderDataForReturn, { orderNo, email }, ReturnRefundActions.orderDataSuccess, ReturnRefundActions.orderDataFailure)
}

export function * getUserAddress (api) {
  yield baseListen(ReturnRefundTypes.USER_ADDRESS_REQUEST, getUserAddressApi, api)
}

function * getUserAddressApi (api, { customerToken }) {
  yield baseFetchNoToken(api.getAddressDetail, customerToken, ReturnRefundActions.userAddressSuccess, ReturnRefundActions.userAddressFailure)
}

export function * getReasonDatas (api) {
  yield baseListen(ReturnRefundTypes.GET_REASON_DATA_REQUEST, getReasonDatasApi, api)
}

function * getReasonDatasApi (api) {
  yield baseFetchNoToken(api.getReasons, null, ReturnRefundActions.getReasonDataSuccess, ReturnRefundActions.getReasonDataFailure)
}

export function * getReturnMethods (api) {
  yield baseListen(ReturnRefundTypes.RETURN_METHOD_REQUEST, getReturnMethodsApi, api)
}

function * getReturnMethodsApi (api) {
  yield baseFetchNoToken(api.getReturnMethod, null, ReturnRefundActions.returnMethodSuccess, ReturnRefundActions.returnMethodFailure)
}

export function * uploadImageRequest (api) {
  yield baseListen(ReturnRefundTypes.UPLOAD_IMAGE_REQUEST, uploadImageRequestApi, api)
}

function * uploadImageRequestApi (api, { image }) {
  yield baseFetchNoToken(api.uploadImage, image, ReturnRefundActions.uploadImageSuccess, ReturnRefundActions.uploadImageFailure)
}

export function * getEstimationRequest (api) {
  yield baseListen(ReturnRefundTypes.GET_ESTIMATION_REQUEST, getEstimationRequestApi, api)
}

function * getEstimationRequestApi (api, { data }) {
  yield baseFetchNoToken(api.getEstimatedRefundPrice, data, ReturnRefundActions.getEstimationSuccess, ReturnRefundActions.getEstimationFailure)
}

export function * submitReturnRequest (api) {
  yield baseListen(ReturnRefundTypes.SUBMIT_RETURN_REFUND_REQUEST, submitReturnRequestApi, api)
}

function * submitReturnRequestApi (api, { data }) {
  yield baseFetchNoToken(api.submitReturnRefund, data, ReturnRefundActions.submitReturnRefundSuccess, ReturnRefundActions.submitReturnRefundFailure)
}

export function * getReturnStatus (api) {
  yield baseListen(ReturnRefundTypes.USER_STATUS_RETURN_REQUEST, getReturnStatusApi, api)
}

function * getReturnStatusApi (api, { orderNo, email }) {
  yield baseFetchNoToken(api.getStatusReturn, { orderNo, email }, ReturnRefundActions.userStatusReturnSuccess, ReturnRefundActions.userStatusReturnFailure)
}

export function * editRefundRequest (api) {
  yield baseListen(ReturnRefundTypes.EDIT_REFUND_REQUEST, editRefundRequestApi, api)
}

function * editRefundRequestApi (api, { data }) {
  yield baseFetchNoToken(api.editReturn, { data }, ReturnRefundActions.editRefundSuccess, ReturnRefundActions.editRefundFailure)
}
