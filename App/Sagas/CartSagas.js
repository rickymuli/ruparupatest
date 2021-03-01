import { put, call, take, fork, cancel, select } from 'redux-saga/effects'
import { END } from 'redux-saga'
import CartActions, { CartTypes } from '../Redux/CartRedux'
import AuthActions from '../Redux/AuthRedux'
import StoreNewRetailActions from '../Redux/StoreNewRetailRedux'
import MemberRegActions from '../Redux/MemberRegistrationRedux'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CartValidator from '../Validations/Cart'
import messaging from '@react-native-firebase/messaging'
import { Navigate } from '../Services/NavigationService'

// import config from '../../config'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import startsWith from 'lodash/startsWith'
// import DeviceInfo from 'react-native-device-info'
// import Cookies from 'cookies-js'

export const getCart = (state) => state.cart

export const getUser = (state) => state.auth

export const getAddress = (state) => state.address

export const getMemberReg = (state) => state.memberRegistration

function * cartUserdata (data, token) {
  // const { user } = yield select(getUser)
  const newData = {
    device: Platform.OS,
    items: get(data, 'items', []),
    device_token: data.device_token
  }
  // if (token && user) {
  //   newData.customer = {
  //     'customer_is_guest': 0,
  //     'first_name': user.first_name,
  //     'email': user.email
  //   }
  // }
  return newData
}

function checkHasError (data) {
  if (data && data.shipping_address) {
    return CartValidator.addressConstraints(data.shipping_address)
  } else {
    return false
  }
}

export function * fetchCart (api, getCartId, token, callback) {
  let action = yield take(CartTypes.CART_REQUEST)
  while (action !== END) {
    yield fork(fetchCartAPI, api, getCartId, token, action)
    action = yield take(CartTypes.CART_REQUEST)
  }
}

export function * loginWithCart (cartId, api) {
  const res = yield call(api.cartAuth, cartId)
  if (res.ok) {
    if (res.data.data) {
      yield AsyncStorage.setItem('access_token', res.data.token)
      yield put(AuthActions.authSuccess(res.data.data))
    }
  }
}

export function * fetchCartType (api, getCartId, getToken) {
  let action = yield take(CartTypes.CART_TYPE_REQUEST)
  while (action !== END) {
    yield fork(fetchCartTypeAPI, api, getCartId, getToken, action)
    action = yield take(CartTypes.CART_TYPE_REQUEST)
  }
}

export function * fetchCartTypeAPI (api, getCartId, getToken, { data }) {
  try {
    const { user } = yield select(getUser)
    if (isEmpty(user)) throw new Error('Failed change cart (can\'t get token)')
    const res = yield call(api.getCartType, user.customer_id, data)
    if (!res.ok || (!isEmpty(res.data.errors) && get(res.data.errors, 'message') !== 'Cart not found')) throw new Error('Failed change cart')
    yield AsyncStorage.setItem('cart_id', get(res.data.data, 'cart_id', ''))
    yield fork(fetchCartAPI, api, getCartId, getToken, {})
  } catch (error) {
    yield put(CartActions.cartFailure(error || 'Terjadi kesalahan koneksi'))
  } finally {
    if (isEmpty(data)) {
      yield AsyncStorage.setItem('store_new_retail_data', '')
      yield put(StoreNewRetailActions.storeNewRetailSuccess(null))
    }
  }
}

export function * fetchCartAPI (api, getCartId, getToken, { data, callback }) {
  const cartId = yield call(getCartId)
  const token = yield call(getToken)
  const { cartSuccess } = yield select(getMemberReg)
  if (cartId || data) {
    let cartData = ''
    let tokenData = ''
    if (cartId) {
      cartData = cartId
      tokenData = token
    } else {
      cartData = data.cartId
      tokenData = data.token
    }
    const res = yield call(api.getCart, cartData, tokenData)
    if (callback) {
      callback(res)
    }
    if (res.ok) {
      if (res.data && (isEmpty(res.data.errors) || get(res.data.errors, 'data'))) {
        if (res.data.data && res.data.data.status && res.data.data.status !== 'pending') {
          yield put(CartActions.cartDeleteRequest())
        } else {
          if (res.data.data) {
            if (res.data.data.customer) {
              if (!parseInt(res.data.data.customer.customer_is_guest) && !parseInt(token)) {
                yield fork(loginWithCart, cartId, api)
              }
            }
            let data = res.data.data
            data['errors'] = res.data.errors
            const cart = yield put(CartActions.cartSuccess(res.data.data))
            if (cart && cartSuccess) {
              Navigate('PaymentPage', { utmParameter: '' })
              yield put(MemberRegActions.memberRegCartSuccess(false))
            }
          } else {
            yield put(CartActions.cartFailure(res.data.message || 'Terjadi Kesalahan Koneksi'))
            yield put(MemberRegActions.memberRegCartSuccess(false))
          }
        }
      } else {
        yield put(CartActions.cartFailure(res.data.errors.message))
      }
    } else {
      yield put(CartActions.cartFailure('Failed get cart'))
    }
  } else {
    yield put(CartActions.cartFailure('Failed get cart (can\'t get token)'))
  }
}

export function * createCart (api, getCartId, token, getStoreNewRetailData) {
  let action = yield take(CartTypes.CART_CREATE_REQUEST)
  while (action !== END) {
    yield fork(createCartAPI, api, getCartId, token, getStoreNewRetailData, action)
    action = yield take(CartTypes.CART_CREATE_REQUEST)
  }
}

export function * createCartAPI (api, getCartId, getToken, getStoreNewRetailData, { data }) {
  const cartId = yield call(getCartId)
  const token = yield call(getToken)
  if (!cartId) {
    let cartData = yield call(cartUserdata, data, token)
    const storeData = yield call(getStoreNewRetailData)
    cartData.store_code_new_retail = (storeData && storeData.store_code) ? storeData.store_code : ''
    // let parsedStoreData = {}
    // try {
    //   const storageData = yield AsyncStorage.getItem('store_new_retail_data')
    //   if (storageData) {
    //     parsedStoreData = JSON.parse(storageData)
    //   }
    // } catch (error) {
    //   if (__DEV__) {
    //     console.log(error)
    //   }
    // }

    // if (!isEmpty(parsedStoreData)) {
    //   cartData.store_code = parsedStoreData.store_code
    // } else {
    //   cartData.store_code = ''
    // }
    const res = yield call(api.createCart, cartData, token, getStoreNewRetailData)
    if (res.ok) {
      if (res.data && isEmpty(res.data.errors)) {
        yield AsyncStorage.setItem('cart_id', res.data.data.cart_id)
        yield put(CartActions.cartCreateSuccess())
      } else {
        yield put(CartActions.cartCreateFailure(res.data.errors.message))
      }
    } else {
      yield put(CartActions.cartCreateFailure('Failed get cart'))
    }
  } else {
    yield put(CartActions.cartCreateFailure('Cart already exist'))
  }
}

export function * updateCart (api, getCartId, token, getStoreNewRetailData) {
  let lastTask
  while (true) {
    let action = yield take(CartTypes.CART_UPDATE_REQUEST)
    if (lastTask) {
      yield cancel(lastTask)
    }
    lastTask = yield fork(updateCartAPI, api, getCartId, token, getStoreNewRetailData, action)
  }
}

export function * updateCartAPI (api, getCartId, getToken, getStoreNewRetailData, { data }) {
  const hasError = checkHasError(data)
  if (hasError) {
    return yield put(CartActions.cartUpdateFailure(hasError[0]))
  } else {
    const token = yield call(getToken)
    const cartId = yield call(getCartId)
    const storeData = yield call(getStoreNewRetailData)

    let parsedStoreData = {}
    // check storage
    try {
      const storageData = yield AsyncStorage.getItem('store_new_retail_data')
      if (storageData) {
        parsedStoreData = JSON.parse(storageData)
      }
    } catch (error) {
      if (__DEV__) {
        console.log('Error update cart API on try-catch AsyncStorage!', error)
      }
    }
    if (cartId) {
      let cartData = yield call(cartUserdata, data, token)
      if (!cartData.device_token) {
        const deviceToken = yield messaging().getToken()
        cartData['device_token'] = deviceToken
      }
      cartData.store_code_new_retail = storeData.store_code || ''
      cartData.device = Platform.OS
      // if (!isEmpty(parsedStoreData)) {
      //   cartData.store_code = parsedStoreData.store_code
      // } else {
      //   cartData.store_code = ''
      // }
      const res = yield call(api.updateCart, cartData, cartId, token)
      if (!res.ok) {
        return yield put(CartActions.cartUpdateFailure('Terjadi kesalahan, silakan diulangi beberapa saat lagi'))
      }
      if (isEmpty(res.data.errors)) {
        // now we have to check cart_id ( same or different from current AsyncStorage data )
        if (!isEmpty(res.data.data.cart_id)) {
          yield AsyncStorage.setItem('cart_id', res.data.data.cart_id)
        }
        yield fork(fetchCartAPI, api, getCartId, getToken, {})
      } else {
        if (startsWith(res.data.errors.code, 4)) yield put(CartActions.cartUpdateFailure(res.data.errors.message))
        else yield put(CartActions.cartUpdateFailure('Terjadi kesalahan koneksi'))
      }
    } else {
      yield call(createCartAPI, api, getCartId, getToken, getStoreNewRetailData, { data })
      const cartId = yield call(getCartId)
      if (cartId) {
        const cartData = yield call(cartUserdata, data, token)
        if (!isEmpty(parsedStoreData)) {
          cartData.store_code = parsedStoreData.store_code
        } else {
          cartData.store_code = ''
        }
        cartData.store_code_new_retail = storeData.store_code
        const res = yield call(api.updateCart, cartData, cartId, token)
        if (!res.ok) {
          return yield put(CartActions.cartUpdateFailure('Terjadi kesalahan, silakan diulangi beberapa saat lagi'))
        }
        if (isEmpty(res.data.errors)) {
          yield fork(fetchCartAPI, api, getCartId, getToken, {})
        } else {
          yield put(CartActions.cartUpdateFailure(res.data.errors.message))
        }
      } else {
        return yield put(CartActions.cartUpdateFailure('Terjadi kesalahan, silakan diulangi beberapa saat lagi'))
      }
    }
  }
}

export function * deleteCartItem (api, getCartId) {
  let action = yield take(CartTypes.CART_DELETE_ITEM_REQUEST)
  while (action !== END) {
    yield fork(deleteCartItemAPI, api, getCartId, action)
    action = yield take(CartTypes.CART_DELETE_ITEM_REQUEST)
  }
}

export function * deleteCartItemAPI (api, getCartId, { data }) {
  const cartId = yield call(getCartId)
  if (cartId) {
    const res = yield call(api.deleteCartItem, data, cartId)
    if (res.ok) {
      yield put(CartActions.cartRequest())
      return yield put(CartActions.cartDeleteItemSuccess())
    } else {
      return yield put(CartActions.cartDeleteItemFailure(res.data.errors.message))
    }
  }
}

export function * deleteCartRequest (api, getCartId, token) {
  let action = yield take(CartTypes.CART_DELETE_REQUEST)
  while (action !== END) {
    yield fork(deleteCart, api, getCartId, token, action)
    action = yield take(CartTypes.CART_DELETE_REQUEST)
  }
}

export function * deleteCart (api, getCartId, token, { data }) {
  const cartId = yield call(getCartId)
  if (!cartId) {
    yield put(CartActions.cartDeleteSuccess())
  } else {
    yield AsyncStorage.removeItem('cart_id')
    yield put(CartActions.cartDeleteSuccess())
  }
}
