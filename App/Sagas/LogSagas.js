import { take, call, put, fork } from 'redux-saga/effects'
import { END } from 'redux-saga'
import LogActions, { LogTypes } from '../Redux/LogRedux'

export const getSearch = (state) => state.search

export const createLog = function * (api) {
  let action = yield take(LogTypes.LOG_CREATE_REQUEST)
  while (action !== END) {
    yield fork(createLogApi, api, action)
    action = yield take(LogTypes.LOG_CREATE_REQUEST)
  }
}

export function * createLogApi (api, { data }) {
  try {
    const response = yield call(api.createLog, data)
    if (response.ok) {
      if (data.searchTerm) {
        yield put(LogActions.logCreateSuccess(response.data))
      } else {
        yield put(LogActions.logUpdateSuccess(response.data))
      }
    } else {
      yield put(LogActions.logCreateFailure())
    }
  } catch (e) {
    yield put(LogActions.logCreateFailure())
  }
}

export const popularSearch = function * (api, getAlgoliaUserToken) {
  let action = yield take(LogTypes.POPULAR_SEARCH_REQUEST)
  while (action !== END) {
    yield fork(popularSearchApi, api, getAlgoliaUserToken, action)
    action = yield take(LogTypes.POPULAR_SEARCH_REQUEST)
  }
}

export function * popularSearchApi (api, getAlgoliaUserToken) {
  try {
    const algoliaUserToken = yield call(getAlgoliaUserToken)
    const response = yield call(api.popularSearch, algoliaUserToken)
    if (response.ok) {
      yield put(LogActions.popularSearchSuccess(response.data.pop))
    } else {
      yield put(LogActions.popularSearchFailure())
    }
  } catch (e) {
    yield put(LogActions.popularSearchFailure())
  }
}
