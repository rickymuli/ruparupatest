import { put, call } from 'redux-saga/effects'
import InspirationActions, { InspirationTypes } from '../Redux/InspirationRedux'
import InspirationPromotionActions, { InspirationPromotionTypes } from '../Redux/InspirationPromotionRedux'
import { baseListen, baseFetchNoToken } from './BaseSagas'
// import { AsyncStorage } from 'react-native'
// import _ from 'lodash'

// listen to action
export function * fetchInspirationsServer (api) {
  yield baseListen(InspirationTypes.INSPIRATION_SERVER,
    fetchInspirationsAPI,
    api)
}

// flash sale api
export function * fetchInspirationsAPI (api, data) {
  // yield baseFetchNoToken(api.getInspirations,
  //   data,
  //   InspirationActions.inspirationSuccess,
  //   InspirationActions.inspirationFailure)
  // const inspirations = yield AsyncStorage.getItem('inspirations')
  // const expDateInspirations = yield AsyncStorage.getItem('expDateInspirations')
  // if (!_.isEmpty(inspirations) && expDateInspirations === moment().format('DD-MM-YYYY')) {
  //   yield put(InspirationActions.inspirationSuccess(JSON.parse(inspirations)))
  // } else {
  try {
    const res = yield call(api.getInspirations, data)
    if (!res.ok) {
      yield put(InspirationActions.inspirationFailure('Terjadi kesalahan koneksi'))
    } else {
      if (!res.data.error) {
        // AsyncStorage.setItem('expDateInspirations', moment().format('DD-MM-YYYY'))
        // AsyncStorage.setItem('inspirations', JSON.stringify(res.data.data))
        yield put(InspirationActions.inspirationSuccess(res.data.data))
      } else {
        yield put(InspirationActions.inspirationFailure(res.data.message))
      }
    }
  } catch (err) {
    yield put(InspirationActions.inspirationFailure())
  }
  // }
}

// listen to action
export function * fetchInspirationsPromoRequest (api) {
  yield baseListen(InspirationPromotionTypes.INSPIRATION_PROMO_REQUEST,
    fetchInspirationsPromoAPI,
    api)
}
// flash sale api
export function * fetchInspirationsPromoAPI (api, data) {
  yield baseFetchNoToken(api.getInspirations,
    data,
    InspirationPromotionActions.inspirationPromoSuccess,
    InspirationPromotionActions.inspirationPromoFailure)
}
