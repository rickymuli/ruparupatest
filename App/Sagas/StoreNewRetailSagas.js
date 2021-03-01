import StoreNewRetailActions, { StoreNewRetailTypes } from '../Redux/StoreNewRetailRedux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CartActions from '../Redux/CartRedux'
import { baseListen } from './BaseSagas'
import { put, call, take } from 'redux-saga/effects'
import { END } from 'redux-saga'
import gt from 'lodash/gt'

export function * retrieveStoreNewRetail (api, token) {
  yield baseListen(StoreNewRetailTypes.RETRIEVE_STORE_NEW_RETAIL,
    fetchStoreNewRetail,
    api, token)
}

export function * fetchStoreNewRetail (api, token, { data }) {
  try {
    token = yield call(token)

    const res = yield call(api.getStoreData, data, token)
    if (!res.ok) {
      yield put(StoreNewRetailActions.storeNewRetailFailure('Terjadi kesalahan, ulangi beberapa saat lagi'))
    } else {
      if (_(res.data.error).keys().isEmpty() && res.data.data.is_valid) {
        var dt = new Date()
        dt.setHours(dt.getHours() + 2)
        // dt.setMinutes(dt.getMinutes() + 5)
        let storeNewRetailData = res.data.data
        storeNewRetailData.time_expire = dt
        yield AsyncStorage.setItem('store_new_retail_data', JSON.stringify(storeNewRetailData))
        yield put(StoreNewRetailActions.storeNewRetailSuccess(storeNewRetailData))
        yield put(CartActions.cartTypeRequest(storeNewRetailData.store_code))
      } else {
        yield put(StoreNewRetailActions.storeNewRetailFailure(res.data.message))
      }
    }
  } catch (err) {
    yield put(StoreNewRetailActions.storeNewRetailFailure('Terjadi Kesalahan Koneksi'))
  }
}

export function * getStoreNewRetail () {
  let action = yield take(StoreNewRetailTypes.GET_STORE_NEW_RETAIL)
  while (action !== END) {
    try {
      let storeNewRetailData = yield AsyncStorage.getItem('store_new_retail_data')
      storeNewRetailData = JSON.parse(storeNewRetailData)

      var dt = new Date()
      dt.setHours(dt.getHours() + 2)
      // dt.setMinutes(dt.getMinutes() + 5)
      storeNewRetailData.time_expire = dt

      if (gt(new Date(), new Date(storeNewRetailData.time_expire))) {
        AsyncStorage.removeItem('store_new_retail_data')

        yield put(StoreNewRetailActions.storeNewRetailFailure('Terjadi Kesalahan Koneksi'))
      } else yield put(StoreNewRetailActions.storeNewRetailSuccess(storeNewRetailData))
    } catch (error) {
      yield put(StoreNewRetailActions.storeNewRetailFailure('Terjadi Kesalahan Koneksi'))
    }

    action = yield take(StoreNewRetailTypes.GET_STORE_NEW_RETAIL)
  }
}

export async function * setStoreNewRetail (storeNewRetailData) {
  let action = yield take(StoreNewRetailTypes.SET_STORE_NEW_RETAIL)
  while (action !== END) {
    var dt = new Date()
    dt.setHours(dt.getHours() + 2)
    // dt.setMinutes(dt.getMinutes() + 5)
    storeNewRetailData.time_expire = dt
    await AsyncStorage.setItem('store_new_retail_data', JSON.stringify(storeNewRetailData))
    yield put(StoreNewRetailActions.storeNewRetailSuccess(storeNewRetailData))

    action = yield take(StoreNewRetailTypes.SET_STORE_NEW_RETAIL)
  }
}
