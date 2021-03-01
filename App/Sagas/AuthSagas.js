import { put, call, select, fork } from 'redux-saga/effects'
// import { END } from 'redux-saga'
import AuthActions, { AuthTypes } from '../Redux/AuthRedux'
import OrderActions from '../Redux/OrderRedux'
import CartActions from '../Redux/CartRedux'
import UserActions from '../Redux/UserRedux'
// import OtpActions from '../Redux/OtpRedux'
import AddressActions from '../Redux/AddressRedux'
import StoreNewRetailActions from '../Redux/StoreNewRetailRedux'
import AuthValidator from '../Validations/Auth'
import { fetchCartAPI } from './CartSagas'
import { baseListen, baseFetchToken, baseFetchNoToken, baseListenCartToken } from './BaseSagas'
import { setFreshchatUser } from '../Services/Freshchat'
import { setContact, clearContact } from '../Services/Emarsys'
import { getAllUserWishListAPI } from './UserSagas'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import isEmpty from 'lodash/isEmpty'
// import firebase from '@react-native-firebase/app'
import messaging from '@react-native-firebase/messaging'
import analytics from '@react-native-firebase/analytics'
import DeviceInfo from 'react-native-device-info'
var dayjs = require('dayjs')

export const getAuth = (state) => state.auth

export function * login (api, getCartId, getToken, getStoreNewRetailData) {
  yield baseListenCartToken(AuthTypes.AUTH_REQUEST,
    fetchLoginAPI,
    api,
    getToken,
    getCartId,
    getStoreNewRetailData)
}

// attempts to login then checkout
export function * loginCheckout (api, getToken, getCartId, getStoreNewRetailData) {
  yield baseListenCartToken(AuthTypes.AUTH_CHECKOUT_REQUEST,
    fetchLoginCheckoutAPI,
    api,
    getToken,
    getCartId,
    getStoreNewRetailData)
}
// change password
export function * changePassword (api, getToken) {
  yield baseListen(AuthTypes.AUTH_CHANGE_PASSWORD_REQUEST,
    fetchChangePasswordAPI,
    api,
    getToken
  )
}

// forgot password
export function * forgot (api) {
  yield baseListen(AuthTypes.AUTH_FORGOT_PASSWORD_REQUEST,
    fetchForgotPasswordAPI,
    api)
}

// reset password
export function * reset (api) {
  yield baseListen(AuthTypes.AUTH_RESET_PASSWORD_REQUEST,
    fetchResetPasswordAPI,
    api)
}

// set device token
export function * setDeviceToken (api) {
  yield baseListen(AuthTypes.AUTH_SET_DEVICE_TOKEN_REQUEST,
    fetchSetDeviceTokenAPI,
    api)
}

export function * fetchAuthReset (api) {
  yield baseListen(AuthTypes.AUTH_RESET_REQUEST,
    fetchAuthResetAPI,
    api)
}

export function * autoLogin (api) {
  yield baseListen(AuthTypes.AUTH_AUTO_LOGIN_REQUEST,
    fetchAutoLoginAPI,
    api)
}
// export function * setDeviceTokenLogout (api) {
//   yield baseListen(AuthTypes.AUTH_LOGOUT_SUCCESS,
//     fetchSetDeviceTokenAPI,
//     api)
// }

export function * fetchAutoLoginAPI (api, { data }) {
  const res = yield call(api.userProfile, data)
  if (!res.ok) {
    yield put(AuthActions.authFailure('Terjadi kesalahan teknis. Mohon coba sesaat lagi.'))
  } else {
    yield AsyncStorage.setItem('access_token', data)
    yield put(AuthActions.authSuccess(res.data.data))
  }
}

export function * fetchLoginAPI (api, getToken, getCartId, { data }, getStoreNewRetailData) {
  const deviceToken = yield messaging().getToken()
  const uniqueId = yield DeviceInfo.getUniqueId()
  const storeData = yield call(getStoreNewRetailData)
  const cartId = yield call(getCartId)
  let param = {
    ...data,
    cart_id: (cartId || ''),
    device_token: deviceToken,
    fingerprint: uniqueId,
    unique_id: uniqueId,
    store_code_new_retail: storeData.store_code || ''
  }
  // Call API Login
  const res = yield call(api.login, param)
  if (!res.ok) {
    // If there is an error returned from the server (ex. invalid pass or email address)
    if (!isEmpty(res.data) && typeof (res.data) === 'object') {
      yield put(AuthActions.authFailure(res.data.message))
    } else {
      yield put(AuthActions.authFailure('Terjadi kesalahan teknis. Mohon coba sesaat lagi.'))
    }
    yield AsyncStorage.setItem('access_token', res.data.token)
    // Cookies
    // yield put(AuthActions.authSetDeviceTokenRequest())
    // yield put(AuthActions.authSuccess(res.data.data))
    // yield put(OrderActions.orderInitHideDiv())
    // yield fork(getAllUserWishListAPI, api, getToken, { token: res.data.token })
  } else {
    if (!res.data.error) {
      if (res.data.data.cart_id) {
        yield AsyncStorage.setItem('cart_id', res.data.data.cart_id)
        yield fork(fetchCartAPI, api, getCartId, getToken, { data: {
          cartId: res.data.data.cart_id,
          token: res.data.token
        } })
      }
      yield AsyncStorage.setItem('access_token', res.data.token)
      setContact(res.data.data.customer_id)
      setFreshchatUser(res.data.data)
      // analytics().logEvent('login_success')
      /* firebase analytics login */
      analytics().logEvent('login', { method: res.data.data.registered_by })
      yield put(AuthActions.authSuccess(res.data.data))
      yield put(OrderActions.orderInitHideDiv())
      yield fork(getAllUserWishListAPI, api, getToken, getStoreNewRetailData, { token: res.data.token })
      yield fork(fetchSetDeviceTokenAPI, api, true)
    } else {
      yield put(AuthActions.authFailure(res.data.message))
    }
  }
  // }
}

export function * fetchLoginCheckoutAPI (api, getToken, getCartId, { data }, getStoreNewRetailData) {
  const hasError = AuthValidator.loginConstraints(data)
  if (hasError) {
    yield put(AuthActions.authFailure(hasError))
  } else {
    const res = yield call(api.login, data)
    if (!res.ok) {
      yield put(AuthActions.authFailure('Terjadi kesalahan koneksi'))
    }
    if (!res.data.error) {
      yield AsyncStorage.setItem('access_token', res.data.token)
      analytics().logEvent('logout')
      yield put(AuthActions.authSuccess(res.data.data))
      yield fork(getAllUserWishListAPI, api, getToken, getStoreNewRetailData, { token: res.data.token })
      const cartId = yield call(getCartId)
      if (cartId) {
        yield put(CartActions.cartUpdateRequest(data.data))
      } else {
        yield put(CartActions.cartCreateRequest(data.data))
      }
    } else {
      yield put(AuthActions.authFailure(res.data.message))
    }
  }
}

// attempts to logout
export function * logout (api) {
  yield baseListen(AuthTypes.AUTH_LOGOUT,
    doLogout,
    api)
}

export function * doLogout (api, { data }) {
  const isRemoveAccessToken = yield AsyncStorage.removeItem('access_token')
  // yield AsyncStorage.removeItem('algolia_anonymous_token')
  // yield Cookies.expire('access_token')
  const cartId = yield AsyncStorage.removeItem('cart_id')
  const reduxPersists = yield AsyncStorage.removeItem('persist:ruparupa')
  if (!isRemoveAccessToken && !cartId && !reduxPersists) {
    setFreshchatUser(null, true)
    clearContact()
    yield put(OrderActions.orderInit())
    yield put(AuthActions.authUserInit())
    yield put(UserActions.userInitUser())
    yield put(UserActions.userInitWishlist())
    yield put(CartActions.cartInit())
    yield put(AddressActions.addressInit())
    yield AsyncStorage.setItem('store_new_retail_data', '')
    yield put(StoreNewRetailActions.storeNewRetailSuccess(null))
    // yield baseFetchNoToken(api.logout,
    //   data,
    //   AuthActions.authLogoutSuccess,
    //   AuthActions.authLogoutFailure)
    yield fork(fetchSetDeviceTokenAPI, api, true, true)
  } else {
    yield put(AuthActions.authFailure('Terjadi kendala, silahkan coba kembali'))
  }
}
// change password API
export function * fetchChangePasswordAPI (api, getToken, { data }) {
  const hasError = AuthValidator.passwordConstraints(data)
  if (hasError) {
    return yield put(AuthActions.authChangePasswordFailure(hasError))
  } else {
    yield baseFetchToken(api.changePassword,
      data,
      getToken,
      AuthActions.authChangePasswordSuccess,
      AuthActions.authChangePasswordFailure)
  }
}

// forgot password API
export function * fetchForgotPasswordAPI (api, { data }) {
  const hasError = AuthValidator.forgotConstraints(data)
  if (hasError) {
    return yield put(AuthActions.authForgotPasswordFailure(hasError))
  } else {
    yield baseFetchNoToken(api.forgot,
      data.email,
      AuthActions.authForgotPasswordSuccess,
      AuthActions.authForgotPasswordFailure)
  }
}

// reset password API
export function * fetchResetPasswordAPI (api, { data }) {
  const hasError = AuthValidator.passwordConstraints(data)
  if (hasError) {
    return yield put(AuthActions.authResetPasswordFailure(hasError))
  } else {
    yield baseFetchNoToken(api.resetPassword,
      data,
      AuthActions.authResetPasswordSuccess,
      AuthActions.authResetPasswordFailure)
  }
}

// set device token API
export function * fetchSetDeviceTokenAPI (api, forceUpdate, forceInitUser) {
  try {
    const uniqueId = yield DeviceInfo.getUniqueId()
    const isDeviceRegistered = yield messaging().isDeviceRegisteredForRemoteMessages
    if (!isDeviceRegistered) yield messaging().registerDeviceForRemoteMessages()
    const deviceToken = yield messaging().getToken()
    const { dataDeviceToken = {}, user = {} } = yield select(getAuth)
    let lastVisit = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    let isExpireDate = !isEmpty(dataDeviceToken.last_visit) && dayjs(new Date()).date() > dayjs(dataDeviceToken.last_visit).date()
    if (forceUpdate || (deviceToken !== dataDeviceToken.device_token) || isExpireDate || (user && dataDeviceToken.customer_id !== user.customer_id)) {
      let data = {
        last_visit: lastVisit,
        os: Platform.OS,
        unique_id: uniqueId,
        company_code: 'ODI',
        city: null,
        device_token: deviceToken,
        customer_id: (user && !forceInitUser) ? user.customer_id : null
      }
      const res = yield call(api.deviceToken, data)
      if (res.ok) yield put(AuthActions.authSetDeviceTokenSuccess(data))
    }
  } catch (error) {

  }
}

// auth reset
export function * fetchAuthResetAPI (api, { data }) {
  const hasError = AuthValidator.passwordConstraints(data)
  if (hasError) return yield put(AuthActions.authFailure(hasError))
  let res = yield call(api.resetAuth, data)
  if (!res.ok) {
    yield put(AuthActions.authFailure(res.data.message))
  } else {
    if (isEmpty(res.data.error)) {
      // yield put(OtpActions.otpInit())
      yield put(AuthActions.authSuccess(res.data.data))
    } else {
      yield put(AuthActions.authFailure(res.data.message))
    }
  }
}
