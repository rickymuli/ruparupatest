import { baseListen, baseFetchToken, baseFetchNoToken } from './BaseSagas'
import VoucherActions, { VoucherTypes } from '../Redux/VoucherRedux'
import RefundValidator from '../Validations/Refund'
import { put } from 'redux-saga/effects'

export function * getBankAccount (api, getToken) {
  yield baseListen(VoucherTypes.USER_BANK_ACCOUNT_REQUEST,
    getBankAccountApi,
    api,
    getToken
  )
}

function * getBankAccountApi (api, getToken) {
  yield baseFetchToken(api.getBankAccount,
    {},
    getToken,
    VoucherActions.userBankAccountSuccess,
    VoucherActions.userBankAccountFailure)
}

export function * getBankData (api) {
  yield baseListen(VoucherTypes.BANK_DATA_REQUEST,
    getBankDataApi,
    api)
}

function * getBankDataApi (api) {
  yield baseFetchNoToken(api.getBank, {}, VoucherActions.bankDataSuccess, VoucherActions.bankDataFailure)
}

export function * getOtpRefund (api, getToken) {
  yield baseListen(VoucherTypes.REFUND_OTP_REQUEST,
    fetchOtpApi,
    api,
    getToken)
}

function * fetchOtpApi (api, getToken, data) {
  yield baseFetchToken(api.getOtpRefund,
    data,
    getToken,
    VoucherActions.refundOtpSuccess,
    VoucherActions.refundOtpFailure)
}

export function * createRefund (api, getToken) {
  yield baseListen(VoucherTypes.SUBMIT_REFUND_REQUEST,
    createRefundApi,
    api,
    getToken)
}

function * createRefundApi (api, getToken, data) {
  let hasError
  if (typeof data.data.otp === 'undefined') {
    hasError = RefundValidator.createRefundConstraints(data.data)
  } else {
    hasError = RefundValidator.createRefundWithOtpConstraints(data.data)
  }
  if (hasError) {
    return yield put(VoucherActions.submitRefundFailure(hasError))
  } else {
    yield baseFetchToken(api.postCreateRefund,
      data,
      getToken,
      VoucherActions.submitRefundSuccess,
      VoucherActions.submitRefundFailure)
  }
}
