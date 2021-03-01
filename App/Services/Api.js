// a library to wrap and simplify api calls
import apisauce from 'apisauce'
import config from '../../config.js'
import getVersion from '../Services/GetVersion'
import isEmpty from 'lodash/isEmpty'
import CheckUndefined from '../Utils/Misc/CheckUndefined'
// import * as Sentry from '@sentry/react-native'
import { Platform } from 'react-native'

const developmentENV = config.developmentENV
const versionApp = getVersion()
let apiUrl = config.apiURL
let apiReview = config.reviewRatingURL
let apiReturnRefund = config.returnRefundUrl

if (developmentENV === 'stg') {
  apiUrl = config.stgApiURL
  apiReview = config.stgReviewRatingURL
  apiReturnRefund = config.stgReturnRefundUrl
} else if (developmentENV === 'dev') {
  apiUrl = config.devApiURL
  apiReturnRefund = config.devReturnRefundURL
}

// const rafaelaUrl = 'http://rafaela.ruparupa.io/'

// const deviceTokenURL = config.deviceTokenURL

// our "constructor"
const create = (baseURL = apiUrl) => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  const apiWrapper = apisauce.create({
    // base URL is read from the "constructor"
    // baseURL: 'https://kristian.wapi.ruparupastg.my.id/',
    baseURL: apiUrl,
    headers: {
      'X-Frontend-Type': 'mobile',
      'X-App-Version': versionApp,
      'user-agent': Platform.OS,
      'x-company-name': 'odi'
    },
    // 10 second timeout...
    // http://139103.ricky:139103in@10.1.32.203:3128
    timeout: 20000
    // proxy: {
    //   host: '10.1.32.203',
    //   port: 3128,
    //   auth: {
    //     username: '139103.ricky',
    //     password: '139103in'
    //   }
    // }
  })

  const returnRefundWrapper = apisauce.create({
    baseURL: apiReturnRefund,
    headers: {
      'user-agent': Platform.OS,
      'x-company-name': 'odi',
      'X-Frontend-Type': 'mobile'
    },
    timeout: 10000
  })
  // const stgWrapper = apisauce.create({
  //   // base URL is read from the "constructor"
  //   baseURL: config.stgApiURL,
  //   headers: {
  //     'user-agent': Platform.OS,
  //     'x-company-name': 'odi'
  //   },
  //   timeout: 10000
  // })

  const geoWrapper = apisauce.create({
    // base URL is read from the "constructor"
    baseURL: config.geoURL,
    // 10 second timeout...
    timeout: 10000
  })

  // const deviceTokenWrapper = apisauce.create({
  //   // base URL is read from the "constructor"
  //   baseURL: deviceTokenURL,
  //   // 10 second timeout...
  //   timeout: 10000
  // })

  const reviewRatingWrapper = apisauce.create({
    baseURL: apiReview,
    timeout: 10000
  })

  const feedbackWrapper = apisauce.create({
    headers: {
      authorization: `Bearer ${config.feedbackBearer}`
    },
    baseURL: config.feedbackUrl,
    timeout: 10000
  })

  // const tahuWrapper = apisauce.create({
  //   // base URL is read from the "constructor"
  //   baseURL: tahuUrl,
  //   // 10 second timeout...
  //   timeout: 10000
  // })

  // const rafaelaWrapper = apisauce.create({
  //   baseURL: rafaelaUrl,
  //   timeout: 10000
  // })

  const headerWithToken = (authorization) => {
    return {
      headers: {
        authorization
      }
    }
  }

  // Wrap api's addMonitor to allow the calling code to attach
  // additional monitors in the future.  But only in __DEV__ and only
  // if we've attached Reactotron to console (it isn't during unit tests).
  if (config.DEBUG) {
    const naviMonitor = (response) => console.log('API DEBUG! response =', response)
    apiWrapper.addMonitor(naviMonitor)
    returnRefundWrapper.addMonitor(naviMonitor)
  }
  // apiWrapper.addMonitor((response ={})=>{
  //   if (config.DEBUG) console.log('API DEBUG! response =', response)
  //   Sentry.addBreadcrumb({
  //     "type": "http",
  //     "category": "xhr",
  //     "data": {
  //       "url": response.config?.url ?? '',
  //       "method": response.method,
  //       "status_code": response.status,
  //       "res": response.data
  //     },
  //   });
  // })

  // ------
  // STEP 2
  // ------
  //
  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.
  //

  // banner
  const banner = () => {
    return apiWrapper.get('/misc/mobile-app-banner')
  }

  const tahu = (data) => {
    let companyName = (data.companyCode === 'AHI') ? 'ace' : (data.companyCode === 'HCI') ? 'informa' : ''
    return apiWrapper.get(`${(companyName !== '') ? `/${companyName}` : ''}/tahu/campaign/active/${data.campaignId}`, {}, { headers: { 'Content-Type': 'application/json', 'user-platform': data.os, 'x-company-name': companyName } })
  }

  // brands
  const brand = (totalToBeSplitted) => {
    return apiWrapper.get('/misc/mobile-brand', { totalToBeSplitted })
  }

  // Inspiration
  const getInspirations = ({ storeCode, companyCode, inspirationType }) => {
    let bu = ''
    if (!isEmpty(companyCode)) {
      bu = (companyCode === 'AHI') ? '/ace' : (companyCode === 'HCI') ? '/informa' : ''
    }
    let endpoint = `${bu}/inspirations?storeCode=${CheckUndefined(storeCode)}`
    if (typeof type !== 'undefined' || !isEmpty(inspirationType)) {
      endpoint = `${bu}/inspirations/promotions?storeCode=${CheckUndefined(storeCode)}&type=${inspirationType}`
    }
    return apiWrapper.get(endpoint, {})
  }

  // Event (Daily Deals and others)
  const getEventDetail = ({ storeCode, event, companyCode }) => {
    let bu = ''
    if (!isEmpty(companyCode)) {
      bu = (companyCode === 'AHI') ? '/ace' : (companyCode === 'HCI') ? '/informa' : ''
    }
    let endpoint = `${bu}/events?event=${event}&storeCode=${CheckUndefined(storeCode)}`
    return apiWrapper.get(endpoint)
  }

  // Get Category
  const getCategoryTree = () => {
    return apiWrapper.get('/category/tree/')
  }

  const getCategoryDetail = ({ urlKey, companyCode, boostEmarsys }) => {
    if (!isEmpty(companyCode)) {
      let bu = (companyCode === 'AHI') ? '/ace' : (companyCode === 'HCI') ? '/informa' : ''
      return apiWrapper.get(`${bu}/category/detail?urlKey=` + urlKey + `&boost=${boostEmarsys || ''}`)
    } else {
      return apiWrapper.get('/category/detail?urlKey=' + urlKey + `&boost=${boostEmarsys || ''}`)
    }
  }

  // Explore by Category
  // const getCmsBlockDetail = (identifier) => {
  //   return apiWrapper.get(`/misc/cms-block-detail?identifier=` + identifier)
  // }
  const getCmsBlockDetail = (identifier, companyCode) => {
    if (!isEmpty(companyCode)) {
      let bu = (companyCode === 'AHI') ? '/ace' : (companyCode === 'HCI') ? '/informa' : ''
      return apiWrapper.get(`${bu}/misc/cms-block-detail?identifier=${identifier}`)
    } else {
      return apiWrapper.get(`/misc/cms-block-detail?identifier=${identifier}`)
    }
  }

  // Search
  // Populer Search
  const popularSearch = (algoliaUserToken) => {
    return apiWrapper.get('/instant/popular', {}, { headers: { 'X-Algolia-UserToken': `anonymous-${algoliaUserToken}` } })
  }

  const getCustom = (columnName) => {
    return apiWrapper.get(`/misc/custom?columnName=${columnName}`)
  }

  // Search by category (Used by elastic search)
  // Required parameters keyword
  const searchProductByKeyword = (keyword, storeCode, algoliaUserToken) => {
    return apiWrapper.get(`/instant/search/${keyword}?storeCode=${''}`, {}, { headers: { 'X-Algolia-UserToken': `anonymous-${algoliaUserToken}` } })
  }

  // Required parameters keyword
  const searchPageRedirect = (keyword) => {
    return apiWrapper.get(`/product/pageredirect/${keyword}`)
  }

  // product

  // Required parameters category : category name
  const getProductByCategory = (category, keyword, from, size, sort, brands, colors, canGosend, minimumPrice, maximumPrice, isRuleBased, categoryId, storeCode, labels, companyCode) => {
    let variantAttributes = ''
    if (!isEmpty(colors)) {
      variantAttributes = `color:${colors}`
    }
    if (!isEmpty(companyCode)) {
      let bu = (companyCode === 'AHI') ? '/ace' : (companyCode === 'HCI') ? '/informa' : ''
      return apiWrapper.get(`${bu}/product/category/${category || ''}?keyword=${keyword || ''}&from=${from || 0}&size=${size || 48}&sort=${sort || ''}&brands=${brands || ''}&variant_attributes=${variantAttributes}&minprice=${minimumPrice || ''}&maxprice=${maximumPrice || ''}&isRuleBased=${isRuleBased || ''}&categoryId=${categoryId || ''}&express_courier=${canGosend}&storeCode=${CheckUndefined(storeCode) || ''}&labels=${labels || ''}`)
    } else {
      return apiWrapper.get(`/product/category/${category || ''}?keyword=${keyword || ''}&from=${from || 0}&size=${size || 48}&sort=${sort || ''}&brands=${brands || ''}&variant_attributes=${variantAttributes}&minprice=${minimumPrice || ''}&maxprice=${maximumPrice || ''}&isRuleBased=${isRuleBased || ''}&categoryId=${categoryId || ''}&express_courier=${canGosend}&storeCode=${CheckUndefined(storeCode) || ''}&labels=${labels || ''}`)
    }
  }

  // Required parameters category : category name
  const getProductByKeyword = (keyword, from, size, sort, brands, colors, minimumPrice, maximumPrice, storeCode, labels, canGosend) => {
    let variantAttributes = ''

    if (colors && colors !== '') {
      variantAttributes = `color:${colors}`
    }
    return apiWrapper.get(`/product/keyword/${keyword || ''}?from=${from || 0}&size=${size || 48}&sort=${sort || ''}&brands=${brands.toString() || ''}&variant_attributes=${variantAttributes}&minprice=${minimumPrice || ''}&maxprice=${maximumPrice || ''}&storeCode=${CheckUndefined(storeCode) || ''}&labels=${labels.toString() || ''}&can_gosend=${canGosend || ''}`)
  }

  // for price upper and lower bound
  const getMinMaxPrice = (category, keyword, from, size, sort, brands, colors) => {
    let variantAttributes = ''

    if (colors && colors !== '') {
      variantAttributes = `color:${colors}`
    }

    if (category !== '') {
      return apiWrapper.get(`/product/minmax/category/${category || ''}?keyword=${keyword || ''}&from=${from || 0}&size=${size || 48}&sort=${sort || ''}&brands=${brands || ''}&variant_attributes=${variantAttributes}`)
    } else {
      return apiWrapper.get(`/product/minmax/keyword/${keyword || ''}?from=${from || 0}&size=${size || 48}&sort=${sort || ''}&brands=${brands || ''}&variant_attributes=${variantAttributes}`)
    }
  }

  // Get product by brand_id
  // const getProductByBrand = (brand, from, size, sort, data) => {
  //   return apiWrapper.get('/product/brand/' + brand + '?from=' + from + '&size=' + size + '&sort=' + sort + '&attributes=&minprice&maxprice&brands=')
  // }

  // const getProductBySupplier = (supplier, from, size, sort, data) => {
  //   return apiWrapper.get('/product/supplier/' + supplier + '?from=' + from + '&size=' + size + '&sort=' + sort + '&attributes=&minprice&maxprice&brands=')
  // }

  // Required parameters gtin : gtin
  const getProductByGtin = (gtin, data) => {
    return apiWrapper.get(`/product/gtin/${gtin}`)
  }

  // Filters
  const getNavigationFilter = ({ category, keyword, isRuleBased, categoryId, storeCode, companyCode }) => {
    const cat = category
      ? category.includes('.html')
        ? category
        : `${category}.html`
      : ''
    const key = keyword || ''
    const isRule = isRuleBased || false
    const catId = categoryId || ''
    if (!isEmpty(companyCode)) {
      let bu = (companyCode === 'AHI') ? '/ace' : (companyCode === 'HCI') ? '/informa' : ''
      return apiWrapper.get(`${bu}/product/navigationfilters?category=${cat}&keyword=${key}&isRuleBased=${isRule}&categoryId=${catId}&storeCode=${CheckUndefined(storeCode)}`)
    } else {
      return apiWrapper.get(`/product/navigationfilters?category=${cat}&keyword=${key}&isRuleBased=${isRule}&categoryId=${catId}&storeCode=${CheckUndefined(storeCode)}`)
    }
  }

  // Required parameters : urlKey, storeCode
  const getRelatedProducts = (urlKey, storeCode) => {
    return apiWrapper.get(`/product/related?urlKey=${urlKey || ''}&storeCode=${CheckUndefined(storeCode)}`)
  }

  const getProductDetail = (urlKey, storeCodeNewRetail = '', isScanned = 0) => {
    return apiWrapper.get(`/product-detail/${urlKey}?store_code_new_retail=${storeCodeNewRetail}&is_product_scanned=${isScanned}`)
  }

  // Required parameters sku : product sku
  const getProductStock = (sku, isScanned = 0, storeCodeNewRetail = '') => {
    return apiWrapper.get(`/stock/${sku}?store_code=${storeCodeNewRetail}&is_product_scanned=${isScanned}`)
  }

  // Required parameters sku : product sku, kecamatan_code, qty_ordered
  const getProductCanDelivery = (sku, district, qty, storeCodeNewRetail = '', isScanned = 0) => {
    return apiWrapper.get(`/stock/can-delivery/${sku}/${district}/${qty}?store_code=${storeCodeNewRetail}&is_product_scanned=${isScanned}`)
  }

  // Required parameters sku : product sku, kecamatan_code, qty_ordered, storecode (*?)
  const getMaxStock = (sku, district, storeCodeNewRetail = '', isScanned = 0) => {
    return apiWrapper.get(`/stock/max-stock/${sku}/${district}?store_code=${storeCodeNewRetail}&is_product_scanned=${isScanned}`)
  }

  // Misc

  const getProvince = () => {
    return apiWrapper.get('/misc/province')
  }

  const getCity = (provinceId) => {
    return apiWrapper.get(`/misc/city/${provinceId}`)
  }

  const getKecamatan = (cityId) => {
    return apiWrapper.get(`/misc/kecamatan/${cityId}`)
  }

  const getExpressDelivery = (kecamatanId) => {
    return apiWrapper.get(`/misc/canExpressDelivery/${kecamatanId}`)
  }

  const getVerifyMarketplaceAcquisition = (orderId) => {
    return apiWrapper.get(`/misc/marketplace?sales_order_no=${orderId}`)
    // return apiWrapper.get(`/misc/shopee?sales_order_no=${orderId}`)
  }

  const getBankInstallment = () => {
    return apiWrapper.get('/misc/bank-installment')
  }

  const getStoreData = (storeData, token) => {
    if (token) {
      return apiWrapper.post('/user/cart/store',
        { 'store_code': storeData },
        headerWithToken(token))
    } else {
      return apiWrapper.get(`/misc/check-store/${storeData}`)
    }
  }

  // auth
  const register = (data) => {
    return apiWrapper.post('/auth/register',
      data
    )
  }

  const login = (data) => {
    return apiWrapper.post('/auth/login',
      data
    )
  }

  // login socmed
  const loginSocmed = (data) => {
    return apiWrapper.post('/auth/login',
      { data }
    )
  }

  const forgot = (email) => {
    return apiWrapper.post('/auth/forgot',
      { email }
    )
  }

  // Logout
  const logout = (data) => {
    return apiWrapper.post('/auth/logout-app',
      {
        unique_id: data.uniqueId,
        customer_id: data.customerId
      }
    )
  }

  // save device token
  const deviceToken = (data) => apiWrapper.post('/notif/device-token', data)

  // resetAuth
  const resetAuth = (data) => {
    return apiWrapper.post('/auth/reset',
      data
    )
  }
  // user
  const userProfile = (token) => {
    return apiWrapper.get('/user/profile',
      {},
      headerWithToken(token)
    )
  }

  const toggleWishlist = (token, { data }) => {
    const { sku, method, storeCodeNewRetail = '', isProductScanned = 0 } = data
    return apiWrapper.post('/user/wishlist',
      { sku, method, store_code_new_retail: storeCodeNewRetail, is_product_scanned: isProductScanned },
      headerWithToken(token)
    )
  }

  const getWishlist = (token, data) => {
    const { wishlistFrom, wishlistSize, storeCodeNewRetail } = data
    return apiWrapper.get('/user/wishlist',
      { wishlistFrom, wishlistSize, storeCodeNewRetail },
      headerWithToken(token)
    )
  }

  const getAllWishlist = (token, storeCodeNewRetail = '') => {
    return apiWrapper.get(`/user/wishlist?storeCodeNewRetail=${storeCodeNewRetail}`,
      {},
      headerWithToken(token)
    )
  }

  const userUpdate = (token, data) => {
    return apiWrapper.post('/user/profile',
      { ...data },
      headerWithToken(token)
    )
  }

  const changePassword = (token, data) => {
    const { password, confirmPassword } = data
    return apiWrapper.post('/user/change-password',
      { password, confirmPassword },
      headerWithToken(token)
    )
  }

  const getAddress = (token) => {
    return apiWrapper.get('/user/address-list',
      {},
      headerWithToken(token)
    )
  }

  const getOneAddress = (token, data) => {
    return apiWrapper.get(`/user/address/${data}`,
      {},
      headerWithToken(token)
    )
  }

  const createAddress = (token, data) => {
    return apiWrapper.post('/user/address',
      { data },
      headerWithToken(token)
    )
  }

  const updateAddress = (token, data) => {
    return apiWrapper.post(`/user/address/${data.address_id}`,
      { data },
      headerWithToken(token)
    )
  }

  const primaryAddress = (token, data) => {
    return apiWrapper.post(`/user/address-primary/${data.address_id}`,
      {},
      headerWithToken(token)
    )
  }

  const deleteAddress = (token, data) => {
    return apiWrapper.post(`/user/address-delete`,
      { address_id: data.data.address_id },
      headerWithToken(token)
    )
  }

  const cekPoint = (token, { data }) => {
    const { params } = data
    return apiWrapper.post('/user/cek-point',
      {
        company_id: params.company_id,
        member_id: params.member_id,
        member_pin: params.member_pin
      },
      headerWithToken(token)
    )
  }

  const getUserReview = (token) => {
    return apiWrapper.get('/user/review',
      {},
      headerWithToken(token)
    )
  }

  const postSellerReview = (token, data) => {
    const { invoiceNo, packagingProduct, deliveryTime, email, sku } = data
    return apiWrapper.post('/order/supplier-review',
      { supplier_id: data.supplier_id, invoice_no: invoiceNo, packaging_product: packagingProduct, delivery_time: deliveryTime, email, sku }
    )
  }

  const redeemPoint = (token, { data }) => {
    const { params } = data
    const { balance } = params
    return apiWrapper.post('/user/redeem-point',
      { company_id: params.company_id, member_id: params.member_id, member_pin: params.member_pin, balance },
      headerWithToken(token)
    )
  }

  const getVoucherList = (token) => {
    return apiWrapper.get('/user/voucher-list',
      {},
      headerWithToken(token))
  }

  const getProductReview = (sku) => apiWrapper.get(`/product/review/${sku}`)

  const getProductScan = ({ sku }) => apiWrapper.get(`/product/scan/${sku}`)

  // cart

  // Required parameters cartId : cart unique id
  const getCart = (cartId, token) => {
    return apiWrapper.get('/cart/' + cartId)
  }

  const getCartType = (customerId = '', storeCode = '') => {
    return apiWrapper.get(`/cart?customer_id=${customerId}&type=${storeCode}&store_code_new_retail=${storeCode}`)
  }

  const cartAuth = (cartId) => {
    return apiWrapper.get('/cart/cart-auth/' + cartId)
  }

  // Required parameters data : remote_ip, customer, device, items dll (read documentation)
  const createCart = (data, token) => {
    if (token) {
      return apiWrapper.post('/user/cart',
        { data },
        headerWithToken(token))
    } else {
      return apiWrapper.post('/cart',
        { data })
    }
  }

  // Required parameters data : remote_ip, customer, device, items dll (read documentation), cartId : cart unique id
  const updateCart = (data, cartId, token) => {
    data.cart_id = cartId
    if (token) {
      return apiWrapper.post('/user/cart/update',
        { data },
        headerWithToken(token)
      )
    } else {
      return apiWrapper.post('/cart/update',
        { data }
      )
    }
  }
  // Required parameters cartId : cart unique id
  const deleteCartItem = (data, cartId) => {
    data.cart_id = cartId
    return apiWrapper.post('/cart/delete',
      { data }
    )
  }

  const getCartRelatedProduct = (data, token) => {
    if (token) {
      return apiWrapper.post('/user/cart/related',
        { data },
        headerWithToken(token))
    } else {
      return {}
    }
  }

  // order
  // create order
  const order = (data) => {
    return apiWrapper.post('/order',
      { data }
    )
  }
  // Required parameters sku : product sku
  const getOrder = (orderId, email) => {
    return apiWrapper.get('/order/' + orderId + '?customer_email=' + email)
  }
  const getInvoice = ({ invoiceNo }) => {
    return apiWrapper.get('/order/invoice/' + invoiceNo)
  }
  const getOrderData = ({ orderNo, email }) => {
    return apiWrapper.get('/order/get-order/' + orderNo + '/' + email)
  }
  // const getOrderList = (token) => {
  //   return apiWrapper.get('/user/order-list',
  //   {},
  //   headerWithToken(token))
  // }
  const getOrderList = (token) => {
    return apiWrapper.get('/user/order-summary',
      {},
      headerWithToken(token))
  }

  // Subscribe to news
  const newsletterSubscribe = (data) => {
    return apiWrapper.post('/newsletter/subscribe',
      { data }
    )
  }

  // Verify static page or not
  const getStaticDetail = (pageData) => {
    if (typeof pageData === 'object' && pageData.company_code !== '') {
      let bu = (pageData.company_code === 'AHI') ? '/ace' : (pageData.company_code === 'HCI') ? '/informa' : ''
      return apiWrapper.get(`${bu}/routes/${pageData.url_key}`)
    } else {
      let urlKey = (typeof pageData === 'object' && pageData !== 'null') ? pageData.url_key : pageData
      return apiWrapper.get(`/routes/${urlKey}`)
    }
  }

  // static page
  const getStaticPage = (staticPageData) => {
    return apiWrapper.get(`/routes/staticpage/${staticPageData.data}`)
  }

  // promo banner
  const getPromoBanner = () => {
    return apiWrapper.get(`/misc/mobile-app-search-banner`)
  }

  // getlocationByIp
  const getLocationByIp = () => {
    return geoWrapper.get(`/v1/ip/geo.json`)
  }

  // B2B
  const emailB2B = (data) => {
    return apiWrapper.post('/email/b2b',
      { data }
    )
  }

  // Get Voucher Remaining
  const remainingVoucher = (voucherCode) => {
    return apiWrapper.get(`/stock/remaining-voucher/${voucherCode}`)
  }

  // Otp
  const checkOtpAuth = (data) => {
    return apiWrapper.post('/auth/check-otp-auth',
      data,
      headerWithToken(config.otpKey)
    )
  }

  const choicesOtp = (data) => {
    return apiWrapper.post('/auth/otp-choices',
      data,
      headerWithToken(config.otpKey)
    )
  }

  const generateOtp = (data) => {
    return apiWrapper.post('/auth/generate-otp',
      data,
      headerWithToken(config.otpKey)
    )
  }

  const validateOtp = (data) => {
    return apiWrapper.post('/auth/validate-otp',
      data,
      headerWithToken(config.otpKey)
    )
  }

  const updatePhoneOtp = (data) => {
    return apiWrapper.put('/auth/update-phone',
      data,
      headerWithToken(config.otpKey)
    )
  }

  const forgotPassword = (data) => {
    return apiWrapper.post('/auth/forgot-password-otp',
      data,
      headerWithToken(config.otpKey)
    )
  }

  const authorizeSocial = (data) => {
    return apiWrapper.post('/auth/authorize-social',
      data,
      headerWithToken(config.otpKey)
    )
  }

  const postMembershipApiData = (data) => {
    return apiWrapper.post('/membership/status', data)
  }

  const storeLocations = ({ latitude, longitude, store, limit, radius }) => {
    return apiWrapper.get(`/store?latitude=${latitude}&longitude=${longitude}&max_radius=${radius}&limit=${limit}&store=${store}`)
  }

  const fetchStoreLocation = () => {
    return apiWrapper.get('/store')
  }

  const getReviewRatingBySku = (token, { sku }) => {
    return reviewRatingWrapper.get(`/product?sku=${sku}&status=10`, {}, headerWithToken(token))
  }

  const getSortReviewRating = ({ sku, filterType, star }) => {
    return reviewRatingWrapper.get(`/product?sku=${sku}&status=10&star=${star}&filterType=${filterType}`)
  }

  const getReviewByInvoice = (token, { invoiceNo, sku }) => {
    return reviewRatingWrapper.get(`/product?invoice=${invoiceNo}&sku=${sku}`)
  }

  const likeUnlikeProductReview = (data, token) => {
    return reviewRatingWrapper.put('/product/update/like', { data }, headerWithToken(token))
  }

  const getReviewCount = (token) => {
    return reviewRatingWrapper.get('/review/count', {}, headerWithToken(token))
  }

  const getUserProductReview = (token, { reviewed, limit, offset }) => {
    return reviewRatingWrapper.get(`/product?filterInvoice=1&reviewed=${reviewed}&limit=${limit}&offset=${offset}`, {}, headerWithToken(token))
  }

  const getReviewTags = ({ reviewType }) => {
    return reviewRatingWrapper.get(`/master/tag?type=${reviewType}`)
  }

  const postProductReview = (token, data) => {
    return reviewRatingWrapper.post(`/product/upsert`, { data }, headerWithToken(token))
  }

  const getServiceReview = (token, { reviewed, limit, offset }) => {
    return reviewRatingWrapper.get(`/service/?filterInvoice=1&reviewed=${reviewed}&limit=${limit}&offset=${offset}`, {}, headerWithToken(token))
  }

  const postServiceReview = (token, data) => {
    return reviewRatingWrapper.post(`/service/insert`, { data }, headerWithToken(token))
  }

  const getInvoiceConfirmation = (data) => {
    return apiWrapper.get('/reorder/invoice', data)
  }

  const customerConfirmation = (data) => {
    return apiWrapper.post('/reorder/confirmation', data)
  }

  const deliveryConfirmation = (data) => {
    return apiWrapper.post('/reorder/delivery', data)
  }

  const getOrderDataForReturn = (data) => {
    return returnRefundWrapper.get(`/return/getOrderDataForReturn?orderNo=${data.orderNo}&email=${data.email}`)
  }

  const getAddressDetail = (encryptCusId) => {
    return returnRefundWrapper.get(`/user/address/${encryptCusId}`)
  }

  const getReasons = () => {
    return returnRefundWrapper.get(`/master/refundReason`)
  }

  const uploadImage = (image, folder, tags) => {
    return returnRefundWrapper.post(`/upload?folder=${folder}&tags=${tags}`, { data: image })
  }

  const getReturnMethod = () => {
    return returnRefundWrapper.get('/returnMethod/')
  }

  const getEstimatedRefundPrice = (data) => {
    return returnRefundWrapper.post(`/return/estimationReturn`, { data })
  }

  const submitReturnRefund = (data) => {
    return returnRefundWrapper.post(`/return/createDataReturn`, { data })
  }

  const getBankAccount = (token) => {
    return returnRefundWrapper.get(`/account`, {}, { headers: { authorization: token } })
  }

  const getBank = () => {
    return returnRefundWrapper.get('/master/bank')
  }

  const getOtpRefund = (token, data) => {
    return returnRefundWrapper.post('/refund/otp', { data }, { headers: { authorization: token } })
  }

  const postCreateRefund = (token, data) => {
    return returnRefundWrapper.post('/refund/create',
      { data },
      { headers: { authorization: token } }
    )
  }

  const getStatusReturn = (data) => {
    return returnRefundWrapper.get(`/return/getStatusReturn?orderNo=${data.orderNo}&email=${data.email}`)
  }

  const editReturn = (data) => {
    return returnRefundWrapper.post('/return/editData', { ...data })
  }

  const getStaticUrl = () => {
    return apiWrapper.get('/misc/static-page-urlkey')
  }

  const sendCrashUserFeedback = (data) => {
    return feedbackWrapper.post('/', data)
  }

  const otpAce = (data) => {
    return apiWrapper.post('/ace/auth/ace/generate-otp-register', { data })
  }

  const validateOtpAce = (data) => {
    return apiWrapper.post('/ace/auth/validate-otp-ace', { data })
  }

  const registerAce = (token, data) => {
    return apiWrapper.post('/ace/user/ace/membership', { data }, headerWithToken(token))
    // return apiWrapper.post('/ace/auth/register-ace', { data }, headerWithToken(token))
  }

  const orderStatusUpdate = (data) => {
    return apiWrapper.post('/shipment/shipment-status', { data })
  }

  const verifyPhoneAce = (data) => {
    return apiWrapper.post('/ace/auth/check-phone', { data })
  }

  const loginAce = (token, data) => {
    return apiWrapper.post('/ace/user/ace/login/membership', { data }, headerWithToken(token))
    // return apiWrapper.post('/ace/auth/login-ace', { data })
  }

  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from step 2
    banner,
    brand,
    getInspirations,
    getEventDetail,
    getCmsBlockDetail,
    popularSearch,
    searchProductByKeyword,
    getCategoryTree,
    getCategoryDetail,
    getNavigationFilter,
    getProductByCategory,
    getProductByKeyword,
    getMinMaxPrice,
    getProductByGtin,
    getRelatedProducts,
    getProductDetail,
    getProductStock,
    getProductCanDelivery,
    getMaxStock,
    getBankInstallment,
    getProvince,
    getCity,
    getKecamatan,
    getExpressDelivery,
    postMembershipApiData,
    register,
    login,
    forgot,
    userProfile,
    toggleWishlist,
    getWishlist,
    getAllWishlist,
    userUpdate,
    changePassword,
    getAddress,
    getOneAddress,
    createAddress,
    updateAddress,
    primaryAddress,
    deleteAddress,
    cekPoint,
    getUserReview,
    postSellerReview,
    redeemPoint,
    getVoucherList,
    getProductReview,
    getProductScan,
    getCart,
    cartAuth,
    createCart,
    updateCart,
    deleteCartItem,
    order,
    getOrder,
    getInvoice,
    getOrderData,
    getOrderList,
    getCartRelatedProduct,
    newsletterSubscribe,
    loginSocmed,
    getStaticDetail,
    getStaticPage,
    emailB2B,
    searchPageRedirect,
    logout,
    tahu,
    deviceToken,
    getPromoBanner,
    getCustom,
    remainingVoucher,
    checkOtpAuth,
    generateOtp,
    validateOtp,
    choicesOtp,
    updatePhoneOtp,
    resetAuth,
    forgotPassword,
    authorizeSocial,
    getLocationByIp,
    getStoreData,
    getCartType,
    storeLocations,
    getReviewRatingBySku,
    likeUnlikeProductReview,
    getSortReviewRating,
    getReviewCount,
    getUserProductReview,
    getReviewTags,
    postProductReview,
    getServiceReview,
    postServiceReview,
    getReviewByInvoice,
    getOrderDataForReturn,
    getAddressDetail,
    getReasons,
    uploadImage,
    getReturnMethod,
    getEstimatedRefundPrice,
    submitReturnRefund,
    getBankAccount,
    getBank,
    getOtpRefund,
    postCreateRefund,
    getStatusReturn,
    fetchStoreLocation,
    getVerifyMarketplaceAcquisition,
    getInvoiceConfirmation,
    customerConfirmation,
    deliveryConfirmation,
    editReturn,
    getStaticUrl,
    sendCrashUserFeedback,
    otpAce,
    validateOtpAce,
    registerAce,
    orderStatusUpdate,
    verifyPhoneAce,
    loginAce
  }
}

// let's return back our create method as the default.
export default {
  create
}
