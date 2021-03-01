import { put, call, take, fork } from 'redux-saga/effects'
import { END } from 'redux-saga'
// import localforage from 'localforage'
import OrderActions, { OrderTypes } from '../Redux/OrderRedux'
// import CartActions from '../Redux/CartRedux'
import { baseListen } from './BaseSagas'
// import AuthActions from './AuthSagas'
import get from 'lodash/get'

// export function* order (api, getCartId) {
//   let action = yield take(OrderTypes.ORDER_REQUEST)
//   while (action !== END) {
//     yield fork(orderRequestAPI, api, getCartId, action)
//     action = yield take(OrderTypes.ORDER_REQUEST)
//   }
// }

// export function* orderRequestAPI (api, getCartId, { data }) {
//   const cartId = yield call(getCartId)
//   if (cartId) {
//     const data = { cart_id: cartId }
//     const res = yield call(api.order, data)
//     if (!res.ok) {
//       return yield put(OrderActions.orderFailure('Failed order'))
//     }
//     if (!res.data.error) {
//       yield localforage.removeItem('cart_id')
//       yield put(CartActions.cartDeleteRequest())
//       return yield put(OrderActions.orderSuccess(res.data.data))
//     } else {
//       return yield put(OrderActions.orderFailure(res.data.message))
//     }
//   }
// }

export function * fetchOrderDetail (api) {
  let action = yield take(OrderTypes.ORDER_REQUEST)
  while (action !== END) {
    yield fork(fetchOrderAPI, api, action)
    action = yield take(OrderTypes.ORDER_REQUEST)
  }
}

// export function* fetchInvoiceServer (api) {
//   let action = yield take(OrderTypes.ORDER_INVOICE_SERVER)
//   while (action !== END) {
//     yield fork(fetchInvoiceAPI, api, action)
//     action = yield take(OrderTypes.ORDER_INVOICE_SERVER)
//   }
// }

// export function* fetchOrderDataServer (api) {
//   yield baseListen(OrderTypes.ORDER_DATA_SERVER,
//     fetchOrderDataAPI,
//     api)
// }

// action taker
// export const fetchOrder = function* (api) {
//   let action = yield take(OrderTypes.ORDER_FETCH_REQUEST)
//   while (action !== END) {
//     yield fork(fetchOrderAPI, api, action)
//     action = yield take(OrderTypes.ORDER_FETCH_REQUEST)
//   }
// }

export function * fetchOrderAPI (api, { orderId, email }) {
  // Note: missing review
  const res = yield call(api.getOrder, orderId, email)
  let errorMessage = ''
  if (!res.ok) {
    if (res.problem === 'TIMEOUT_ERROR') {
      errorMessage = 'Terjadi kendala pada server. Silahkan diulangi beberapa saat lagi'
    } else {
      errorMessage = 'Maaf, Order Anda tidak ditemukan'
    }
    return yield put(OrderActions.orderFailure(errorMessage))
  }
  if (!res.data.error) {
    let data = get(res.data, 'data.mutatedData') || res.data.data
    return yield put(OrderActions.orderSuccess(data))
  } else {
    return yield put(OrderActions.orderFailure(res.data.message))
  }
}

// export function* fetchOrderDataAPI (api, data) {
//   yield baseFetchNoToken(api.getOrderData,
//     data,
//     OrderActions.orderDataSuccess,
//     OrderActions.orderDataFailure)
// }

// export function* fetchInvoiceAPI (api, data) {
//   yield baseFetchNoToken(api.getInvoice,
//     data,
//     OrderActions.orderInvoiceSuccess,
//     OrderActions.orderDataFailure)
// }

// order list
export function * orderList (api, getToken) {
  yield baseListen(OrderTypes.ORDER_LIST_REQUEST,
    fetchOrderListAPI,
    api,
    getToken)
}

// export function * fetchOrderListAPI (api, getToken, { data }) {
//   yield baseFetchToken(api.getOrderList,
//     data,
//     getToken,
//     OrderActions.orderListSuccess,
//     OrderActions.orderListFailure)
// }

export function * fetchOrderListAPI (api, getToken, { data }) {
  // Note: missing review
  const token = yield call(getToken)
  const res = yield call(api.getOrderList, token, data)
  let errorMessage = ''
  if (!res.ok) {
    if (res.problem === 'TIMEOUT_ERROR') {
      errorMessage = 'Terjadi kendala pada server. Silahkan diulangi beberapa saat lagi'
    } else {
      errorMessage = 'Maaf, Order List Anda tidak ditemukan'
    }
    return yield put(OrderActions.orderListFailure(errorMessage))
  }
  if (!res.data.error) {
    let data = get(res.data, 'data.mutatedData') || res.data.data
    return yield put(OrderActions.orderListSuccess(data))
  } else {
    return yield put(OrderActions.orderListFailure(res.data.message))
  }
}

export function * orderStatusUpdate (api) {
  yield baseListen(OrderTypes.ORDER_STATUS_UPDATE_REQUEST,
    fetchOrderStatusUpdateAPI,
    api)
}

export function * fetchOrderStatusUpdateAPI (api, { data }) {
  const res = yield call(api.orderStatusUpdate, data)
  if (res.ok && !res.data.error) {
    yield put(OrderActions.orderStatusUpdateSuccess(res.data.data))
  } else {
    yield put(OrderActions.orderStatusUpdateFailure(get(res, 'data.message', 'Terjadi kesalahan koneksi')))
  }
}

// order summary
// export function* orderSummary (api, getToken) {
//   yield baseListen(OrderTypes.ORDER_SUMMARY_REQUEST,
//     fetchOrderSummaryAPI,
//     api,
//     getToken)
// }

// export function* fetchOrderSummaryAPI (api, getToken, {data}) {
//   yield baseFetchToken(api.getOrderSummary,
//     data,
//     getToken,
//     OrderActions.orderListSuccess,
//     OrderActions.orderListFailure)
// }

// export function* orderReview (api, getToken) {
//   yield baseListen(OrderTypes.ORDER_REVIEW_REQUEST,
//     fetchOrderReviewAPI,
//     api,
//     getToken)
// }

// export function* fetchOrderReviewAPI (api, getToken, {data}) {
//   try {
//     const token = yield call(getToken)
//     if (!token) {
//       yield put(AuthActions.authLogout())
//     } else {
//       const res = yield call(api.postProductReview, token, data)
//       const resSeller = yield call(api.postSellerReview, token, data)
//       if (!res.ok && !resSeller.ok) {
//         yield put(OrderActions.orderReviewRequest('Terjadi kesalahan, ulangi beberapa saat lagi'))
//       } else {
//         if (!res.data.error) {
//           yield put(OrderActions.orderReviewSuccess(res.data.data))
//         } else {
//           yield put(OrderActions.orderReviewFailure(res.data.message))
//         }
//       }
//     }
//   } catch (e) {
//     yield put(OrderActions.orderReviewFailure(e))
//   }
// }
