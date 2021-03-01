// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  miscRequest: ['data'],
  miscResetAddress: null,
  miscProvinceRequest: ['id'],
  miscCityRequest: ['id'],
  miscKecamatanRequest: ['id'],
  miscProvinceSuccess: ['payload'],
  miscCitySuccess: ['payload'],
  miscKecamatanSuccess: ['payload'],
  miscProvinceFailure: ['err'],
  miscCityFailure: ['err'],
  miscKecamatanFailure: ['err'],
  miscFailure: ['err'],
  miscGetExploreByCategory: ['identifier'],
  miscGetExploreByCategorySuccess: ['payload'],
  miscGetExploreByCategoryFailure: ['err'],
  miscBankInstallmentServer: null,
  miscBankInstallmentRequest: null,
  miscBankInstallmentSuccess: ['payload'],
  miscBankInstallmentFailure: ['err'],
  miscExpressDeliveryRequest: ['id'],
  miscExpressDeliverySuccess: ['payload'],
  miscExpressDeliveryFailure: ['err'],
  miscGetFavoriteCategory: ['identifier'],
  miscGetFavoriteCategorySuccess: ['payload'],
  miscGetFavoriteCategoryFailure: ['err'],
  miscVerifyStaticRequest: ['data'],
  miscVerifyStaticSuccess: ['payload'],
  miscVerifyStaticFailure: ['err'],
  miscVerifyStaticInit: null,
  miscVerifyStaticTahuRequest: ['data'],
  miscVerifyStaticTahuSuccess: ['payload'],
  miscVerifyStaticTahuInit: null,
  miscSubcategoryRequest: ['identifier'], // this is for subcategory, level 2 and level 3
  miscSubcategorySuccess: ['payload'],
  miscSubcategoryFailure: ['err'],
  miscSubcategoryInit: null,
  miscGetExploreByTrending: ['identifier'],
  miscGetExploreByTrendingSuccess: ['payload'],
  miscGetExploreByTrendingFailure: ['err'],
  miscPromoBankRequest: ['identifier'],
  miscPromoBankSuccess: ['payload'],
  miscPromoBankFailure: ['err'],
  miscPromoBannerRequest: null,
  miscPromoBannerSuccess: ['data'],
  miscPromoBannerFailure: ['err'],
  miscGetCustomRequest: ['data'],
  miscGetCustomSuccess: ['data'],
  miscGetCustomFailure: ['err'],
  miscVerifyMarketplaceAcquisitionRequest: ['data'],
  miscVerifyMarketplaceAcquisitionSuccess: ['payload'],
  miscVerifyMarketplaceAcquisitionFailure: ['err'],
  miscGetStaticUrlRequest: null,
  miscGetStaticUrlSuccess: ['data'],
  miscGetStaticUrlFailure: ['err'],
  miscSendCrashUserFeedback: ['data']
})

export const MiscTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  fetchingFavoriteCategory: false,
  favoriteCategory: null,
  fetchingExploreByCategory: false,
  fetchingExpressDelivery: false,
  fetchingSubcategory: false,
  fetchingExploreByTrending: false,
  fetchingPromoBank: false,
  fetchingCity: false,
  fetchingKecamatan: false,
  fetchingVerifyMarketplaceAcquisition: false,
  fetchingStaticUrl: false,
  exploreByCategory: null,
  bankInstallment: null,
  province: null,
  city: null,
  kecamatan: null,
  expressDelivery: null,
  staticUrl: [],
  verifyStatic: null,
  verifyStaticTahu: null,
  verifyMarketplaceAcquisition: null,
  subcategory: null,
  exploreByTrending: null,
  promoBank: null,
  promoBanner: null,
  getCustom: null,
  err: null,
  errVerifyStatic: null,
  errStaticUrl: null
})

export const server = (state, { category }) => state

export const exploreByCategoryRequest = (state) => state.merge({ fetchingExploreByCategory: true, exploreByCategory: null })

export const getExploreByCategorySuccess = (state, { payload }) =>
  state.merge({
    fetchingExploreByCategory: false,
    exploreByCategory: payload
  })

export const getExploreByCategoryFailure = (state, { err }) =>
  state.merge({ fetchingExploreByCategory: false, err })

export const bankInstallmentRequest = (state) => state.merge({ fetching: true, bankInstallment: null })

export const bankInstallmentFailure = (state, { err }) =>
  state.merge({ fetching: false, err })

export const bankInstallmentSuccess = (state, { payload }) =>
  state.merge({
    fetching: false,
    bankInstallment: payload
  })

export const request = (state) => state.merge({ fetching: true })

export const success = (state, { payload }) =>
  state.merge({
    fetching: false,
    payload
  })

export const failure = (state, { err }) =>
  state.merge({ fetching: false, err })

export const provinceRequest = (state) => state.merge({ fetching: true, city: null, kecamatan: null })
export const kecamatanRequest = (state) => state.merge({ fetchingKecamatan: true })
export const cityRequest = (state) => state.merge({ fetchingCity: true, kecamatan: null })
export const expressDeliveryRequest = (state) => state.merge({ fetchingExpressDelivery: true })
export const favoriteCategoryRequest = (state) => state.merge({ fetchingFavoriteCategory: true, favoriteCategory: null })
export const subcategoryRequest = (state) => state.merge({ fetchingSubcategory: true, subcategory: null }) // subcategory lvl 2 and 3
export const verifyStaticRequest = (state) => state.merge({ fetching: true, verifyStatic: null })
export const verifyStaticTahuRequest = (state) => state.merge({ fetching: true, verifyStaticTahu: null })
export const exploreByTrendingRequest = (state) => state.merge({ fetchingExploreByTrending: true, exploreByTrending: null })
export const promoBankRequest = (state) => state.merge({ fetchingPromoBank: true, promoBank: null })
export const verifyMarketplaceAcquisitionRequest = (state) => state.merge({ fetchingVerifyMarketplaceAcquisition: true, verifyMarketplaceAcquisition: null })

export const subcategoryInit = (state) =>
  state.merge({ fetchingSubcategory: false, subcategory: null })

export const verifyStaticInit = (state) =>
  state.merge({ verifyStatic: null, errVerifyStatic: null })

export const verifyStaticTahuInit = (state) =>
  state.merge({ verifyStaticTahu: null })

export const kecamatanSuccess = (state, { payload }) =>
  state.merge({
    fetchingKecamatan: false,
    kecamatan: payload
  })
export const citySuccess = (state, { payload }) =>
  state.merge({
    fetchingCity: false,
    city: payload
  })
export const provinceSuccess = (state, { payload }) =>
  state.merge({
    fetching: false,
    province: payload
  })
export const expressDeliverySuccess = (state, { payload }) =>
  state.merge({
    fetchingExpressDelivery: false,
    expressDelivery: payload
  })

export const verifyMarketplaceAcquisitionSuccess = (state, { payload }) =>
  state.merge({
    fetchingVerifyMarketplaceAcquisition: false,
    verifyMarketplaceAcquisition: payload
  })

export const getFavoriteCategorySuccess = (state, { payload }) =>
  state.merge({
    fetchingFavoriteCategory: false,
    favoriteCategory: payload
  })

export const verifyStaticSuccess = (state, { payload }) =>
  state.merge({
    fetching: false,
    verifyStatic: payload
  })

export const verifyStaticTahuSuccess = (state, { payload }) =>
  state.merge({
    fetching: false,
    verifyStaticTahu: payload
  })

export const subcategorySuccess = (state, { payload }) =>
  state.merge({
    fetchingSubcategory: false,
    subcategory: payload
  })

export const getExploreByTrendingSuccess = (state, { payload }) =>
  state.merge({
    fetchingExploreByTrending: false,
    exploreByTrending: payload
  })

export const promoBankSuccess = (state, { payload }) =>
  state.merge({
    fetchingPromoBank: false,
    promoBank: payload
  })

export const promoBannerSuccess = (state, { data }) =>
  state.merge({
    promoBanner: data
  })

export const getCustomSuccess = (state, { data }) =>
  state.merge({
    getCustom: data
  })

export const getFavoriteCategoryFailure = (state, { err }) =>
  state.merge({ fetchingFavoriteCategory: false, err })

export const cityFailure = (state, { err }) =>
  state.merge({ fetchingCity: false, err })

export const kecamatanFailure = (state, { err }) =>
  state.merge({ fetchingKecamatan: false, err })

export const provinceFailure = (state, { err }) =>
  state.merge({ fetching: false, err })

export const expressDeliveryFailure = (state, { err }) =>
  state.merge({ fetchingExpressDelivery: false, err })

export const verifyStaticFailure = (state, { err }) =>
  state.merge({
    fetching: false,
    errVerifyStatic: err
  })

export const subcategoryFailure = (state, { err }) =>
  state.merge({ fetchingSubcategory: false, subcategory: null, err })

export const getExploreByTrendingFailure = (state, { err }) =>
  state.merge({ fetchingExploreByTrending: false, err })

export const promoBankFailure = (state, { err }) =>
  state.merge({ fetchingPromoBank: false, promoBank: null, err })

export const verifyMarketplaceAcquisitionFailure = (state, { err }) =>
  state.merge({ fetchingVerifyMarketplaceAcquisition: false, err })

export const resetAddress = (state, { err }) =>
  state.merge({
    city: null,
    kecamatan: null
  })

export const staticUrlRequest = (state) => state.merge({
  fetchingStaticUrl: true,
  errStaticUrl: null
})

export const staticUrlSuccess = (state, { data }) => state.merge({
  fetchingStaticUrl: false,
  staticUrl: data
})

export const staticUrlFailure = (state, { err }) => state.merge({
  fetchingStaticUrl: false,
  errStaticUrl: err
})

export const reducer = createReducer(INITIAL_STATE, {
  [Types.MISC_GET_EXPLORE_BY_CATEGORY]: exploreByCategoryRequest,
  [Types.MISC_GET_EXPLORE_BY_CATEGORY_SUCCESS]: getExploreByCategorySuccess,
  [Types.MISC_GET_EXPLORE_BY_CATEGORY_FAILURE]: getExploreByCategoryFailure,
  [Types.MISC_BANK_INSTALLMENT_SERVER]: server,
  [Types.MISC_BANK_INSTALLMENT_REQUEST]: bankInstallmentRequest,
  [Types.MISC_BANK_INSTALLMENT_SUCCESS]: bankInstallmentSuccess,
  [Types.MISC_BANK_INSTALLMENT_FAILURE]: bankInstallmentFailure,
  [Types.MISC_RESET_ADDRESS]: resetAddress,
  [Types.MISC_PROVINCE_REQUEST]: provinceRequest,
  [Types.MISC_CITY_REQUEST]: cityRequest,
  [Types.MISC_KECAMATAN_REQUEST]: kecamatanRequest,
  [Types.MISC_PROVINCE_SUCCESS]: provinceSuccess,
  [Types.MISC_CITY_SUCCESS]: citySuccess,
  [Types.MISC_KECAMATAN_SUCCESS]: kecamatanSuccess,
  [Types.MISC_PROVINCE_FAILURE]: provinceFailure,
  [Types.MISC_CITY_FAILURE]: cityFailure,
  [Types.MISC_KECAMATAN_FAILURE]: kecamatanFailure,
  [Types.MISC_EXPRESS_DELIVERY_REQUEST]: expressDeliveryRequest,
  [Types.MISC_EXPRESS_DELIVERY_SUCCESS]: expressDeliverySuccess,
  [Types.MISC_EXPRESS_DELIVERY_FAILURE]: expressDeliveryFailure,
  [Types.MISC_GET_FAVORITE_CATEGORY]: favoriteCategoryRequest,
  [Types.MISC_GET_FAVORITE_CATEGORY_SUCCESS]: getFavoriteCategorySuccess,
  [Types.MISC_GET_FAVORITE_CATEGORY_FAILURE]: getFavoriteCategoryFailure,
  [Types.MISC_VERIFY_STATIC_TAHU_REQUEST]: verifyStaticTahuRequest,
  [Types.MISC_VERIFY_STATIC_TAHU_SUCCESS]: verifyStaticTahuSuccess,
  [Types.MISC_VERIFY_STATIC_TAHU_INIT]: verifyStaticTahuInit,
  [Types.MISC_VERIFY_STATIC_REQUEST]: verifyStaticRequest,
  [Types.MISC_VERIFY_STATIC_SUCCESS]: verifyStaticSuccess,
  [Types.MISC_VERIFY_STATIC_FAILURE]: verifyStaticFailure,
  [Types.MISC_VERIFY_STATIC_INIT]: verifyStaticInit,
  [Types.MISC_SUBCATEGORY_REQUEST]: subcategoryRequest,
  [Types.MISC_SUBCATEGORY_SUCCESS]: subcategorySuccess,
  [Types.MISC_SUBCATEGORY_FAILURE]: subcategoryFailure,
  [Types.MISC_SUBCATEGORY_INIT]: subcategoryInit,
  [Types.MISC_GET_EXPLORE_BY_TRENDING]: exploreByTrendingRequest,
  [Types.MISC_GET_EXPLORE_BY_TRENDING_SUCCESS]: getExploreByTrendingSuccess,
  [Types.MISC_GET_EXPLORE_BY_TRENDING_FAILURE]: getExploreByTrendingFailure,
  [Types.MISC_PROMO_BANK_REQUEST]: promoBankRequest,
  [Types.MISC_PROMO_BANK_SUCCESS]: promoBankSuccess,
  [Types.MISC_PROMO_BANK_FAILURE]: promoBankFailure,
  [Types.MISC_PROMO_BANNER_REQUEST]: request,
  [Types.MISC_PROMO_BANNER_SUCCESS]: promoBannerSuccess,
  [Types.MISC_PROMO_BANNER_FAILURE]: failure,
  [Types.MISC_GET_CUSTOM_REQUEST]: request,
  [Types.MISC_GET_CUSTOM_SUCCESS]: getCustomSuccess,
  [Types.MISC_GET_CUSTOM_FAILURE]: failure,
  [Types.MISC_VERIFY_MARKETPLACE_ACQUISITION_REQUEST]: verifyMarketplaceAcquisitionRequest,
  [Types.MISC_VERIFY_MARKETPLACE_ACQUISITION_SUCCESS]: verifyMarketplaceAcquisitionSuccess,
  [Types.MISC_VERIFY_MARKETPLACE_ACQUISITION_FAILURE]: verifyMarketplaceAcquisitionFailure,
  [Types.MISC_GET_STATIC_URL_REQUEST]: staticUrlRequest,
  [Types.MISC_GET_STATIC_URL_SUCCESS]: staticUrlSuccess,
  [Types.MISC_GET_STATIC_URL_FAILURE]: staticUrlFailure,
  [Types.MISC_SEND_CRASH_USER_FEEDBACK]: server
})
