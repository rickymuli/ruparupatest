import { call, put, fork } from 'redux-saga/effects'
import OtpActions, { OtpTypes } from '../Redux/OtpRedux'
import { fetchLoginAPI } from './AuthSagas'
import { baseListen } from './BaseSagas'
import get from 'lodash/get'
import GetLocalData from '../Services/GetLocalData'
import { trackCustomEvent } from '../Services/Smartlook'

// listen to action
export function * fetchCheckOtp (api) {
  yield baseListen(OtpTypes.OTP_CHECK_REQUEST,
    fetchCheckOtpAPI,
    api)
}
export function * fetchCheckOtpAPI (api, { data, dataTemp }) {
  let res = yield call(api.checkOtpAuth, data)
  trackCustomEvent('otp_saga_response', { name: 'fetchCheckOtp', res: JSON.stringify(res) })

  if (res.ok && !res.data.error) {
    const { getStoreNewRetailData, getCartId, getToken } = GetLocalData
    const { data: resData } = res.data
    if (['register', 'login', 'social-login'].includes(data.action)) {
      if (data.checkUpdatePhone && resData.is_used) return yield put(OtpActions.otpCheckFailure('Nomor/email sudah digunakan'))
      if (resData.is_used && !resData.is_expired && !resData.force_update) return yield fork(fetchLoginAPI, api, getToken, getCartId, { data: dataTemp }, getStoreNewRetailData)
      else if (!resData.is_used) {
        yield put(OtpActions.otpAddDataTemp({ isLogin: false }))
        yield put(OtpActions.otpChoicesSuccess({ 'types': [ 'chat', 'message' ] }))
      }
    } else if (!data.updatedValueEmailOrPhone) {
      let param = {
        verification_input: data.phone || data.email,
        action: data.action
      }
      yield fork(fetchChoicesOtpAPI, api, { data: param })
    }
    if (resData.customer_id) yield put(OtpActions.otpAddDataTemp({ customer_id: resData.customer_id }))
    yield put(OtpActions.otpCheckSuccess(res.data.data))
  } else {
    yield put(OtpActions.otpCheckFailure(get(res, 'data.message', 'Terjadi kesalahan koneksi')))
  }
}

export function * fetchChoicesOtp (api) {
  yield baseListen(OtpTypes.OTP_CHOICES_REQUEST,
    fetchChoicesOtpAPI,
    api)
}
export function * fetchChoicesOtpAPI (api, { data }) {
  let res = yield call(api.choicesOtp, data)
  trackCustomEvent('otp_saga_response', { name: 'fetchChoicesOtp', res: JSON.stringify(res) })

  if (res.ok && !res.data.error) {
    if (res.data.data.customer_id) yield put(OtpActions.otpAddDataTemp({ customer_id: res.data.data.customer_id }))
    yield put(OtpActions.otpChoicesSuccess(res.data.data))
  } else {
    yield put(OtpActions.otpChoicesFailure(get(res, 'data.message', 'Terjadi kesalahan koneksi')))
  }
}

export function * fetchGenerateOtp (api) {
  yield baseListen(OtpTypes.OTP_GENERATE_REQUEST,
    fetchGenerateOtpAPI,
    api)
}
export function * fetchGenerateOtpAPI (api, { data }) {
  let res = yield call(api.generateOtp, data)
  trackCustomEvent('otp_saga_response', { name: 'fetchGenerateOtp', res: JSON.stringify(res) })

  if (res.ok && !res.data.error) {
    yield put(OtpActions.otpGenerateSuccess(res.data.data))
  } else {
    yield put(OtpActions.otpGenerateFailure(get(res, 'data.message', 'Terjadi kesalahan koneksi')))
  }
}
export function * fetchValidateOtp (api) {
  yield baseListen(OtpTypes.OTP_VALIDATE_REQUEST,
    fetchValidateOtpAPI,
    api)
}
export function * fetchValidateOtpAPI (api, { data }) {
  let res = yield call(api.validateOtp, data)
  trackCustomEvent('otp_saga_response', { name: 'fetchValidateOtp', res: JSON.stringify(res) })

  if (res.ok && !res.data.error) {
    yield put(OtpActions.otpValidateSuccess(res.data.data))
  } else {
    yield put(OtpActions.otpValidateFailure(get(res, 'data.message', 'Terjadi kesalahan koneksi')))
  }
}
export function * fetchUpdatePhoneOtp (api) {
  yield baseListen(OtpTypes.OTP_UPDATE_PHONE_REQUEST,
    fetchUpdatePhoneOtpAPI,
    api)
}
export function * fetchUpdatePhoneOtpAPI (api, { data }) {
  let res = yield call(api.updatePhoneOtp, data)
  trackCustomEvent('otp_saga_response', { name: 'fetchUpdatePhoneOtp', res: JSON.stringify(res) })

  if (res.ok && !res.data.error) {
    yield put(OtpActions.otpUpdatePhoneSuccess(res.data.data))
  } else {
    yield put(OtpActions.otpUpdatePhoneFailure(get(res, 'data.message', 'Terjadi kesalahan koneksi')))
  }
}

export function * fetchForgotPasswordOtp (api) {
  yield baseListen(OtpTypes.OTP_FORGOT_PASSWORD_REQUEST,
    fetchForgotPasswordOtpAPI,
    api)
}
export function * fetchForgotPasswordOtpAPI (api, { data }) {
  let res = yield call(api.forgotPassword, data)
  trackCustomEvent('otp_saga_response', { name: 'fetchForgotPasswordOtp', res: JSON.stringify(res) })

  if (res.ok && !res.data.error) {
    yield put(OtpActions.otpForgotPasswordSuccess(res.data.data))
  } else {
    yield put(OtpActions.otpForgotPasswordFailure(get(res, 'data.message', 'Terjadi kesalahan koneksi')))
  }
}
export function * otpAce (api) {
  yield baseListen(OtpTypes.OTP_ACE_REQUEST,
    fetchOtpAce,
    api)
}
export function * fetchOtpAce (api, { data }) {
  let res = yield call(api.otpAce, data)
  trackCustomEvent('otp_saga_response', { name: 'otpAce', res: JSON.stringify(res) })

  if (res.ok && !res.data.error) {
    yield put(OtpActions.otpAceSuccess(res.data.data))
  } else {
    yield put(OtpActions.otpAceFailure(get(res, 'data.message', 'Terjadi kesalahan koneksi')))
  }
}
export function * validateOtpAce (api) {
  yield baseListen(OtpTypes.OTP_ACE_VALIDATE_REQUEST,
    validateOtpAceApi,
    api)
}
export function * validateOtpAceApi (api, { data }) {
  let res = yield call(api.validateOtpAce, data)
  trackCustomEvent('otp_saga_response', { name: 'validateOtpAce', res: JSON.stringify(res) })

  if (res.ok && !res.data.error) {
    yield put(OtpActions.otpAceValidateSuccess(res.data.data))
  } else {
    yield put(OtpActions.otpAceValidateFailure(get(res, 'data.message', 'Terjadi kesalahan koneksi')))
  }
}
export function * verifyPhoneAce (api) {
  yield baseListen(OtpTypes.OTP_VERIFY_PHONE_REQUEST,
    verifyPhoneAceApi,
    api)
}
export function * verifyPhoneAceApi (api, { data }) {
  let res = yield call(api.verifyPhoneAce, data)
  trackCustomEvent('otp_saga_response', { name: 'verifyPhoneAce', res: JSON.stringify(res) })

  if (res.ok && !res.data.error) {
    yield put(OtpActions.otpVerifyPhoneSuccess(res.data.data))
  } else {
    yield put(OtpActions.otpVerifyPhoneFailure(get(res, 'data.message', 'Terjadi kesalahan koneksi')))
  }
}
