import { take, fork, call, put } from 'redux-saga/effects'
import { END } from 'redux-saga'
import AuthActions from '../Redux/AuthRedux'

export function * baseListen (type, fetchSaga, api, token, getStoreNewRetailData) {
  let action = yield take(type)
  while (action !== END) {
    if (token) {
      yield fork(fetchSaga, api, token, action, getStoreNewRetailData)
    } else {
      yield fork(fetchSaga, api, action, getStoreNewRetailData)
    }
    action = yield take(type)
  }
}

export function * baseListenCartToken (type, fetchSaga, api, token, cart, getStoreNewRetailData) {
  let action = yield take(type)
  while (action !== END) {
    if (token && cart) {
      yield fork(fetchSaga, api, token, cart, action, getStoreNewRetailData)
    } else {
      yield fork(fetchSaga, api, action, getStoreNewRetailData)
    }
    action = yield take(type)
  }
}

export function * baseFetchNoToken (api, data, successAction, failureAction) {
  try {
    const res = yield call(api, data)
    if (!res.ok) {
      if (res.data.message === 'Error: Data not found') {
        yield put(failureAction('Email tidak terdaftar'))
      } else {
        yield put(failureAction('Terjadi kesalahan koneksi'))
      }
    } else {
      if (!res.data.error) {
        yield put(successAction(res.data.data))
      } else {
        yield put(failureAction(res.data.message))
      }
    }
  } catch (e) {
    yield put(failureAction())
  }
}

export function * baseFetchToken (api, data, getToken, successAction, failureAction) {
  try {
    const token = yield call(getToken)
    if (!token) {
      yield put(AuthActions.authLogout())
    } else {
      const res = yield call(api, token, data)
      if (!res.ok) {
        if (res.data && res.data.error) {
          yield put(failureAction(res.data.message))
        } else {
          yield put(failureAction('Terjadi kesalahan koneksi'))
        }
      } else {
        if (!res.data.error) {
          yield put(successAction(res.data.data))
        } else {
          yield put(failureAction(res.data.message))
        }
      }
    }
  } catch (e) {
    yield put(failureAction())
  }
}

export function * baseFetchTokenUpdate (api, data, getToken, successAction, failureAction) {
  try {
    const token = yield call(getToken)
    if (!token) {
      yield put(AuthActions.authLogout())
    } else {
      const res = yield call(api, token, data)
      if (!res.ok) {
        if (res.data && res.data.error && res.data.message) {
          yield put(failureAction(res.data.message))
        } else {
          yield put(failureAction('Terjadi kesalahan koneksi'))
        }
      } else {
        if (!res.data.error) {
          yield put(successAction(data))
        } else {
          yield put(failureAction(res.data.message))
        }
      }
    }
  } catch (e) {
    yield put(failureAction())
  }
}

export function * baseFetchSideEffectToken (api, data, getToken, successAction, failureAction, sideEffect, sideEffectAPI) {
  try {
    const token = yield call(getToken)
    if (!token) {
      yield put(AuthActions.authLogout())
    } else {
      const res = yield call(api, token, data)
      if (!res.ok) {
        yield put(failureAction('Terjadi kesalahan koneksi'))
      } else {
        if (!res.data.error) {
          yield fork(sideEffect, sideEffectAPI, getToken)
        } else {
          yield put(failureAction(res.data.message))
        }
      }
    }
  } catch (e) {
    yield put(failureAction())
  }
}
