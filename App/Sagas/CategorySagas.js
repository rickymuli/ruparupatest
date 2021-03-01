import { put, call } from 'redux-saga/effects'
import CategoryDetailActions, { CategoryDetailTypes } from '../Redux/CategoryDetailRedux'
import ProductActions from '../Redux/ProductRedux'
import { baseListen, baseFetchNoToken } from './BaseSagas'

// listen to action
export function * fetchCategoryDetailServer (api) {
  yield baseListen(CategoryDetailTypes.CATEGORY_DETAIL_SERVER,
    fetchCategoryDetailAPI,
    api)
}

export function * fetchCategoryDetail (api) {
  yield baseListen(CategoryDetailTypes.CATEGORY_DETAIL_REQUEST,
    fetchCategoryDetailAPI,
    api)
}

// attempts to fetch Category
export function * fetchCategoryDetailAPI (api, data) {
  yield baseFetchNoToken(api.getCategoryDetail,
    data,
    CategoryDetailActions.categoryDetailSuccess,
    CategoryDetailActions.categoryDetailFailure)
}

export function * fetchCategoryDetailAndProduct (api) {
  yield baseListen(CategoryDetailTypes.CATEGORY_DETAIL_WITH_PRODUCT_REQUEST,
    fetchCategoryDetailAndProductAPI,
    api)
}

export function * fetchCategoryDetailAndProductAPI (api, data) {
  try {
    const res = yield call(api.getCategoryDetail, data)
    if (res.ok) {
      if (!res.data.error) {
        yield put(CategoryDetailActions.categoryDetailWithProductSuccess(res.data.data))
        yield put(ProductActions.productRequest(data.companyCode))
      } else {
        yield put(CategoryDetailActions.categoryDetailWithProductFailure(res.data.message))
      }
    } else {
      if (isEmpty(data.url_key)) {
        yield put(ProductActions.productByKeywordRequest())
      }
      if (res.data.message === 'Error: Data not found') {
        yield put(CategoryDetailActions.categoryDetailWithProductFailure('Email tidak terdaftar'))
      } else {
        yield put(CategoryDetailActions.categoryDetailWithProductFailure('Terjadi kesalahan koneksi'))
      }
    }
  } catch (e) {
    yield put(CategoryDetailActions.categoryDetailWithProductFailure())
  }
}
