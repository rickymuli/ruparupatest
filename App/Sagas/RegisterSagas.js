import { put, call, fork } from 'redux-saga/effects'
import RegisterActions, { RegisterTypes } from '../Redux/RegisterRedux'
import AuthActions from '../Redux/AuthRedux'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import LoginMemberActions, { LoginMembershipTypes } from '../Redux/LoginMembershipRedux'
import { baseListen } from './BaseSagas'
import messaging from '@react-native-firebase/messaging'

import config from '../../config'
import DeviceInfo from 'react-native-device-info'
import { setFreshchatUser } from '../Services/Freshchat'
import { fetchSetDeviceTokenAPI } from './AuthSagas'
// import { trackCustomEvent } from '../Services/Smartlook'
import analytics from '@react-native-firebase/analytics'
// import { SetOnceUserMixPanel, Identify, Track, registerPropertiesOnce } from '../Services/MixPanel'
// import _ from 'lodash'
// attempts to register
export function * register (api, getCartId, getStoreNewRetailData) {
  yield baseListen(RegisterTypes.REGISTER_REQUEST,
    fetchRegisterAPI,
    api,
    getCartId,
    getStoreNewRetailData)
}

export function * fetchRegisterAPI (api, getCartId, { data }, getStoreNewRetailData) {
  const token = yield messaging().getToken()
  const uniqueId = yield DeviceInfo.getUniqueId()
  const cartId = yield call(getCartId)
  const storeData = yield call(getStoreNewRetailData)
  let param = {
    ...data,
    cart_id: cartId,
    device_token: token,
    unique_id: uniqueId,
    fingerprint: uniqueId,
    company_code: config.companyCode,
    store_code_new_retail: storeData.store_code
  }
  const res = yield call(api.register, param)
  if (!res.ok) {
    if (res.data && res.data.error) {
      return yield put(RegisterActions.registerFailure(res.data.message))
    } else {
      return yield put(RegisterActions.registerFailure('Terjadi kesalahan koneksi'))
    }
  }
  if (!res.data.error) {
    yield AsyncStorage.setItem('access_token', res.data.token)
    // initial mixpanel
    // const user = res.data.data || {}
    // yield Identify(user.customer_id)
    // yield SetOnceUserMixPanel({ '$name': `${user.first_name}`, '$email': `${user.email}`, 'Created': new Date().toUTCString() })
    // if (!_.isEmpty(user)) {
    //   let now = (new Date()).getFullYear()
    //   let birthDate = (new Date(user.birth_date)).getFullYear()
    //   let age = now - birthDate
    //   let generation = 'Unknown'
    //   if (_.inRange(birthDate, 1946, 1964)) generation = 'Baby boomers'
    //   else if (_.inRange(birthDate, 1965, 1976)) generation = 'X'
    //   else if (_.inRange(birthDate, 1977, 1997)) generation = 'Y'
    //   else if (_.inRange(birthDate, 2001, 2010)) generation = 'Z'
    //   else if (_.inRange(birthDate, 2010, now)) generation = 'Alpha'
    //   yield registerPropertiesOnce({ gender: user.gender, birth_date: user.birth_date, generation, age })
    // }
    // yield Track(`Register ${new Date().toUTCString()}`)
    // yield put(OtpActions.otpInit())
    setFreshchatUser(res.data.data)
    // analytics().logEvent('register_success')
    /* firebase analytics sign_up */
    analytics().logEvent('sign_up', { method: 'email address' })
    yield put(RegisterActions.registerSuccess(res.data.data))
    yield put(AuthActions.authSuccess(res.data.data))
    yield fork(fetchSetDeviceTokenAPI, api, true)
  } else {
    return yield put(RegisterActions.registerFailure(res.data.message))
  }
}

export function * registerAce (api, token) {
  yield baseListen(RegisterTypes.REGISTER_ACE_REQUEST,
    fetchregisterAce,
    api,
    token)
}
export function * fetchregisterAce (api, getToken, { data }) {
  const token = yield call(getToken)
  let res = yield call(api.registerAce, token, data)
  // trackCustomEvent('register_saga_response', { name: 'registerAce', res: JSON.stringify(res) })

  if (res.ok && !res.data.error) {
    yield put(RegisterActions.registerAceSuccess(res.data.data))
  } else {
    yield put(RegisterActions.registerAceFailure('Terjadi kesalahan koneksi'))
  }
}

// export function * loginAce (api, token) {
//   yield baseListen(LoginMembershipTypes.LOGIN_MEMBER_REQUEST,
//     fetchLoginAce,
//     api,
//     token)
// }
// export function * fetchLoginAce (api, { data }, getToken) {
//   const token = yield call(getToken)
//   let res = yield call(api.loginAce, token, data)
//   trackCustomEvent('loginAce_saga_response', { name: 'loginAce', res: JSON.stringify(res) })

//   if (res.ok && !res.data.error) {
//     yield put(LoginMemberActions.loginMemberSuccess(res.data.data))
//   } else {
//     yield put(LoginMemberActions.loginMemberFailure(res.data.message))
//   }
// }
