import { take, call, put, fork, select } from 'redux-saga/effects'
import { END } from 'redux-saga'
import ProductActions, { ProductTypes } from '../Redux/ProductRedux'
import ProductDetailActions, { ProductDetailTypes } from '../Redux/ProductDetailRedux'
import ProductHandlerActions from '../Redux/ProductHandler'
import isEmpty from 'lodash/isEmpty'
import flatten from 'lodash/flatten'

export const getUser = (state) => state.auth
export const getProduct = (state) => state.product
export const getSearch = (state) => state.search
export const getCategoryDetail = (state) => state.categoryDetail
export const getProductHandler = (state) => state.productHandler

// action taker
export const fetchProductByCategoryServer = function * (api, storeNewRetailData) {
  let action = yield take(ProductTypes.PRODUCT_SERVER)
  while (action !== END) {
    yield fork(fetchProductByCategoryAPI, api, storeNewRetailData, action)
    action = yield take(ProductTypes.PRODUCT_SERVER)
  }
}

export const fetchProductByCategory = function * (api, storeNewRetailData) {
  let action = yield take(ProductTypes.PRODUCT_REQUEST)
  while (action !== END) {
    yield fork(fetchProductByCategoryAPI, api, storeNewRetailData, action)
    action = yield take(ProductTypes.PRODUCT_REQUEST)
  }
}

export const fetchProductScan = function * (api, storeNewRetailData) {
  let action = yield take(ProductTypes.PRODUCT_SCAN_REQUEST)
  while (action !== END) {
    yield fork(fetchProductScanAPI, api, storeNewRetailData, action)
    action = yield take(ProductTypes.PRODUCT_SCAN_REQUEST)
  }
}

export const fetchProductRecomendationNewRetail = function * (api, token) {
  let action = yield take(ProductTypes.PRODUCT_RECOMENDATION_NEW_RETAIL_REQUEST)
  while (action !== END) {
    yield fork(fetchProductRecomendationNewRetailAPI, api, token, action)
    action = yield take(ProductTypes.PRODUCT_RECOMENDATION_NEW_RETAIL_REQUEST)
  }
}

// Anniversary only

// export const fetchProductBestDeal = function* (api) {
//   let action = yield take(ProductTypes.PRODUCT_BEST_DEAL_REQUEST)
//   while (action !== END) {
//     yield fork(fetchProductAnniversaryAPI, api, action)
//     action = yield take(ProductTypes.PRODUCT_BEST_DEAL_REQUEST)
//   }
// }

// export const fetchProductClearance = function* (api) {
//   let action = yield take(ProductTypes.PRODUCT_CLEARANCE_REQUEST)
//   while (action !== END) {
//     yield fork(fetchProductAnniversaryAPI, api, action)
//     action = yield take(ProductTypes.PRODUCT_CLEARANCE_REQUEST)
//   }
// }

// export function* fetchProductAnniversaryAPI (api, { typeAnniv, category, keyword, from, size, sort, brands, colors, minimumPrice, maximumPrice }) {
//   try {
//     // get lower and upper price bound
//     const response = yield call(api.getProductByCategory, category, keyword, from, size, sort, brands, colors, minimumPrice, maximumPrice)
//     if (response.ok) {
//       if (typeAnniv === 'best-deals') {
//         yield put(ProductActions.productBestDealSuccess(response.data))
//       } else {
//         yield put(ProductActions.productClearanceSuccess(response.data))
//       }
//     } else {
//       yield put(ProductActions.productBestDealFailure('Maaf, produk yang Anda cari tidak ditemukan'))
//       yield put(ProductActions.productClearanceFailure('Maaf, produk yang Anda cari tidak ditemukan'))
//     }
//   } catch (e) {
//     yield put(ProductActions.productBestDealFailure('Maaf, produk yang Anda cari tidak ditemukan'))
//     yield put(ProductActions.productClearanceFailure('Maaf, produk yang Anda cari tidak ditemukan'))
//   }
// }

export function * fetchProductRecomendationNewRetailAPI (api, getToken, { data }) {
  try {
    const { user } = yield select(getUser)
    const token = yield call(getToken)
    let a = []
    if (isEmpty(user)) {
      yield put(ProductActions.productRecomendationNewRetailSuccess(flatten(a)))
    } else {
      let parsedData = { customer_id: user.customer_id }
      const res = yield call(api.getCartRelatedProduct, parsedData, token)
      if (res.ok) {
        if (!isEmpty(res.data.data.items) && res.data.data.total > 0) {
          yield put(ProductActions.productRecomendationNewRetailSuccess(res.data.data.items))
        } else if (res.problem === 'NETWORK_ERROR') {
          yield put(ProductActions.productRecomendationNewRetailFailure('Terjadi kesalahan koneksi'))
        } else {
          yield put(ProductActions.productRecomendationNewRetailFailure('Terjadi kesalahan koneksi'))
        }
      }
    }
  } catch (e) {
    yield put(ProductActions.productRecomendationNewRetailFailure('Terjadi kesalahan koneksi'))
  }
}

export function * fetchProductScanAPI (api, storeNewRetailData, { data }) {
  try {
    // NOTE: Send Store Data to wrapper
    // get lower and upper price bound
    let response = yield call(api.getProductScan, data)
    if (response.ok) {
      // guard ace store new retail
      if (!isEmpty(response.data.data.products)) {
        let product = response.data.data.products[0]

        if (product.is_extended === 0 && product.status_retail === 0) {
          yield put(ProductActions.productScanFailure('Maaf, produk yang Anda cari tidak ditemukan'))
        } else yield put(ProductActions.productScanSuccess(response.data.data))
      } else yield put(ProductActions.productScanFailure('Maaf, produk yang Anda cari tidak ditemukan'))
    } else if (response.problem === 'NETWORK_ERROR') {
      yield put(ProductActions.productScanFailure('NETWORK_ERROR'))
    } else {
      yield put(ProductActions.productScanFailure('Maaf, produk yang Anda cari tidak ditemukan'))
    }
  } catch (e) {
    yield put(ProductActions.productScanFailure('Terjadi kesalahan koneksi'))
  }
}

// attempts to fetch product
export function * fetchProductByCategoryAPI (api, storeNewRetailData, { companyCode }) {
  try {
    const categoryDetail = yield select(getCategoryDetail)
    const productHandler = yield select(getProductHandler)
    // NOTE: Send Store Data to wrapper
    // get lower and upper price bound
    let response = yield call(api.getProductByCategory, categoryDetail.data.url_key, categoryDetail.searchKeyword, productHandler.from, productHandler.size, productHandler.sortType, productHandler.brands, productHandler.colors, productHandler.canGoSend || '', productHandler.minPrice, productHandler.maxPrice, (categoryDetail.data.is_rule_based === '1'), categoryDetail.data.category_id, '', productHandler.labels, companyCode)
    if (response.ok) {
      yield put(ProductActions.productSuccess(response.data))
      if (productHandler.fetchFilter) {
        yield put(ProductHandlerActions.productHandlerSetFilterSuccess())
      }
      if (productHandler.fetchSort) {
        yield put(ProductHandlerActions.productHandlerSetSortSuccess())
      }
    } else if (response.problem === 'NETWORK_ERROR') {
      yield put(ProductActions.productFailure('NETWORK_ERROR'))
    } else {
      yield put(ProductActions.productFailure('Maaf, produk yang Anda cari tidak ditemukan'))
    }
  } catch (e) {
    yield put(ProductActions.productFailure())
  }
}

export const fetchProductByKeywordServer = function * (api, storeNewRetailData) {
  let action = yield take(ProductTypes.PRODUCT_BY_KEYWORD_SERVER)
  while (action !== END) {
    yield fork(fetchProductByKeywordAPI, api, storeNewRetailData, action)
    action = yield take(ProductTypes.PRODUCT_BY_KEYWORD_SERVER)
  }
}

export const fetchProductByKeyword = function * (api, storeNewRetailData) {
  let action = yield take(ProductTypes.PRODUCT_BY_KEYWORD_REQUEST)
  while (action !== END) {
    yield fork(fetchProductByKeywordAPI, api, storeNewRetailData, action)
    action = yield take(ProductTypes.PRODUCT_BY_KEYWORD_REQUEST)
  }
}

// attempts to fetch product
export function * fetchProductByKeywordAPI (api, storeNewRetailData) {
  try {
    const categoryDetail = yield select(getCategoryDetail)
    const productHandler = yield select(getProductHandler)

    if (categoryDetail.data) {
      // keyword, from, size, sort, brands, colors, minimumPrice, maximumPrice, storeCode
      const response = yield call(api.getProductByKeyword, categoryDetail.searchKeyword, productHandler.from, productHandler.size, productHandler.sortType, productHandler.brands, productHandler.colors, productHandler.minPrice, productHandler.maxPrice, '', productHandler.labels, productHandler.canGoSend)
      if (response.ok) {
        yield put(ProductActions.productSuccess(response.data))
        if (productHandler.fetchFilter) {
          yield put(ProductHandlerActions.productHandlerSetFilterSuccess())
        }
        if (productHandler.fetchSort) {
          yield put(ProductHandlerActions.productHandlerSetSortSuccess())
        }
      } else if (response.problem === 'NETWORK_ERROR') {
        yield put(ProductActions.productFailure('NETWORK_ERROR'))
      } else {
        yield put(ProductActions.productFailure('Maaf, produk yang Anda cari tidak ditemukan'))
      }
    }
  } catch (e) {
    yield put(ProductActions.productFailure())
  }
}

export const fetchLoadMoreProductByCategory = function * (api) { // mobile
  let action = yield take(ProductTypes.PRODUCT_LOAD_MORE_REQUEST)
  while (action !== END) {
    yield fork(fetchLoadMoreProductByCategoryAPI, api, action)
    action = yield take(ProductTypes.PRODUCT_LOAD_MORE_REQUEST)
  }
}

export function * fetchLoadMoreProductByCategoryAPI (api, { category, from, size, sort }) { // mobile
  const state = yield select(getSearch)
  const init = yield { keyword: null, sort: 'matching', filter: null }
  const data = yield { ...init, ...state.data }
  const response = yield call(api.getProductByCategory, category, from, size, sort, data)
  if (response.ok) {
    const state = yield select(getProduct)
    let data = (state.data) ? [ ...state.data, ...response.data.data ] : response.data.data
    yield put(ProductActions.productLoadMoreSuccess(data))
  } else {
    yield put(ProductActions.productFailure())
  }
}

// action taker
export const fetchProductDetailServer = function * (api, getStoreNewRetail) {
  let action = yield take(ProductDetailTypes.PRODUCT_DETAIL_SERVER)
  while (action !== END) {
    yield fork(fetchProductDetailAPI, api, getStoreNewRetail, action)
    action = yield take(ProductDetailTypes.PRODUCT_DETAIL_SERVER)
  }
}

// action taker
export const fetchProductDetail = function * (api, getStoreNewRetail) {
  let action = yield take(ProductDetailTypes.PRODUCT_DETAIL_REQUEST)
  while (action !== END) {
    yield fork(fetchProductDetailAPI, api, getStoreNewRetail, action)
    action = yield take(ProductDetailTypes.PRODUCT_DETAIL_REQUEST)
  }
}

// attempts to fetch product
export function * fetchProductDetailAPI (api, getStoreNewRetail, { urlKey, isScanned }) {
  try {
    let storeNewRetailCode = ''
    let scannedStatus = isScanned ? 10 : 0
    let storeNewRetailData = yield call(getStoreNewRetail)
    if (!isEmpty(storeNewRetailData) && !isEmpty(storeNewRetailData.store_code)) storeNewRetailCode = storeNewRetailData.store_code

    const response = yield call(api.getProductDetail, urlKey, storeNewRetailCode, scannedStatus)
    if (response.ok) {
      yield put(ProductDetailActions.productDetailSuccess(response.data.data || {}))
    } else {
      yield put(ProductDetailActions.productDetailFailure('Terjadi kesalahan koneksi'))
    }
  } catch (e) {
    yield put(ProductDetailActions.productDetailFailure(e))
  }
}

export const fetchStockServer = function * (api, getStoreNewRetail) {
  let action = yield take(ProductDetailTypes.PRODUCT_DETAIL_STOCK_SERVER)
  while (action !== END) {
    yield fork(fetchStockAPI, api, getStoreNewRetail, action)
    action = yield take(ProductDetailTypes.PRODUCT_DETAIL_STOCK_SERVER)
  }
}

export const fetchStock = function * (api, getStoreNewRetail) {
  let action = yield take(ProductDetailTypes.PRODUCT_DETAIL_STOCK_REQUEST)
  while (action !== END) {
    yield fork(fetchStockAPI, api, getStoreNewRetail, action)
    action = yield take(ProductDetailTypes.PRODUCT_DETAIL_STOCK_REQUEST)
  }
}

export function * fetchStockAPI (api, getStoreNewRetail, { sku, isScanned = false }) {
  try {
    let storeNewRetailData = yield call(getStoreNewRetail)
    let storeNewRetailCode = ''
    if (!isEmpty(storeNewRetailData) && !isEmpty(storeNewRetailData.store_code)) storeNewRetailCode = storeNewRetailData.store_code
    isScanned = (isScanned === true) ? 10 : 0

    const res = yield call(api.getProductStock, sku, isScanned, storeNewRetailCode)
    if (!res.ok) {
      yield put(ProductDetailActions.productDetailStockFailure('Terjadi kesalahan koneksi'))
    } else {
      if (!res.data.error) {
        yield put(ProductDetailActions.productDetailStockSuccess(res.data.data))
      } else {
        yield put(ProductDetailActions.productDetailStockFailure(res.data.message))
      }
    }
  } catch (e) {
    yield put(ProductDetailActions.productDetailStockFailure())
  }
}

export const fetchCanDelivery = function * (api, getStoreNewRetail) {
  let action = yield take(ProductDetailTypes.PRODUCT_DETAIL_CAN_DELIVERY_REQUEST)
  while (action !== END) {
    yield fork(fetchCanDeliveryAPI, api, getStoreNewRetail, action)
    action = yield take(ProductDetailTypes.PRODUCT_DETAIL_CAN_DELIVERY_REQUEST)
  }
}

export function * fetchCanDeliveryAPI (api, getStoreNewRetail, { sku, district, qty, isScanned = 0 }) {
  let storeNewRetailData = yield call(getStoreNewRetail)
  let storeNewRetailCode = ''
  if (!isEmpty(storeNewRetailData) && !isEmpty(storeNewRetailData.store_code)) storeNewRetailCode = storeNewRetailData.store_code
  const res = yield call(api.getProductCanDelivery, sku, district, qty, storeNewRetailCode, isScanned)
  if (!res.ok) {
    yield put(ProductDetailActions.productDetailCanDeliveryFailure('Terjadi kesalahan koneksi'))
  } else {
    if (!res.data.error) {
      yield put(ProductDetailActions.productDetailCanDeliverySuccess(res.data.data))
    } else {
      yield put(ProductDetailActions.productDetailCanDeliveryFailure(res.data.message))
    }
  }
}

export const fetchProductByGtinServer = function * (api) {
  let action = yield take(ProductTypes.PRODUCT_BY_GTIN_SERVER)
  while (action !== END) {
    yield fork(fetchProductByGtinAPI, api, action)
    action = yield take(ProductTypes.PRODUCT_BY_GTIN_SERVER)
  }
}

// attempts to fetch product
export function * fetchProductByGtinAPI (api, { gtin }) {
  try {
    const state = yield select(getSearch)
    const init = yield { gtin: gtin, filter: null }
    const data = yield { ...init, ...state.data }
    const response = yield call(api.getProductByGtin, gtin, data)
    if (response.ok) {
      yield put(ProductActions.productSuccess(response.data))
    } else {
      yield put(ProductActions.productFailure())
    }
  } catch (e) {
    yield put(ProductActions.productFailure())
  }
}

export const fetchLoadMoreProductByKeyword = function * (api) {
  let action = yield take(ProductTypes.PRODUCT_LOAD_MORE_BY_KEYWORD_REQUEST)
  while (action !== END) {
    yield fork(fetchLoadMoreProductByKeywordAPI, api, action)
    action = yield take(ProductTypes.PRODUCT_LOAD_MORE_BY_KEYWORD_REQUEST)
  }
}

export function * fetchLoadMoreProductByKeywordAPI (api, { keyword, from, size, sort }) {
  try {
    const state = yield select(getSearch)
    const init = yield { keyword: keyword, sort: null, filter: null }
    const data = yield { ...init, ...state.data }
    const response = yield call(api.getProductByKeyword, keyword, from, size, sort, data)
    if (response.ok) {
      const state = yield select(getProduct)
      let data = (state.data) ? [ ...state.data, ...response.data.data ] : response.data.data
      yield put(ProductActions.productLoadMoreSuccess(data))
    } else {
      yield put(ProductActions.productFailure())
    }
  } catch (e) {
    yield put(ProductActions.productFailure())
  }
}

export const fetchProductByBrandServer = function * (api) {
  let action = yield take(ProductTypes.PRODUCT_BY_BRAND_SERVER)
  while (action !== END) {
    yield fork(fetchProductByBrandAPI, api, action)
    action = yield take(ProductTypes.PRODUCT_BY_BRAND_SERVER)
  }
}

export const fetchProductByBrand = function * (api) {
  let action = yield take(ProductTypes.PRODUCT_BY_BRAND_REQUEST)
  while (action !== END) {
    yield fork(fetchProductByBrandAPI, api, action)
    action = yield take(ProductTypes.PRODUCT_BY_BRAND_REQUEST)
  }
}

export function * fetchProductByBrandAPI (api, { brand, from, size, sort }) {
  try {
    const state = yield select(getSearch)
    const init = yield { brand: brand, sort: null, filter: null }
    const data = yield { ...init, ...state.data }
    const response = yield call(api.getProductByBrand, brand, from, size, sort, data)
    if (response.ok) {
      yield put(ProductActions.productSuccess(response.data))
    } else {
      yield put(ProductActions.productFailure())
    }
  } catch (e) {
    yield put(ProductActions.productFailure())
  }
}

export const fetchProductBySupplierServer = function * (api) {
  let action = yield take(ProductTypes.PRODUCT_BY_SUPPLIER_SERVER)
  while (action !== END) {
    yield fork(fetchProductBySupplierAPI, api, action)
    action = yield take(ProductTypes.PRODUCT_BY_SUPPLIER_SERVER)
  }
}

export const fetchProductBySupplier = function * (api) {
  let action = yield take(ProductTypes.PRODUCT_BY_SUPPLIER_REQUEST)
  while (action !== END) {
    yield fork(fetchProductBySupplierAPI, api, action)
    action = yield take(ProductTypes.PRODUCT_BY_SUPPLIER_REQUEST)
  }
}

export function * fetchProductBySupplierAPI (api, { supplier, from, size, sort }) {
  try {
    const state = yield select(getSearch)
    const init = yield { supplier: supplier, sort: null, filter: null }
    const data = yield { ...init, ...state.data }
    const response = yield call(api.getProductBySupplier, supplier, from, size, sort, data)
    if (response.ok) {
      yield put(ProductActions.productSuccess(response.data))
    } else {
      yield put(ProductActions.productFailure())
    }
  } catch (e) {
    yield put(ProductActions.productFailure())
  }
}

export const fetchLoadMoreProductByBrand = function * (api) {
  let action = yield take(ProductTypes.PRODUCT_LOAD_MORE_BY_BRAND_REQUEST)
  while (action !== END) {
    yield fork(fetchLoadMoreProductByBrandAPI, api, action)
    action = yield take(ProductTypes.PRODUCT_LOAD_MORE_BY_BRAND_REQUEST)
  }
}

export function * fetchLoadMoreProductByBrandAPI (api, { brand, from, size, sort }) {
  try {
    const state = yield select(getSearch)
    const init = yield { brand: brand, sort: null, filter: null }
    const data = yield { ...init, ...state.data }
    const response = yield call(api.getProductByBrand, brand, from, size, sort, data)
    if (response.ok) {
      const state = yield select(getProduct)
      let data = (state.data) ? [ ...state.data, ...response.data.data ] : response.data.data
      yield put(ProductActions.productLoadMoreSuccess(data))
    } else {
      yield put(ProductActions.productFailure())
    }
  } catch (e) {
    yield put(ProductActions.productFailure())
  }
}

export const fetchLoadMoreProductBySupplier = function * (api) {
  let action = yield take(ProductTypes.PRODUCT_LOAD_MORE_BY_SUPPLIER_REQUEST)
  while (action !== END) {
    yield fork(fetchLoadMoreProductBySupplierAPI, api, action)
    action = yield take(ProductTypes.PRODUCT_LOAD_MORE_BY_SUPPLIER_REQUEST)
  }
}

export function * fetchLoadMoreProductBySupplierAPI (api, { supplier, from, size, sort }) {
  try {
    const state = yield select(getSearch)
    const init = yield { supplier: supplier, sort: null, filter: null }
    const data = yield { ...init, ...state.data }
    const response = yield call(api.getProductBySupplier, supplier, from, size, sort, data)
    if (response.ok) {
      const state = yield select(getProduct)
      let data = (state.data) ? [ ...state.data, ...response.data.data ] : response.data.data
      yield put(ProductActions.productLoadMoreSuccess(data))
    } else {
      yield put(ProductActions.productFailure())
    }
  } catch (e) {
    yield put(ProductActions.productFailure())
  }
}

export const fetchGetMaxStock = function * (api, getStoreNewRetail) {
  let action = yield take(ProductDetailTypes.PRODUCT_DETAIL_GET_MAX_STOCK_REQUEST)
  while (action !== END) {
    yield fork(fetchGetMaxStockAPI, api, getStoreNewRetail, action)
    action = yield take(ProductDetailTypes.PRODUCT_DETAIL_GET_MAX_STOCK_REQUEST)
  }
}

export function * fetchGetMaxStockAPI (api, getStoreNewRetail, { sku, district, isScanned = 0 }) {
  let storeNewRetailData = yield call(getStoreNewRetail)
  let storeNewRetailCode = ''
  if (!isEmpty(storeNewRetailData) && !isEmpty(storeNewRetailData.store_code)) storeNewRetailCode = storeNewRetailData.store_code

  const res = yield call(api.getMaxStock, sku, district, storeNewRetailCode, isScanned)
  if (!res.ok) {
    yield put(ProductDetailActions.productDetailGetMaxStockFailure('Terjadi kesalahan koneksi'))
  } else {
    if (!res.data.error) {
      yield put(ProductDetailActions.productDetailGetMaxStockSuccess(res.data.data))
    } else {
      yield put(ProductDetailActions.productDetailGetMaxStockFailure(res.data.message))
    }
  }
}

export const fetchGetPromoVoucherDetail = function * (api) {
  let action = yield take(ProductDetailTypes.PRODUCT_DETAIL_GET_PROMO_VOUCHER_DETAIL_REQUEST)
  while (action !== END) {
    yield fork(fetchGetPromoVoucherDetailAPI, api, action)
    action = yield take(ProductDetailTypes.PRODUCT_DETAIL_GET_PROMO_VOUCHER_DETAIL_REQUEST)
  }
}

export function * fetchGetPromoVoucherDetailAPI (api, { voucherCode }) {
  const res = yield call(api.getPromoVoucherDetail, voucherCode)
  if (!res.ok) {
    yield put(ProductDetailActions.productDetailGetPromoVoucherDetailFailure('Terjadi kesalahan koneksi'))
  } else {
    if (!res.data.error) {
      yield put(ProductDetailActions.productDetailGetPromoVoucherDetailSuccess(res.data.data))
    } else {
      yield put(ProductDetailActions.productDetailGetPromoVoucherDetailFailure(res.data.message))
    }
  }
}

export const fetchGetRelatedProducts = function * (api, storeNewRetailData) {
  let action = yield take(ProductDetailTypes.PRODUCT_DETAIL_GET_RELATED_PRODUCTS_REQUEST)
  while (action !== END) {
    yield fork(fetchGetRelatedProductsAPI, api, storeNewRetailData, action)
    action = yield take(ProductDetailTypes.PRODUCT_DETAIL_GET_RELATED_PRODUCTS_REQUEST)
  }
}

export function * fetchGetRelatedProductsAPI (api, storeNewRetailData, { urlKey, storeCode }) {
  const res = yield call(api.getRelatedProducts, urlKey, storeCode)
  if (!res.ok) {
    yield put(ProductDetailActions.productDetailGetRelatedProductsFailure('Terjadi kesalahan, ulangi beberapa saat lagi'))
  } else {
    if (!res.data.error) {
      yield put(ProductDetailActions.productDetailGetRelatedProductsSuccess(res.data.data))
    } else {
      yield put(ProductDetailActions.productDetailGetRelatedProductsFailure(res.data.message))
    }
  }
}

export function * fetchRemainingVoucher (api) {
  let action = yield take(ProductDetailTypes.VOUCHER_REMAINING_REQUEST)
  while (action !== END) {
    yield fork(fetchRemainingVoucherApi, api, action)
    action = yield take(ProductDetailTypes.VOUCHER_REMAINING_REQUEST)
  }
}

function * fetchRemainingVoucherApi (api, { voucherCode }) {
  const res = yield call(api.remainingVoucher, voucherCode)
  if (!res.ok) {
    yield put(ProductDetailActions.voucherRemainingFailure(res.data.message))
  } else {
    yield put(ProductDetailActions.voucherRemainingSuccess(res.data.data))
  }
}
