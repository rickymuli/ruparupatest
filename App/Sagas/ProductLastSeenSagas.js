import { put, take, fork, call } from 'redux-saga/effects'
import { END } from 'redux-saga'
import ProductLastSeenActions, { ProductLastSeenTypes } from '../Redux/ProductLastSeenRedux'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const getLastSeen = (state) => state.productLastSeen

function checkIsExist (arr, val) {
  return arr.some((product, index) => {
    return (product.variants[0].sku === val)
  })
}

export const productLastSeen = function * (productLastSeenData) {
  let action = yield take(ProductLastSeenTypes.PRODUCT_LAST_SEEN_REQUEST)
  while (action !== END) {
    yield fork(fetchProductLastSeen, productLastSeenData, action)
    action = yield take(ProductLastSeenTypes.PRODUCT_LAST_SEEN_REQUEST)
  }
}

export function * fetchProductLastSeen (productLastSeenData, { item }) {
  const productLastSeen = yield call(productLastSeenData)
  if (productLastSeen) {
    yield put(ProductLastSeenActions.productLastSeenSuccess(productLastSeen))
  } else {
    yield put(ProductLastSeenActions.productLastSeenFailure('empty'))
  }
}

export const productLastSeenUpdate = function * (productLastSeenData) {
  let action = yield take(ProductLastSeenTypes.PRODUCT_LAST_SEEN_UPDATE_REQUEST)
  while (action !== END) {
    yield fork(updateProductLastSeen, productLastSeenData, action)
    action = yield take(ProductLastSeenTypes.PRODUCT_LAST_SEEN_UPDATE_REQUEST)
  }
}

export function * updateProductLastSeen (productLastSeenData, { item }) {
  // const state = yield select(getLastSeen)
  // const lastSeen = (state.data && Array.isArray(state.data)) ? state.data : []
  const state = yield call(productLastSeenData)
  const lastSeen = (state && Array.isArray(state)) ? state : []
  const isExist = (lastSeen.length > 0) ? checkIsExist(lastSeen, item.variants[0].sku) : false
  let params
  if (!isExist) {
    params = yield [ item, ...lastSeen ]
    params = params.slice(0, 9)
  } else {
    var index = lastSeen.map(function (e) { return e.variants[0].sku }).indexOf(item.variants[0].sku)
    lastSeen.splice(index, 1)
    params = yield [ item, ...lastSeen ]
  }
  if (params) {
    // yield delay(0.001)
    yield AsyncStorage.setItem('product_last_seen', JSON.stringify(params))
    yield put(ProductLastSeenActions.productLastSeenSuccess(params))
  } else {
    yield put(ProductLastSeenActions.productLastSeenFailure())
  }
}
