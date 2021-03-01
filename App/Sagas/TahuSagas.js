import { call, put } from 'redux-saga/effects'
import TahuActions, { TahuTypes } from '../Redux/TahuRedux'
import { baseListen } from './BaseSagas'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

// listen to action
export function * fetchTahu (api) {
  yield baseListen(TahuTypes.TAHU_REQUEST,
    fetchTahuAPI,
    api)
}

// Fetch TAHU Banner (Worker)
export function * fetchTahuAPI (api, { data }) {
  let resTahu = {}

  resTahu = yield call(api.tahu, data)

  if (!resTahu.ok) {
    // if (resTahu.problem === 'NETWORK_ERROR') {
    //   yield put(TahuActions.tahuFailed('Terjadi kesalahan koneksi'))
    // }
    yield put(TahuActions.tahuFailed('Terjadi kesalahan koneksi'))
  } else {
    if (isEmpty(resTahu.data.error)) {
      if (isEmpty(resTahu.data.data)) {
        yield put(TahuActions.tahuSuccess('no-campaign'))
      }
      if (resTahu.data.data.status === 'inactive') {
        yield put(TahuActions.tahuSuccess('inactive'))
      } else {
        yield put(TahuActions.tahuSuccess(get(resTahu, 'data.data.template[0]', [])))
      }
    } else {
      yield put(TahuActions.tahuFailed(resTahu.data.message))
    }
  }
}

export function * fetchTahuStatic (api) {
  yield baseListen(TahuTypes.TAHU_STATIC_REQUEST,
    fetchTahuStaticAPI,
    api)
}

// Fetch TAHU Banner (Worker)
export function * fetchTahuStaticAPI (api, { data }) {
  let resTahu = {}

  resTahu = yield call(api.tahu, data)

  if (!resTahu.ok) {
    yield put(TahuActions.tahuStaticFailed('Terjadi kesalahan koneksi'))
  } else {
    if (isEmpty(resTahu.data.error)) {
      if (isEmpty(resTahu.data.data)) {
        yield put(TahuActions.tahuStaticSuccess('no-campaign'))
      }
      if (resTahu.data.data.status === 'inactive') {
        yield put(TahuActions.tahuStaticSuccess('inactive'))
      } else {
        yield put(TahuActions.tahuStaticSuccess(get(resTahu, 'data.data.template[0]', [])))
      }
    } else {
      yield put(TahuActions.tahuStaticFailed(resTahu.data.message))
    }
  }
}

export function * fetchTahuCmsBlock (api) {
  yield baseListen(TahuTypes.TAHU_CMS_BLOCK_REQUEST, fetchTahuCmsBlockApi, api)
}

export function * fetchTahuCmsBlockApi (api, { identifier, companyCode }) {
  const response = yield call(api.getCmsBlockDetail, identifier, companyCode)
  if (response.ok) {
    yield put(TahuActions.tahuCmsBlockSuccess(response.data.data))
  } else {
    yield put(TahuActions.tahuCmsBlockFailure(get(response, 'data.message', 'Terjadi kesalahan koneksi')))
  }
}

export function * fetchExploreByTrending (api) {
  yield baseListen(TahuTypes.EXPLORE_BY_TRENDING_REQUEST, fetchExploreByTrendingApi, api)
}

export function * fetchExploreByTrendingApi (api) {
  const response = yield call(api.getCmsBlockDetail, 'explore-by-trending')
  if (response.ok) {
    yield put(TahuActions.exploreByTrendingSuccess(response.data.data))
  } else {
    yield put(TahuActions.exploreByTrendingFailure(get(response, 'data.message', 'Terjadi kesalahan koneksi')))
  }
}

export function * fetchExploreByCategory (api) {
  yield baseListen(TahuTypes.EXPLORE_BY_CATEGORY_REQUEST, fetchExploreByCategoryApi, api)
}

export function * fetchExploreByCategoryApi (api) {
  const response = yield call(api.getCmsBlockDetail, 'explore-by-category')
  if (response.ok) {
    yield put(TahuActions.exploreByCategorySuccess(response.data.data))
  } else {
    yield put(TahuActions.exploreByCategoryFailure(get(response, 'data.message', 'Terjadi kesalahan koneksi')))
  }
}
