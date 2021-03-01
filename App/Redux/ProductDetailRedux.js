// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  productDetailRequest: ['urlKey', 'isScanned'],
  productDetailSuccess: ['payload'],
  productDetailServer: ['urlKey', 'isScanned'],
  productDetailFailure: ['err'],
  productDetailStockServer: ['sku'],
  productDetailStockRequest: ['sku', 'isScanned'],
  productDetailStockSuccess: ['stock'],
  productDetailStockFailure: ['err'],
  productDetailCanDeliveryRequest: ['sku', 'district', 'qty', 'isScanned'],
  productDetailCanDeliverySuccess: ['canDelivery'],
  productDetailCanDeliveryFailure: ['err'],
  productDetailGetMaxStockRequest: ['sku', 'district', 'isScanned'],
  productDetailGetMaxStockSuccess: ['maxStock'],
  productDetailGetMaxStockFailure: ['err'],
  productDetailGetRelatedProductsRequest: ['urlKey', 'storeCode'],
  productDetailGetRelatedProductsSuccess: ['voucherDetail'],
  productDetailGetRelatedProductsFailure: ['err'],
  productDetailGetPromoVoucherDetailRequest: ['voucherCode'],
  productDetailGetPromoVoucherDetailSuccess: ['data'],
  productDetailGetPromoVoucherDetailFailure: ['err'],
  productDetailInit: null,
  voucherRemainingRequest: ['voucherCode'],
  voucherRemainingSuccess: ['data'],
  voucherRemainingFailure: ['err']
})

export const ProductDetailTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  fetchingMaxStock: false,
  fetchingStock: false,
  fetchingRelated: false,
  fetchingCanDelivery: false,
  fetchingVoucher: false,
  voucherDetail: null,
  payload: null,
  data: null,
  stock: null,
  canDelivery: null,
  maxStock: null,
  err: null,
  relatedProduct: null
})

/* ------------- Reducers ------------- */
// special for SSR
export const server = (state: Object, { sku }: Object) => state
// we're attempting to fetch
export const request = (state: Object, { sku }: Object) => state.merge({ fetching: true, err: null })

// we've successfully fetch data
export const success = (state: Object, { payload }: Object) =>
  state.merge({
    fetching: false,
    err: null,
    payload
  })

// init states
export const initStates = (state) =>
  state.merge({
    fetching: false,
    fetchingMaxStock: false,
    fetchingStock: false,
    fetchingRelated: false,
    fetchingCanDelivery: false,
    fetchingVoucher: false,
    fetchingRemainingVoucher: false,
    voucherDetail: null,
    remainingVoucher: null,
    payload: null,
    data: null,
    stock: null,
    canDelivery: null,
    maxStock: null,
    err: null,
    voucherRemainingErr: null,
    relatedProduct: null
  })

// we've had a problem fetch data
export const failure = (state: Object, { err }: Object) => state.merge({ fetching: false, err })

// get stock request
export const stockRequest = (state: Object, { sku }: Object) => state.merge({ fetchingStock: true, err: null })

export const stockSuccess = (state: Object, { stock }: Object) => state.merge({ fetchingStock: false, stock, err: null })

export const stockFailure = (state: Object, { err }: Object) => state.merge({ fetchingStock: false, stock: null, err })

// can delivery request
export const canDeliveryRequest = (state: Object, { sku }: Object) => state.merge({ fetchingCanDelivery: true, canDelivery: null, err: null })

export const canDeliverySuccess = (state: Object, { canDelivery }: Object) => state.merge({ fetchingCanDelivery: false, canDelivery, err: null })

export const canDeliveryFailure = (state: Object, { err }: Object) => state.merge({ fetchingCanDelivery: false, canDelivery: { can_delivery: false }, err })

// get max qty request
export const getMaxStockRequest = (state: Object, { sku }: Object) => state.merge({ fetchingMaxStock: true, maxStock: null, err: null })

export const getMaxStockSuccess = (state: Object, { maxStock }: Object) => state.merge({ fetchingMaxStock: false, maxStock, err: null })

export const getMaxStockFailure = (state: Object, { err }: Object) => state.merge({ fetchingMaxStock: false, maxStock: { max_qty: false }, err })

// get voucher request
export const getPromoVoucherDetailRequest = (state: Object, { voucherCode }: Object) => state.merge({ fetchingVoucher: true, err: null })

export const getPromoVoucherDetailSuccess = (state: Object, { data }: Object) => state.merge({ fetchingVoucher: false, voucherDetail: data, err: null })

export const getPromoVoucherDetailFailure = (state: Object, { err }: Object) => state.merge({ fetchingVoucher: false, voucherDetail: null, err })

// get related products request
export const getRelatedProductsRequest = (state: Object, { urlKey }: Object) => state.merge({ fetchingRelated: true, relatedProduct: null, err: null })

export const getRelatedProductsSuccess = (state: Object, { data }: Object) => state.merge({ fetchingRelated: false, relatedProduct: data, err: null })

export const getRelatedProductsFailure = (state: Object, { err }: Object) => state.merge({ fetchingRelated: false, relatedProduct: null, err })

export const voucherRemainingRequest = (state) =>
  state.merge({ fetchingRemainingVoucher: true, remainingVoucher: null })

export const voucherRemainingSuccess = (state, { data }) =>
  state.merge({ fetchingRemainingVoucher: false, remainingVoucher: data })

export const voucherRemainingFailure = (state, { err }) =>
  state.merge({ fetchingRemainingVoucher: false, voucherRemainingErr: err })
/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.PRODUCT_DETAIL_SUCCESS]: success,
  [Types.PRODUCT_DETAIL_SERVER]: server,
  [Types.PRODUCT_DETAIL_REQUEST]: request,
  [Types.PRODUCT_DETAIL_FAILURE]: failure,
  [Types.PRODUCT_DETAIL_STOCK_SERVER]: server,
  [Types.PRODUCT_DETAIL_STOCK_REQUEST]: stockRequest,
  [Types.PRODUCT_DETAIL_STOCK_SUCCESS]: stockSuccess,
  [Types.PRODUCT_DETAIL_STOCK_FAILURE]: stockFailure,
  [Types.PRODUCT_DETAIL_CAN_DELIVERY_REQUEST]: canDeliveryRequest,
  [Types.PRODUCT_DETAIL_CAN_DELIVERY_SUCCESS]: canDeliverySuccess,
  [Types.PRODUCT_DETAIL_CAN_DELIVERY_FAILURE]: canDeliveryFailure,
  [Types.PRODUCT_DETAIL_GET_MAX_STOCK_REQUEST]: getMaxStockRequest,
  [Types.PRODUCT_DETAIL_GET_MAX_STOCK_SUCCESS]: getMaxStockSuccess,
  [Types.PRODUCT_DETAIL_GET_MAX_STOCK_FAILURE]: getMaxStockFailure,
  [Types.PRODUCT_DETAIL_GET_RELATED_PRODUCTS_REQUEST]: getRelatedProductsRequest,
  [Types.PRODUCT_DETAIL_GET_RELATED_PRODUCTS_SUCCESS]: getRelatedProductsSuccess,
  [Types.PRODUCT_DETAIL_GET_RELATED_PRODUCTS_FAILURE]: getRelatedProductsFailure,
  [Types.PRODUCT_DETAIL_GET_PROMO_VOUCHER_DETAIL_REQUEST]: getPromoVoucherDetailRequest,
  [Types.PRODUCT_DETAIL_GET_PROMO_VOUCHER_DETAIL_SUCCESS]: getPromoVoucherDetailSuccess,
  [Types.PRODUCT_DETAIL_GET_PROMO_VOUCHER_DETAIL_FAILURE]: getPromoVoucherDetailFailure,
  [Types.PRODUCT_DETAIL_INIT]: initStates,
  [Types.VOUCHER_REMAINING_REQUEST]: voucherRemainingRequest,
  [Types.VOUCHER_REMAINING_SUCCESS]: voucherRemainingSuccess,
  [Types.VOUCHER_REMAINING_FAILURE]: voucherRemainingFailure
})
