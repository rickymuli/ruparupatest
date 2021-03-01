import { put, take, fork, select } from 'redux-saga/effects'
import ProductHandlerActions, { ProductHandlerTypes } from '../Redux/ProductHandler'
import { baseListen } from './BaseSagas'
import ProductActions from '../Redux/ProductRedux'
import { END } from 'redux-saga'
import isEmpty from 'lodash/isEmpty'

export const getCategoryDetail = (state) => state.categoryDetail

export function * fetchProductBySort (api) {
  let action = yield take(ProductHandlerTypes.PRODUCT_HANDLER_SET_SORT)
  while (action !== END) {
    yield fork(fetchProductBySortApi, api, action)
    action = yield take(ProductHandlerTypes.PRODUCT_HANDLER_SET_SORT)
  }
}

export function * fetchProductBySortApi (api, { sortType }) {
  try {
    const categoryDetail = yield select(getCategoryDetail)
    if (isEmpty(categoryDetail.data)) {
      yield put(ProductActions.productByKeywordRequest())
    } else {
      yield put(ProductActions.productRequest())
    }
  } catch (e) {
    yield put(ProductHandlerActions.productHandlerSetSortFailure())
  }
}

export function * fetchProductByFilter (api) {
  let action = yield take(ProductHandlerTypes.PRODUCT_HANDLER_SET_FILTER)
  while (action !== END) {
    yield fork(fetchProductByFilterApi, api, action)
    action = yield take(ProductHandlerTypes.PRODUCT_HANDLER_SET_FILTER)
  }
}

export function * fetchProductByFilterApi (api, { colors, minPrice, maxPrice, brands, canGoSend, labels, algolia, companyCode }) {
  try {
    const categoryDetail = yield select(getCategoryDetail)
    if (isEmpty(categoryDetail.data)) {
      yield put(ProductActions.productByKeywordRequest())
    } else {
      yield put(ProductActions.productRequest(companyCode))
    }
  } catch (e) {
    yield put(ProductHandlerActions.productHandlerSetFilterFailure())
  }
}

export function * fetchMoreProduct (api) {
  yield baseListen(ProductHandlerTypes.PRODUCT_HANDLER_GET_MORE_ITEM_REQUEST, fetchMoreProductApi, api)
}

export function * fetchMoreProductApi (api, { from, companyCode }) {
  try {
    const categoryDetail = yield select(getCategoryDetail)
    if (isEmpty(categoryDetail.data)) {
      yield put(ProductActions.productByKeywordRequest())
    } else {
      yield put(ProductActions.productRequest(companyCode))
    }
  } catch (e) {
    yield put(ProductHandlerActions.productHandlerGetMoreItemFailure(e))
  }
}
