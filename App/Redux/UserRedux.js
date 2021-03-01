// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  userRequest: null,
  userUpdate: ['data'],
  userDeviceTokenSave: ['data'],
  userSuccess: ['user'],
  userUpdateSuccess: ['user'],
  userFailure: ['err'],
  userCheckPointFailure: ['err'],
  userCheckPointRequest: ['data'],
  userCheckPointSuccess: ['point'],
  userRedeemPointFailure: ['err'],
  userRedeemPointRequest: ['data'],
  userRedeemPointSuccess: ['redeem'],
  userToggleWishlistFailure: ['err'],
  userToggleWishlistRequest: ['data'],
  userToggleWishlistSuccess: ['wishlist'],
  userGetWishlistFailure: ['err'],
  userGetWishlistRequest: ['data'],
  userGetAllWishlistRequest: null,
  userGetWishlistSuccess: ['wishlist'],
  userReviewFailure: ['err'],
  userReviewRequest: ['data'],
  userReviewSuccess: ['review'],
  userVoucherFailure: ['err'],
  userVoucherRequest: ['data'], // note
  userVoucherSuccess: ['voucher'],
  userLogout: null,
  userInitRedeem: null,
  userInit: null,
  userInitUser: null,
  userInitPoint: null,
  userInitWishlist: null
})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  fetchingPoint: false,
  fetchingRedeem: false,
  fetchingVoucher: false,
  fetchingWishlist: false,
  fetchingReview: false,
  success: false,
  successWishlist: false,
  errWishlist: null,
  user: null,
  deviceToken: '',
  point: null,
  redeem: null,
  voucher: [],
  wishlist: [],
  review: null,
  err: null,
  errVoucher: null
})

/* ------------- Reducers ------------- */

// we're attempting to login
export const request = (state: Object) => state.merge({
  fetching: true,
  err: null
})
export const requestPoint = (state: Object) => state.merge({
  fetchingPoint: true,
  err: null,
  point: null
})
export const requestRedeem = (state: Object) => state.merge({
  fetchingRedeem: true,
  err: null,
  redeem: null
})
export const requestVoucher = (state: Object) => state.merge({
  fetchingVoucher: true,
  errVoucher: null,
  voucher: []
})
export const requestWishlist = (state: Object) => state.merge({
  fetchingWishlist: true,
  errWishlist: null,
  successWishlist: false
})
export const requestToggleWishlist = (state: Object) => state.merge({
  fetchingWishlist: true,
  err: null,
  successWishlist: false
})
export const requestReview = (state: Object) => state.merge({
  fetchingReview: true,
  err: null
})

export const update = (state: Object, { data }: Object) => state.merge({
  fetching: true,
  err: null,
  data
})

// we've successfully logged in
export const success = (state: Object, { user }: Object) =>
  state.merge({
    fetching: false,
    err: null,
    user
  })

export const pointSuccess = (state: Object, { point }: Object) =>
  state.merge({
    fetchingPoint: false,
    err: null,
    point
  })

export const reviewSuccess = (state: Object, { review }: Object) =>
  state.merge({
    fetchingReview: false,
    err: null,
    review
  })

export const redeemSuccess = (state: Object, { redeem }: Object) =>
  state.merge({
    fetchingRedeem: false,
    err: null,
    redeem
  })
export const voucherSuccess = (state: Object, { voucher }: Object) =>
  state.merge({
    fetchingVoucher: false,
    errVoucher: null,
    voucher
  })

export const wishlistSuccess = (state: Object, { wishlist }: Object) =>
  state.merge({
    fetchingWishlist: false,
    errWishlist: null,
    wishlist,
    successWishlist: true
  })

export const toggleWishlistSuccess = (state: Object, { wishlist }: Object) =>
  state.merge({
    fetchingWishlist: false,
    errWishlist: null,
    successWishlist: true
  })

export const updateSuccess = (state: Object, { user }: Object) =>
  state.merge({
    fetching: false,
    err: null,
    success: true,
    user
  })

// we've had a problem logging in
// Possible errors:
// * user pass doesnt match
// * user not registered ?
// * user account not activated ?
// err is string
export const failure = (state: Object, { err }: any) => {
  return state.merge({
    fetching: false,
    err
  })
}
export const pointFailure = (state: Object, { err }: any) => {
  return state.merge({
    fetchingPoint: false,
    err
  })
}
export const reviewFailure = (state: Object, { err }: any) => {
  return state.merge({
    fetchingReview: false,
    err
  })
}
export const redeemFailure = (state: Object, { err }: any) => {
  return state.merge({
    fetchingRedeem: false,
    err
  })
}
export const voucherFailure = (state: Object, { err }: any) => {
  return state.merge({
    fetchingVoucher: false,
    errVoucher: err
  })
}
export const wishlistFailure = (state: Object, { err }: any) => {
  return state.merge({
    fetchingWishlist: false,
    errWishlist: err,
    successWishlist: false
  })
}
export const toggleWishlistFailure = (state: Object, { err }: any) => {
  return state.merge({
    fetchingWishlist: false,
    err,
    successWishlist: false
  })
}

// Set state initial value when user open sign in modal
export const init = (state: Object) => state.merge({
  fetching: false,
  err: null,
  success: false
})

export const initUser = (state: Object) => state.merge({
  fetching: false,
  err: null,
  success: false,
  user: null
})

export const initRedeem = (state: Object) => state.merge({
  fetchingRedeem: false,
  redeem: null,
  err: null
})

export const initPoint = (state: Object) => state.merge({
  point: null
})

export const initWishlist = (state: Object) => state.merge({
  wishlist: null,
  fetchingWishlist: false,
  errWishlist: null,
  successWishlist: false
})

export const userDeviceTokenSave = (state: Object, { data }) => state.merge({
  deviceToken: data
})

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.USER_SUCCESS]: success,
  [Types.USER_REQUEST]: request,
  [Types.USER_CHECK_POINT_SUCCESS]: pointSuccess,
  [Types.USER_CHECK_POINT_REQUEST]: requestPoint,
  [Types.USER_CHECK_POINT_FAILURE]: pointFailure,
  [Types.USER_REDEEM_POINT_SUCCESS]: redeemSuccess,
  [Types.USER_REDEEM_POINT_REQUEST]: requestRedeem,
  [Types.USER_REDEEM_POINT_FAILURE]: redeemFailure,
  [Types.USER_VOUCHER_SUCCESS]: voucherSuccess,
  [Types.USER_VOUCHER_REQUEST]: requestVoucher,
  [Types.USER_VOUCHER_FAILURE]: voucherFailure,
  [Types.USER_TOGGLE_WISHLIST_SUCCESS]: toggleWishlistSuccess,
  [Types.USER_TOGGLE_WISHLIST_REQUEST]: requestToggleWishlist,
  [Types.USER_TOGGLE_WISHLIST_FAILURE]: toggleWishlistFailure,
  [Types.USER_GET_WISHLIST_SUCCESS]: wishlistSuccess,
  [Types.USER_GET_WISHLIST_REQUEST]: requestWishlist,
  [Types.USER_GET_ALL_WISHLIST_REQUEST]: requestWishlist,
  [Types.USER_GET_WISHLIST_FAILURE]: wishlistFailure,
  [Types.USER_REVIEW_SUCCESS]: reviewSuccess,
  [Types.USER_REVIEW_REQUEST]: requestReview,
  [Types.USER_REVIEW_FAILURE]: reviewFailure,
  [Types.USER_UPDATE]: update,
  [Types.USER_UPDATE_SUCCESS]: updateSuccess,
  [Types.USER_FAILURE]: failure,
  [Types.USER_INIT_REDEEM]: initRedeem,
  [Types.USER_INIT]: init,
  [Types.USER_INIT_USER]: initUser,
  [Types.USER_INIT_POINT]: initPoint,
  [Types.USER_INIT_WISHLIST]: initWishlist,
  [Types.USER_DEVICE_TOKEN_SAVE]: userDeviceTokenSave
})
