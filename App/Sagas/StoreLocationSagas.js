import { call, put } from 'redux-saga/effects'
import StoreLocationActions, { StoreLocationTypes } from '../Redux/StoreLocationRedux'
import { baseListen } from './BaseSagas'
import get from 'lodash/get'

// listen to action
export function * fetchStoreLocation (api) {
  yield baseListen(StoreLocationTypes.STORE_LOCATION_REQUEST, fetchStoreLocationApi, api)
}

export function * fetchStoreLocationApi (api) {
  const response = yield call(api.fetchStoreLocation)
  if (response.ok) {
    yield put(StoreLocationActions.storeLocationSuccess(response.data.data))
  } else {
    yield put(StoreLocationActions.storeLocationFailure(get(response, 'data.message', 'Terjadi kesalahan koneksi')))
  }
}
