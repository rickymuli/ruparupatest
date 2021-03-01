import axios from 'axios'
import config from '../../config.js'
import { Platform } from 'react-native'
import isEmpty from 'lodash/isEmpty'

const developmentENV = config.developmentENV
let apiUrl = config.apiURL

if (developmentENV === 'stg') {
  apiUrl = config.stgApiURL
} else if (developmentENV === 'dev') {
  apiUrl = config.devApiURL
}

const apiWrapper = axios.create({
  // base URL is read from the "constructor"
  baseURL: apiUrl,
  headers: {
    'user-agent': Platform.OS,
    'x-company-name': 'odi'
  },
  // 10 second timeout...
  // http://139103.ricky:139103in@10.1.32.203:3128
  timeout: 10000
  // proxy: {
  //   host: '10.1.32.203',
  //   port: 3128,
  //   auth: {
  //     username: '139103.ricky',
  //     password: '139103in'
  //   }
  // }
})

const headers = {
  'X-Frontend-Type': 'mobile'
}

const getProductByKeyword = (params) => {
  const { keyword = '', from = 0, size = 48, sort = '', brands = '', colors, minPrice = '', maxPrice = '', storeCode = '', labels = '', canGoSend = '' } = params
  let variantAttributes = !isEmpty(colors) ? `color:${colors}` : ''
  return apiWrapper.get(`/product/keyword/${keyword}?from=${from}&size=${size}&sort=${sort}&brands=${brands.toString()}&variant_attributes=${variantAttributes}&minprice=${minPrice}&maxprice=${maxPrice}&storeCode=${storeCode}&labels=${labels.toString()}&can_gosend=${canGoSend}`)
}

const getProductByCategory = (params) => {
  const { category = '', categoryId = '', keyword = '', from = 0, size = 48, sortType = '', brands = '', colors = '', canGoSend = '', minPrice = '', maxPrice = '', isRuleBased = false, storeCode = '', labels = '', boostEmarsys = '' } = params
  let variantAttributes = !isEmpty(colors) ? `color:${colors}` : ''
  return apiWrapper.get(`/product/category/${category}?keyword=${keyword}&from=${from}&size=${size}&sort=${sortType}&brands=${brands}&variant_attributes=${variantAttributes}&minprice=${minPrice}&maxprice=${maxPrice}&isRuleBased=${isRuleBased}&categoryId=${categoryId}&can_gosend=${canGoSend}&storeCode=${storeCode}&labels=${labels}&boost=${boostEmarsys}`)
}

const getCategoryDetail = ({ urlKey = '' }) => apiWrapper.get(`/category/detail?urlKey=${urlKey}`)

// TAHU
const getCmsBlockDetail = (identifier) => apiWrapper.get('/misc/cms-block-detail?identifier=' + identifier, { headers })

// Filters
const getFilter = ({ category = '', keyword = '', isRuleBased = false, categoryId = '', storeCode = '' }) => (
  apiWrapper.get(`/product/navigationfilters?category=${category}&keyword=${keyword}&isRuleBased=${isRuleBased}&categoryId=${categoryId}&storeCode=${storeCode}`)
)

// Product Detail (PDP)
const getProductDetail = (urlKey, storeCodeNewRetail = '', isScanned = 0) => (
  apiWrapper.get(`/product-detail/${urlKey}?store_code_new_retail=${storeCodeNewRetail}&is_product_scanned=${isScanned}`)
)

const getProductStock = (sku, isScanned = 0, storeCodeNewRetail = '') => { // Required parameters sku : product sku
  return apiWrapper.get(`/stock/${sku}?store_code=${storeCodeNewRetail}&is_product_scanned=${isScanned}`)
}

const getMaxStock = (sku, district, storeCodeNewRetail = '', isScanned = 0) => { // Required parameters sku : product sku, kecamatan_code, qty_ordered, storecode (*?)
  return apiWrapper.get(`/stock/max-stock/${sku}/${district}?store_code=${storeCodeNewRetail}&is_product_scanned=${isScanned}`)
}

const getProductCanDelivery = (sku, district, qty, storeCodeNewRetail = '', isScanned = 0) => { // Required parameters sku : product sku, kecamatan_code, qty_ordered
  return apiWrapper.get(`/stock/can-delivery/${sku}/${district}/${qty}?store_code=${storeCodeNewRetail}&is_product_scanned=${isScanned}`)
}

const remainingVoucher = (voucherCode) => { // Get Voucher Remaining
  return apiWrapper.get(`/stock/remaining-voucher/${voucherCode}`)
}

export default {
  getProductByKeyword,
  getProductByCategory,
  getCategoryDetail,
  getCmsBlockDetail,
  getFilter,
  productDetailPage: { getProductDetail, getProductStock, getMaxStock, getProductCanDelivery, remainingVoucher }
}
