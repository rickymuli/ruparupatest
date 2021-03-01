import SearchHistoryActions, { SearchHistoryTypes } from '../Redux/SearchHistoryRedux'
import { take, fork, put } from 'redux-saga/effects'
import { END } from 'redux-saga'
import AsyncStorage from '@react-native-async-storage/async-storage'
import isEmpty from 'lodash/isEmpty'

export function * getSearchHistory () {
  let action = yield take(SearchHistoryTypes.SEARCH_HISTORY_REQUEST)
  while (action !== END) {
    yield fork(getSearchHistoryAsync, action)
    action = yield take(SearchHistoryTypes.SEARCH_HISTORY_REQUEST)
  }
}

function * getSearchHistoryAsync () {
  try {
    const data = yield AsyncStorage.getItem('prev_search')
    if (!isEmpty(data)) {
      yield put(SearchHistoryActions.searchHistorySuccess(JSON.parse(data)))
    } else {
      yield put(SearchHistoryActions.searchHistorySuccess(null))
    }
  } catch (err) {
    yield put(SearchHistoryActions.searchHistoryFailure())
  }
}

export function * saveSearchHistory () {
  let action = yield take(SearchHistoryTypes.SAVE_SEARCH_HISTORY_REQUEST)
  while (action !== END) {
    yield fork(saveSearchHistoryAsync, action)
    action = yield take(SearchHistoryTypes.SAVE_SEARCH_HISTORY_REQUEST)
  }
}

function * saveSearchHistoryAsync ({ data }) {
  if (isEmpty(data)) {
    yield AsyncStorage.removeItem('prev_search')
    yield put(SearchHistoryActions.saveSearchHistorySuccess())
  } else {
    try {
      yield AsyncStorage.setItem('prev_search', JSON.stringify(data))
      yield put(SearchHistoryActions.searchHistoryRequest())
      yield put(SearchHistoryActions.saveSearchHistorySuccess())
    } catch (error) {
      yield put(SearchHistoryActions.saveSearchHistoryFailure())
    }
  }
}
