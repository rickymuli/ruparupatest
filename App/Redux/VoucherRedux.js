// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  userBankAccountRequest: null,
  userBankAccountSuccess: ['data'],
  userBankAccountFailure: ['err'],
  bankDataRequest: null,
  bankDataSuccess: ['data'],
  bankDataFailure: ['err'],
  refundOtpRequest: ['data'],
  refundOtpSuccess: ['data'],
  refundOtpFailure: ['err'],
  submitRefundRequest: ['data'],
  submitRefundSuccess: ['data'],
  submitRefundFailure: ['err'],
  setTempBankData: ['data'],
  initTempBankData: null,
  initCreateRefund: null
})

export const VoucherTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingBankAccount: false,
  fetchingBankData: false,
  fetchingOtp: false,
  fetchingCreateRefund: false,
  bankAccount: [],
  tempBankAccountData: null,
  bankData: [],
  otp: null,
  createRefund: null,
  errBankAccount: null,
  errBankData: null,
  errOtp: null,
  errCreateRefund: null
})

/* ------------- Reducers ------------- */
export const requestBankAccount = (state) => state.merge({
  fetchingBankAccount: true,
  errBankAccount: null
})

export const successBankAccount = (state, { data }) => state.merge({
  fetchingBankAccount: false,
  bankAccount: data
})

export const failureBankAccount = (state, { err }) => state.merge({
  fetchingBankAccount: false,
  errBankAccount: err
})

export const bankDataRequest = (state) => state.merge({
  fetchingBankData: true,
  errBankData: null
})

export const bankDataSuccess = (state, { data }) => state.merge({
  fetchingBankData: false,
  bankData: data
})

export const bankDataFailure = (state, { err }) => state.merge({
  fetchingBankData: false,
  errBankData: err
})

export const otpRequest = (state) => state.merge({
  fetchingOtp: true,
  errOtp: null
})

export const otpSuccess = (state) => state.merge({
  fetchingOtp: false,
  otp: 'success'
})

export const otpFailure = (state, { err }) => state.merge({
  fetchingOtp: false,
  errOtp: err
})

export const setTempBankData = (state, { data }) => state.merge({
  tempBankAccountData: data
})

export const initTempBankData = (state) => state.merge({
  tempBankAccountData: null,
  errCreateRefund: null
})

export const submitRefundRequest = (state) => state.merge({
  fetchingCreateRefund: true,
  errCreateRefund: null
})

export const submitRefundSuccess = (state, { data }) => state.merge({
  fetchingCreateRefund: false,
  createRefund: data
})

export const submitRefundFailure = (state, { err }) => state.merge({
  fetchingCreateRefund: false,
  errCreateRefund: err
})

export const initCreateRefund = (state) => state.merge({
  createRefund: null,
  errCreateRefund: null
})

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.USER_BANK_ACCOUNT_REQUEST]: requestBankAccount,
  [Types.USER_BANK_ACCOUNT_SUCCESS]: successBankAccount,
  [Types.USER_BANK_ACCOUNT_FAILURE]: failureBankAccount,
  [Types.BANK_DATA_REQUEST]: bankDataRequest,
  [Types.BANK_DATA_SUCCESS]: bankDataSuccess,
  [Types.BANK_DATA_FAILURE]: bankDataFailure,
  [Types.REFUND_OTP_REQUEST]: otpRequest,
  [Types.REFUND_OTP_SUCCESS]: otpSuccess,
  [Types.REFUND_OTP_FAILURE]: otpFailure,
  [Types.SUBMIT_REFUND_REQUEST]: submitRefundRequest,
  [Types.SUBMIT_REFUND_SUCCESS]: submitRefundSuccess,
  [Types.SUBMIT_REFUND_FAILURE]: submitRefundFailure,
  [Types.SET_TEMP_BANK_DATA]: setTempBankData,
  [Types.INIT_TEMP_BANK_DATA]: initTempBankData,
  [Types.INIT_CREATE_REFUND]: initCreateRefund
})
