import get from 'lodash/get'
export const initialStates = {
  fetching: false,
  fetchingStock: false,
  fetchingMaxStock: false,
  fetchingCanDelivery: false,
  fetchingVoucher: false,
  fetchingRemainingVoucher: false,
  fetchingRelated: false,
  data: null,
  payload: null,
  activeVariant: null,
  stock: null,
  maxStock: null,
  canDelivery: null,
  voucherDetail: null,
  remainingVoucher: null,
  relatedProducts: null,
  err: null,
  voucherRemainingErr: null
}

export const reducer = (state, action) => {
  switch (action.type) {
    // product detail
    case 'request':
      return {
        ...state,
        fetching: true,
        err: null
      }
    case 'success':
      return {
        ...state,
        fetching: false,
        err: null,
        data: action.data,
        payload: action.data,
        activeVariant: get(action, 'data.variants[0]', {})
      }
    case 'failure':
      return {
        ...state,
        fetching: false,
        err: action.error
      }
    // product detail stock
    case 'stockRequest':
      return {
        ...state,
        fetchingStock: true,
        err: null
      }
    case 'stockSuccess': {
      return {
        ...state,
        fetchingStock: false,
        stock: action.data,
        err: null
      }
    }
    case 'stockFailure':
      return {
        ...state,
        fetchingStock: false,
        stock: null,
        err: action.error
      }
    // product detail max stock
    case 'maxStockRequest':
      return {
        ...state,
        fetchingStock: true,
        err: null
      }
    case 'maxStockSuccess': {
      return {
        ...state,
        fetchingMaxStock: false,
        maxStock: action.data,
        err: null
      }
    }
    case 'maxStockFailure':
      return {
        ...state,
        fetchingMaxStock: false,
        maxStock: { max_qty: false },
        err: action.error
      }
    // product can delivery
    case 'canDeliveryRequest':
      return {
        ...state,
        fetchingCanDelivery: true,
        canDelivery: null,
        err: null
      }
    case 'canDeliverySuccess': {
      return {
        ...state,
        fetchingCanDelivery: false,
        canDelivery: action.data,
        err: null
      }
    }
    case 'canDeliveryFailure':
      return {
        ...state,
        fetchingCanDelivery: false,
        canDelivery: { can_delivery: false },
        err: action.error
      }
    // related products
    case 'relatedProductsRequest':
      return {
        ...state,
        fetchingRelated: true,
        relatedProducts: null,
        err: null
      }
    case 'relatedProductsSuccess': {
      return {
        ...state,
        fetchingRelated: false,
        relatedProducts: action.data,
        err: null
      }
    }
    case 'relatedProductsFailure':
      return {
        ...state,
        fetchingRelated: false,
        relatedProducts: null,
        err: action.data
      }
    // product voucher request
    case 'promoVoucherRequest':
      return {
        ...state,
        fetchingVoucher: true,
        err: null
      }
    case 'promoVoucherSuccess': {
      return {
        ...state,
        fetchingVoucher: false,
        voucherDetail: action.data,
        err: null
      }
    }
    case 'promoVoucherFailure':
      return {
        ...state,
        fetchingVoucher: false,
        voucherDetail: null,
        err: action.error
      }
    // product voucher remaining
    case 'voucherRemainingRequest':
      return {
        ...state,
        fetchingRemainingVoucher: true,
        remainingVoucher: null
      }
    case 'voucherRemainingSuccess': {
      return {
        ...state,
        fetchingRemainingVoucher: false,
        remainingVoucher: action.data
      }
    }
    case 'voucherRemainingFailure':
      return {
        ...state,
        fetchingRemainingVoucher: false,
        voucherRemainingErr: action.error
      }
    case 'initPdp':
      return {
        fetching: false,
        fetchingStock: false,
        fetchingMaxStock: false,
        fetchingCanDelivery: false,
        fetchingVoucher: false,
        fetchingRemainingVoucher: false,
        fetchingRelated: false,
        data: null,
        payload: null,
        activeVariant: null,
        stock: null,
        maxStock: null,
        canDelivery: null,
        voucherDetail: null,
        remainingVoucher: null,
        relatedProducts: null,
        err: null,
        voucherRemainingErr: null
      }
    default: return state
  }
}
