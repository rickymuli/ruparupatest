import { all, fork } from 'redux-saga/effects'
import API from '../Services/Api'

/* ------------- Sagas ------------- */

import { fetchInspirationsServer, fetchInspirationsPromoRequest } from './InspirationSagas'
import {
  provinceData,
  cityData,
  kecamatanData,
  getExploreByCategory,
  getBankInstallment,
  getBankInstallmentServer,
  newsletterSubscribe,
  getFavoriteCategory,
  getExpressDelivery,
  getVerifyStatic,
  getVerifyStaticTahu,
  getSubcategory,
  getExploreByTrending,
  getPromoBank,
  getPromoBanner,
  getCustom,
  getStoreData,
  getVerifyMarketplaceAcquisition,
  getStaticUrl,
  sendCrashUserFeedback
} from './MiscSagas'
import { createCart, fetchCart, updateCart, deleteCartRequest, deleteCartItem, fetchCartType } from './CartSagas'
import { createLog, popularSearch } from './LogSagas'
import { searchProductByKeyword, searchProductByKeywordAndUrlKey, getSearchPageRedirect } from './SearchSagas'
import { fetchCategoryDetailServer, fetchCategoryDetail, fetchCategoryDetailAndProduct } from './CategorySagas'
import {
  fetchProductByCategoryServer,
  fetchProductByCategory,
  fetchProductDetailServer,
  fetchProductDetail,
  fetchStockServer,
  fetchStock,
  fetchProductByKeywordServer,
  fetchProductByKeyword,
  fetchCanDelivery,
  fetchGetMaxStock,
  fetchGetPromoVoucherDetail,
  fetchGetRelatedProducts,
  fetchProductByGtinServer,
  fetchRemainingVoucher,
  fetchProductScan,
  fetchProductRecomendationNewRetail
} from './ProductSagas'
import { getNavigationFilter } from './NavigationFilterSagas'
import { productLastSeen, productLastSeenUpdate } from './ProductLastSeenSagas'
import { login, logout, changePassword, forgot, loginCheckout, reset, setDeviceToken, fetchAuthReset, autoLogin } from './AuthSagas'
import { fetchOrderDetail, orderList, orderStatusUpdate } from './OrderSagas'
import { userData, userUpdate, userGetPoint, userRedeemPoint, userGetVoucherList, toggleWishlist, getWishlist, getAllWishlist } from './UserSagas'
import { register, registerAce } from './RegisterSagas'
import { addressData, createAddress, oneAddressData, primaryAddress, deleteAddress } from './AddressSagas'
import { fetchStaticServer } from './StaticSagas'
import { sendEmailB2B } from './EmailSagas'
import { getSearchHistory, saveSearchHistory } from './SearchHistorySagas'
import { getNewsFeedRequest, addNewsFeedRequest } from './NewsFeedSagas'
import { fetchCheckOtp, fetchGenerateOtp, fetchValidateOtp, fetchChoicesOtp, fetchUpdatePhoneOtp, fetchForgotPasswordOtp, otpAce, validateOtpAce, verifyPhoneAce } from './OtpSagas'
import { getlocationByIp, getlocationByLonglat } from './LocationSagas'
import { persistsListen } from './PersistsSagas'

import { fetchTahu, fetchTahuStatic, fetchTahuCmsBlock, fetchExploreByTrending, fetchExploreByCategory } from './TahuSagas'
import { fetchProductByFilter, fetchProductBySort, fetchMoreProduct } from './ProductHandlerSagas'
import { checkStoreDataListen } from './StoreDataSagas'

import { getStoreNewRetail, retrieveStoreNewRetail } from './StoreNewRetailSagas'
import { fetchReviewRating, sortReviewRating, likeReview, countReview, fetchProductReview, fetchReviewTags, insertProductReview, fetchServiceReview, insertServiceReview, fetchProductReviewByInvoice } from './ReviewRatingSagas'
import { deleteImage } from './ReviewHandlerSagas'
import { getOrderData, getUserAddress, getReasonDatas, getReturnMethods, uploadImageRequest, getEstimationRequest, submitReturnRequest, getReturnStatus, editRefundRequest } from './ReturnRefundSagas'
import { uploadImage } from './ReturnRefundHandlerSagas'
import { getBankAccount, getBankData, getOtpRefund, createRefund } from './VoucherSagas'
import { retrieveMembershipApiData, loginAce } from './MembershipSagas'
import { fetchStoreLocation } from './StoreLocationSagas'
import { getInvoiceConfirmation, customerConfirmation, deliveryConfirmation } from './ReorderSagas'

/* ------------- Data -------------- */
import GetLocalData from '../Services/GetLocalData'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = API.create()
const storeData = GetLocalData.getStoreData
const getStoreNewRetailData = GetLocalData.getStoreNewRetailData
const productLastSeenData = GetLocalData.getProductLastSeen
// const bankInstallment = GetLocalData.getBankInstallment
const cartId = GetLocalData.getCartId
const token = GetLocalData.getToken
const algoliaUserToken = GetLocalData.getAlgoliaAnonymousToken

function * ReturnRefundHandlerSagas () {
  yield all([
    fork(uploadImage, api)
  ])
}

function * returnRefundSaga () {
  yield all([
    fork(getOrderData, api),
    fork(getUserAddress, api),
    fork(getReasonDatas, api),
    fork(getReturnMethods, api),
    fork(uploadImageRequest, api),
    fork(getEstimationRequest, api),
    fork(submitReturnRequest, api),
    fork(getReturnStatus, api),
    fork(editRefundRequest, api)
  ])
}

function * productHandlerSaga () {
  yield all([
    fork(fetchProductBySort, api),
    fork(fetchProductByFilter, api),
    fork(fetchMoreProduct, api)
  ])
}

function * reviewHandlerSaga () {
  yield all([
    fork(deleteImage)
  ])
}

function * tahuSaga () {
  yield all([
    fork(fetchTahu, api),
    fork(fetchTahuStatic, api),
    fork(fetchTahuCmsBlock, api),
    fork(fetchExploreByTrending, api),
    fork(fetchExploreByCategory, api)
  ])
}

function * voucherSaga () {
  yield all([
    fork(getBankAccount, api, token),
    fork(getBankData, api),
    fork(getOtpRefund, api, token),
    fork(createRefund, api, token)
  ])
}

function * productSaga () {
  yield all([
    fork(fetchProductByCategoryServer, api, storeData),
    fork(fetchProductByCategory, api, storeData),
    fork(fetchProductDetailServer, api, getStoreNewRetailData),
    fork(fetchProductDetail, api, getStoreNewRetailData),
    fork(searchProductByKeyword, api, storeData, algoliaUserToken),
    fork(searchProductByKeywordAndUrlKey, api, storeData),
    fork(fetchProductByKeywordServer, api, storeData),
    fork(fetchProductByKeyword, api, storeData),
    fork(fetchGetRelatedProducts, api, storeData),
    fork(fetchProductByGtinServer, api),
    fork(productLastSeenUpdate, productLastSeenData),
    fork(productLastSeen, productLastSeenData),
    fork(fetchProductScan, api, getStoreNewRetailData),
    fork(fetchProductRecomendationNewRetail, api, token)
  ])
}

function * reorderSaga () {
  yield all([
    fork(getInvoiceConfirmation, api, token),
    fork(customerConfirmation, api, token),
    fork(deliveryConfirmation, api, token)
  ])
}

function * reviewRatingSaga () {
  yield all([
    fork(fetchReviewRating, api, token),
    fork(sortReviewRating, api),
    fork(likeReview, api, token),
    fork(countReview, api, token),
    fork(fetchProductReview, api, token),
    fork(fetchReviewTags, api),
    fork(insertProductReview, api, token),
    fork(fetchServiceReview, api, token),
    fork(insertServiceReview, api, token),
    fork(fetchProductReviewByInvoice, api, token)
  ])
}

function * ClientSagas () {
  yield all([
    fork(login, api, cartId, token, getStoreNewRetailData),
    fork(loginCheckout, api, token, cartId, getStoreNewRetailData),
    fork(logout, api),
    fork(autoLogin, api),
    fork(forgot, api),
    fork(reset, api),
    fork(fetchOrderDetail, api),
    fork(orderList, api, token),
    fork(orderStatusUpdate, api),
    fork(changePassword, api, token),
    fork(fetchInspirationsServer, api),
    fork(fetchInspirationsPromoRequest, api),
    fork(getExploreByCategory, api),
    fork(createLog, api),
    fork(popularSearch, api, algoliaUserToken),
    fork(getSearchPageRedirect, api),
    fork(fetchCategoryDetailServer, api),
    fork(fetchCategoryDetail, api, storeData),
    fork(fetchStockServer, api, getStoreNewRetailData),
    fork(fetchStock, api, getStoreNewRetailData),
    fork(fetchCanDelivery, api, getStoreNewRetailData),
    fork(fetchGetMaxStock, api, getStoreNewRetailData),
    fork(getNavigationFilter, api),
    fork(getBankInstallmentServer, api),
    fork(getBankInstallment, api),
    fork(cityData, api),
    fork(register, api, cartId, getStoreNewRetailData),
    fork(registerAce, api, token),
    fork(loginAce, api, token),
    fork(provinceData, api),
    fork(kecamatanData, api),
    fork(fetchCart, api, cartId, token, getStoreNewRetailData),
    fork(createCart, api, cartId, token, getStoreNewRetailData),
    fork(updateCart, api, cartId, token, getStoreNewRetailData),
    fork(deleteCartRequest, api, cartId, token),
    fork(deleteCartItem, api, cartId),
    fork(userData, api, token),
    fork(userGetPoint, api, token),
    fork(userRedeemPoint, api, token),
    fork(userUpdate, api, token),
    fork(userGetVoucherList, api, token),
    fork(toggleWishlist, api, token, getStoreNewRetailData),
    fork(getWishlist, api, token, getStoreNewRetailData),
    fork(getAllWishlist, api, token, getStoreNewRetailData),
    fork(newsletterSubscribe, api),
    fork(createAddress, api, token),
    fork(addressData, api, token),
    fork(oneAddressData, api, token),
    fork(primaryAddress, api, token),
    fork(deleteAddress, api, token),
    fork(getFavoriteCategory, api),
    fork(getExpressDelivery, api),
    fork(getVerifyMarketplaceAcquisition, api),
    fork(getVerifyStatic, api),
    fork(getVerifyStaticTahu, api),
    fork(fetchStaticServer, api),
    fork(sendEmailB2B, api),
    fork(getSubcategory, api),
    fork(getExploreByTrending, api),
    fork(getPromoBank, api),
    fork(getPromoBanner, api),
    fork(getSearchHistory),
    fork(saveSearchHistory),
    fork(getNewsFeedRequest),
    fork(addNewsFeedRequest),
    fork(fetchGetPromoVoucherDetail, api),
    fork(setDeviceToken, api),
    fork(getCustom, api),
    fork(fetchRemainingVoucher, api),
    fork(checkStoreDataListen),
    fork(fetchCheckOtp, api),
    fork(fetchGenerateOtp, api),
    fork(fetchValidateOtp, api),
    fork(fetchChoicesOtp, api),
    fork(fetchUpdatePhoneOtp, api),
    fork(otpAce, api),
    fork(validateOtpAce, api),
    fork(verifyPhoneAce, api),
    fork(fetchAuthReset, api),
    fork(fetchForgotPasswordOtp, api),
    fork(persistsListen, api),
    fork(getlocationByIp, api),
    fork(getlocationByLonglat, api),
    fork(fetchCategoryDetailAndProduct, api),
    fork(getStoreNewRetail, getStoreNewRetailData),
    fork(retrieveStoreNewRetail, api, token),
    fork(getStoreData, api, token),
    fork(fetchCartType, api, cartId, token),
    fork(retrieveMembershipApiData, api, token),
    fork(fetchStoreLocation, api),
    fork(getStaticUrl, api),
    fork(sendCrashUserFeedback, api)
  ])
}

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    fork(productHandlerSaga),
    fork(tahuSaga),
    fork(productSaga),
    fork(ClientSagas),
    fork(reviewRatingSaga),
    fork(reviewHandlerSaga),
    fork(returnRefundSaga),
    fork(ReturnRefundHandlerSagas),
    fork(voucherSaga),
    fork(reorderSaga)
  ])
}
