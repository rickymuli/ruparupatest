import get from 'lodash/get'
export const initialStates = {
  productScanData: null,
  productScanFetching: false,
  productScanErr: null,
  productRecomendation: null,
  fetchingProductRecomendation: false,
  productRecomendationErr: null,
  fetchingMoreProducts: false,
  fetching: false,
  payload: null,
  data: [],
  total: null,
  err: null
}

export const reducer = (state, action) => {
  switch (action.type) {
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
        data: get(action, 'data.products', []),
        total: get(action, 'data.total', 0)
      }
    case 'failure':
      return {
        ...state,
        fetching: false,
        err: action.data
      }
    case 'requestMoreProducts':
      return {
        ...state,
        fetchingMoreProducts: true,
        err: null
      }
    case 'addMoreProducts':
      return {
        ...state,
        fetchingMoreProducts: false,
        err: null,
        data: [...state.data, ...action.more]
      }
    case 'productScanRequest':
      return {
        ...state,
        productScanFetching: true,
        productScanErr: null
      }
    case 'productScanSuccess':
      return {
        ...state,
        productScanFetching: false,
        productScanData: action.data,
        productScanErr: null
      }
    case 'productScanFailure':
      return {
        ...state,
        productScanFetching: false,
        productScanErr: action.data
      }
    default: return state
  }
}
