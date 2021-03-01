import { call, put } from 'redux-saga/effects'
import LocationActions, { LocationDataTypes } from '../Redux/LocationRedux'
import { baseListen } from './BaseSagas'

export function * getlocationByIp (api) {
  yield baseListen(LocationDataTypes.IP_LOCATION_REQUEST,
    getlocationByIpApi,
    api)
}

export function * getlocationByLonglat (api) {
  yield baseListen(LocationDataTypes.LONG_LAT_LOCATION_REQUEST,
    getlocationByLongLatApi,
    api)
}

export function * getlocationByIpApi (api) {
  try {
    const response = yield call(api.getLocationByIp)
    if (response.ok) {
      yield put(LocationActions.ipLocationSuccess(response.data))
    } else {
      yield put(LocationActions.ipLocationFailure())
    }
  } catch (e) {
    yield put(LocationActions.ipLocationFailure())
  }
}

export function * getlocationByLongLatApi (api, { data }) {
  try {
    const response = yield call(api.storeLocations, data)
    if (response.ok) {
      yield put(LocationActions.longLatLocationSuccess(response.data.data))
    } else {
      yield put(LocationActions.longLatLocationFailure())
    }
  } catch (e) {
    yield put(LocationActions.longLatLocationFailure())
  }
}
