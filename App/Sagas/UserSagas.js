import UserActions, { UserTypes } from '../Redux/UserRedux'
// import {UserDumbTypes} from '../Redux/UserDumbRedux'
import UserValidator from '../Validations/User'
import { baseListen, baseFetchToken, baseFetchTokenUpdate } from './BaseSagas'
import { call, put, take, fork, END } from 'redux-saga/effects'
import AuthActions from './AuthSagas'

// get data user
export function * userData (api, getToken) {
  yield baseListen(UserTypes.USER_REQUEST,
    fetchUserDataAPI,
    api,
    getToken
  )
}

// get voucher list user
export function * userGetVoucherList (api, getToken) {
  yield baseListen(UserTypes.USER_VOUCHER_REQUEST,
    fetchUserGetVoucherListAPI,
    api,
    getToken
  )
}

// get review list user
export function * userGetReviewList (api, getToken) {
  yield baseListen(UserTypes.USER_REVIEW_REQUEST,
    fetchUserReviewAPI,
    api,
    getToken
  )
}

// check point user
export function * userGetPoint (api, getToken) {
  yield baseListen(UserTypes.USER_CHECK_POINT_REQUEST,
    fetchUserGetPointAPI,
    api,
    getToken
  )
}

// redeem point user
export function * userRedeemPoint (api, getToken) {
  yield baseListen(UserTypes.USER_REDEEM_POINT_REQUEST,
    fetchUserRedeemPointAPI,
    api,
    getToken
  )
}

// toggle wishlist user
export function * toggleWishlist (api, getToken, getStoreNewRetailData) {
  yield baseListen(UserTypes.USER_TOGGLE_WISHLIST_REQUEST,
    fetchUserToggleWishlistAPI,
    api,
    getToken,
    getStoreNewRetailData
  )
}

// toggle wishlist dumb user
// export function* toggleDumbWishlist (api, getToken) {
//   yield baseListen(UserDumbTypes.USER_TOGGLE_WISHLIST_DUMB_REQUEST,
//     fetchUserToggleWishlistAPI,
//     api,
//     getToken
//   )
// }

// update data listen
export function * userUpdate (api, getToken, data) {
  yield baseListen(UserTypes.USER_UPDATE,
    updateUserDataAPI,
    api,
    getToken
  )
}
// get user
export function * fetchUserDataAPI (api, getToken, data) {
  yield baseFetchToken(api.userProfile,
    data,
    getToken,
    UserActions.userSuccess,
    UserActions.userFailure)
}

// get point
export function * fetchUserGetPointAPI (api, getToken, data) {
  const hasError = UserValidator.getPointConstraints(data.data.params)
  if (hasError) {
    return yield put(UserActions.userCheckPointFailure(hasError))
  } else {
    yield baseFetchToken(api.cekPoint,
      data,
      getToken,
      UserActions.userCheckPointSuccess,
      UserActions.userCheckPointFailure)
  }
}
// get voucher
export function * fetchUserGetVoucherListAPI (api, getToken, data) {
  yield baseFetchToken(api.getVoucherList,
    data,
    getToken,
    UserActions.userVoucherSuccess,
    UserActions.userVoucherFailure)
}

// redeem point
export function * fetchUserRedeemPointAPI (api, getToken, data) {
  const hasError = UserValidator.redeemPointConstraints(data.data.params)
  if (hasError) {
    return yield put(UserActions.userFailure(hasError))
  } else {
    yield baseFetchToken(api.redeemPoint,
      data,
      getToken,
      UserActions.userRedeemPointSuccess,
      UserActions.userRedeemPointFailure)
  }
}

// toggle wishlist
export function * fetchUserToggleWishlistAPI (api, getToken, data, getStoreNewRetailData) {
  try {
    const token = yield call(getToken)
    if (!token) {
      yield put(AuthActions.authLogout())
    } else {
      // const wishlistSize = data.data.wishlistSize
      // const wishlistFrom = data.data.wishlistFrom
      // const isFromWishlistPage = (data.data.hasOwnProperty('fromWishlistPage')) ? data.data.fromWishlistPage : false
      const res = yield call(api.toggleWishlist, token, data)
      if (!res.ok || res.data.error) {
        yield put(UserActions.userToggleWishlistFailure('Terjadi kesalahan koneksi'))
      } else {
        if (!res.data.error) {
          // if (!isFromWishlistPage) {
          yield fork(getAllUserWishListAPI, api, getToken, getStoreNewRetailData, {})
          // } else {
          //   yield fork(getUserWishListAPI, api, getToken, { data: { wishlistFrom, wishlistSize } })
          //   yield put(UserActions.userToggleWishlistSuccess())
          // }
        } else {
          yield put(UserActions.userToggleWishlistFailure(res.data.message))
        }
      }
    }
  } catch (e) {
    // console.log(e)
    yield put(UserActions.userToggleWishlistFailure())
  }
}

// update user
export function * updateUserDataAPI (api, getToken, { data }) {
  let hasError = UserValidator.updateConstraints(data.user)
  if (!hasError && data.user.group && data.user.group.AHI && data.user.group.AHI !== '') {
    hasError = UserValidator.memberGroupAHIConstraints(data.user.group)
  }
  if (!hasError && data.user.group && data.user.group.TGI && data.user.group.TGI !== '') {
    hasError = UserValidator.memberGroupTGIConstraints(data.user.group)
  }
  if (!hasError && data.user.group && data.user.group.HCI && data.user.group.HCI !== '') {
    hasError = UserValidator.memberGroupHCIConstraints(data.user.group)
  }
  if (hasError) {
    return yield put(UserActions.userFailure(hasError))
  } else {
    if (data.user.group['NOT LOGGED IN'] === '') {
      delete data.user.group['NOT LOGGED IN']
      delete data.user.group['NOT LOGGED IN_is_verified']
      delete data.user.group['NOT LOGGED IN_expiration_date']
    }
    yield baseFetchTokenUpdate(api.userUpdate,
      data.user,
      getToken,
      UserActions.userUpdateSuccess,
      UserActions.userFailure)
  }
}

// get wishlist user
export function * getWishlist (api, getToken, getStoreNewRetailData) {
  let action = yield take(UserTypes.USER_GET_WISHLIST_REQUEST)
  while (action !== END) {
    yield fork(getUserWishListAPI, api, getToken, getStoreNewRetailData, action)
    action = yield take(UserTypes.USER_GET_WISHLIST_REQUEST)
  }
}

export function * getAllWishlist (api, getToken, getStoreNewRetailData) {
  let action = yield take(UserTypes.USER_GET_ALL_WISHLIST_REQUEST)
  while (action !== END) {
    yield fork(getAllUserWishListAPI, api, getToken, getStoreNewRetailData, action)
    action = yield take(UserTypes.USER_GET_ALL_WISHLIST_REQUEST)
  }
}

export function * getUserWishListAPI (api, getToken, getStoreNewRetailData, { data }) {
  const storeData = yield call(getStoreNewRetailData)
  try {
    let token = null
    if (data && data.hasOwnProperty('token')) {
      token = data.token
    } else {
      token = yield call(getToken)
    }
    if (storeData && storeData.store_code) data.storeCodeNewRetail = storeData.store_code
    if (!token) {
      yield put(UserActions.userGetWishlistFailure('Token tidak valid'))
    } else {
      const res = yield call(api.getWishlist, token, data)
      if (!res.ok || res.data.error) {
        yield put(UserActions.userGetWishlistFailure(res.data.message))
      } else {
        yield put(UserActions.userGetWishlistSuccess(res.data.data))
      }
    }
  } catch (e) {
    yield put(UserActions.userGetWishlistFailure())
  }
}

export function * getAllUserWishListAPI (api, getToken, getStoreNewRetailData, data) {
  const storeData = yield call(getStoreNewRetailData)
  try {
    let token = null
    if (data && data.hasOwnProperty('token')) {
      token = data.token
    } else {
      token = yield call(getToken)
    }
    let storeCodeNewRetail = (storeData && storeData.store_code) ? storeData.store_code : ''

    if (!token) {
      yield put(UserActions.userGetWishlistFailure('Token tidak valid'))
    } else {
      const res = yield call(api.getAllWishlist, token, storeCodeNewRetail)
      if (!res.ok || res.data.error) {
        yield put(UserActions.userGetWishlistFailure(res.data.message))
      } else {
        yield put(UserActions.userGetWishlistSuccess(res.data.data))
      }
    }
  } catch (e) {
    yield put(UserActions.userGetWishlistFailure('offline'))
  }
}

export function * fetchUserReviewAPI (api, getToken, data) {
  yield baseFetchToken(api.getUserReview,
    data,
    getToken,
    UserActions.userReviewSuccess,
    UserActions.userReviewFailure)
}
