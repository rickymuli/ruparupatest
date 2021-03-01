// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  productReset: null,
  productRequest: ['companyCode'],
  productSuccess: ['payload'],
  productServer: ['category', 'keyword', 'from', 'size', 'sort', 'brands', 'colors', 'minimumPrice', 'maximumPrice', 'storeCode'],
  productFailure: ['err'],
  productByKeywordServer: ['keyword', 'from', 'size', 'sort', 'brands', 'colors', 'minimumPrice', 'maximumPrice', 'storeCode'],
  productByKeywordRequest: null,
  productByGtinServer: ['gtin'],
  productBestDealRequest: ['typeAnniv', 'category', 'size', 'keyword', 'from', 'sort', 'brands', 'colors', 'minimumPrice', 'maximumPrice', 'storeCode'],
  productClearanceRequest: ['typeAnniv', 'category', 'size', 'keyword', 'from', 'sort', 'brands', 'colors', 'minimumPrice', 'maximumPrice', 'storeCode'],
  productBestDealSuccess: ['payload'],
  productClearanceSuccess: ['payload'],
  productBestDealFailure: ['err'],
  productClearanceFailure: ['err'],
  productSaveJourney: ['data'],
  productScanRequest: ['data'],
  productScanSuccess: ['data'],
  productScanFailure: ['err'],
  productRecomendationNewRetailRequest: ['data'],
  productRecomendationNewRetailSuccess: ['data'],
  productRecomendationNewRetailFailure: ['err']
})

export const ProductTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  productScanData: null,
  productScanFetching: false,
  productScanErr: null,
  productRecomendation: null,
  fetchingProductRecomendation: false,
  productRecomendationErr: null,
  fetching: false,
  payload: null,
  data: null,
  total: null,
  bestDealPayload: null,
  bestDealPayloadTotal: null,
  clearanceSellPayload: null,
  clearanceSellPayloadTotal: null,
  productJourney: null,
  err: null
})

/* ------------- Reducers ------------- */
// special for SSR
export const server = (state: Object, { category, from }: Object) => state
// we're attempting to fetch
export const request = (state, { category, from }) => state.merge({ fetching: true, payload: null, err: null })

export const bestDealRequest = (state: Object, { category, from }: Object) => state.merge({ fetching: true, bestDealPayload: null })

export const clearanceSellRequest = (state: Object, { category, from }: Object) => state.merge({ fetching: true, clearanceSellPayload: null })

export const reset = (state, { category, from }) => state.merge({ fetching: false, payload: null, err: null })

// we've successfully fetch data
export const success = (state: Object, { payload }: Object) =>
  state.merge({
    fetching: false,
    payload: payload.data || [],
    total: payload.total || 0,
    data: null,
    err: null
  })

export const bestDealSuccess = (state: Object, { payload }: Object) =>
  state.merge({
    fetching: false,
    bestDealPayload: payload.data || [],
    bestDealPayloadTotal: payload.total || 0
  })

export const clearanceSuccess = (state: Object, { payload }: Object) =>
  state.merge({
    fetching: false,
    clearanceSellPayload: payload.data || [],
    clearanceSellPayloadTotal: payload.total || 0
  })

export const failure = (state: Object, { err }: any) =>
  state.merge({ fetching: false, err })

// we've had a problem fetch data
export const productSaveJourney = (state: Object, { data }: Object) =>
  state.merge({ productJourney: data })

export const productScanFailure = (state: Object, { err }: any) => state.merge({ productScanFetching: false, productScanErr: err, productScanData: null })
export const productScanRequest = (state) => state.merge({ productScanFetching: true, productScanErr: null, productScanData: null })
export const productScanSuccess = (state: Object, { data }: Object) => state.merge({ productScanFetching: false, productScanData: data })

export const productRecomendationNewRetailFailure = (state: Object, { err }: any) => state.merge({ fetchingProductRecomendation: false, productRecomendationErr: err, productRecomendation: null })
export const productRecomendationNewRetailRequest = (state) => state.merge({ fetchingProductRecomendation: true, productRecomendationErr: null, productRecomendation: null })
export const productRecomendationNewRetailSuccess = (state: Object, { data }: Object) => state.merge({ fetchingProductRecomendation: false, productRecomendation: data })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.PRODUCT_RESET]: reset,
  [Types.PRODUCT_SUCCESS]: success,
  [Types.PRODUCT_SERVER]: server,
  [Types.PRODUCT_REQUEST]: request,
  [Types.PRODUCT_FAILURE]: failure,
  [Types.PRODUCT_SCAN_SUCCESS]: productScanSuccess,
  [Types.PRODUCT_SCAN_REQUEST]: productScanRequest,
  [Types.PRODUCT_SCAN_FAILURE]: productScanFailure,
  [Types.PRODUCT_BY_KEYWORD_SERVER]: server,
  [Types.PRODUCT_BY_KEYWORD_REQUEST]: request,
  [Types.PRODUCT_BY_GTIN_SERVER]: server,
  [Types.PRODUCT_BEST_DEAL_REQUEST]: bestDealRequest,
  [Types.PRODUCT_BEST_DEAL_SUCCESS]: bestDealSuccess,
  [Types.PRODUCT_BEST_DEAL_FAILURE]: failure,
  [Types.PRODUCT_CLEARANCE_REQUEST]: clearanceSellRequest,
  [Types.PRODUCT_CLEARANCE_SUCCESS]: clearanceSuccess,
  [Types.PRODUCT_CLEARANCE_FAILURE]: failure,
  [Types.PRODUCT_SAVE_JOURNEY]: productSaveJourney,
  [Types.PRODUCT_RECOMENDATION_NEW_RETAIL_SUCCESS]: productRecomendationNewRetailSuccess,
  [Types.PRODUCT_RECOMENDATION_NEW_RETAIL_REQUEST]: productRecomendationNewRetailRequest,
  [Types.PRODUCT_RECOMENDATION_NEW_RETAIL_FAILURE]: productRecomendationNewRetailFailure
})
