import StoreDataActions, { StoreDataTypes } from '../Redux/StoreDataRedux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { take, fork, put } from 'redux-saga/effects'
import { END } from 'redux-saga'
import isEmpty from 'lodash/isEmpty'
import gt from 'lodash/gt'

// listen to action
export function * checkStoreDataListen () {
  let action = yield take(StoreDataTypes.CHECK_STORE_DATA)
  while (action !== END) {
    yield fork(checkStoreDataAsyncStorage, action)
    action = yield take(StoreDataTypes.CHECK_STORE_DATA)
  }
}

// attempts to fetch Static page
export function * checkStoreDataAsyncStorage (data) {
  try {
    let storeData = yield AsyncStorage.getItem('store_data')
    if (!isEmpty(storeData)) {
      let data = JSON.parse(storeData)
      if (gt(new Date(), new Date(data.time_expire))) {
        AsyncStorage.setItem('store_data', '')
        yield StoreDataActions.removeStoreData()
      } else yield put(StoreDataActions.saveStoreData(data))
    }
  } catch (error) {
    if (__DEV__) {
      console.log('error reading store_data async storage', error)
    }
  }
}

export function * removeStoreDataListen () {
  let action = yield take(StoreDataTypes.REMOVE_STORE_DATA)
  while (action !== END) {
    yield fork(removeStoreDataStorage, action)
    action = yield take(StoreDataTypes.REMOVE_STORE_DATA)
  }
}

export function * removeStoreDataStorage () {
  try {
    yield AsyncStorage.removeItem('store_data')
  } catch (error) {
    if (__DEV__) {
      console.log('Error while trying to remove store_data storage', error)
    }
  }
}
