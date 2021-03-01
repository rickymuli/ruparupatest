import { take, fork, select, put } from 'redux-saga/effects'
import { REHYDRATE } from 'redux-persist/lib/constants'
import { END } from 'redux-saga'
import analytics from '@react-native-firebase/analytics'
import { setFreshchatUser, InitalFreshchat } from '../Services/Freshchat'
import { fetchSetDeviceTokenAPI } from './AuthSagas'
// import AuthActions from '../Redux/AuthRedux'
import remoteConfig from '@react-native-firebase/remote-config'
import RemoteConfigActions from '../Redux/RemoteConfigRedux'
import * as Sentry from '@sentry/react-native'
// import { fetchUserDataAPI } from './UserSagas'
// import GetLocalData from '../Services/GetLocalData'
// import {//   Freshchat,
//   FreshchatConfig,
//   FreshchatUser
// } from 'react-native-freshchat-sdk'
// import config from '../../config'

const getAuth = (state) => state.auth
// const token = GetLocalData.getToken
// const getUser = (state) => state.user

// App listen to redux persists. If it has been rehydrated, it will start the sagas function below
export function * persistsListen (api) {
  let action = yield take(REHYDRATE)
  while (action !== END) {
    yield fork(saveDeviceToken, api)
    action = yield take(REHYDRATE)
  }
}

// Function to save the current device token to backend
function * saveDeviceToken (api) {
  const { user } = yield select(getAuth)
  yield fork(fetchSetDeviceTokenAPI, api)
  const result = yield remoteConfig().getAll()
  yield put(RemoteConfigActions.RemoteConfigSetup(result))
  yield InitalFreshchat()
  yield setFreshchatUser(user)
  if (user) {
    let id = user ? user.customer_id : null
    analytics().setUserId(id)
    Sentry.setUser(user)
    // yield fork(fetchUserDataAPI, api, token)
    // analytics().setUserProperty('email', user.email)
    // analytics().setUserProperty('gender', user.gender)
  } else {
    analytics().setUserId('guests')
    Sentry.setUser({ email: 'guests' })
  }
}
