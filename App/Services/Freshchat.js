
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import config from '../../config'
import messaging from '@react-native-firebase/messaging'

import {
  Freshchat,
  FreshchatConfig,
  FreshchatUser
} from 'react-native-freshchat-sdk'
import * as Sentry from '@sentry/react-native'

// import PushNotificationIOS from '@react-native-community/push-notification-ios'
import get from 'lodash/get'

export const InitalFreshchat = async () => {
  let freshchatConfig = new FreshchatConfig(config.freshChatAppId, config.freshChatAppKey)
  freshchatConfig.cameraCaptureEnabled = false
  freshchatConfig.showNotificationBanner = true
  freshchatConfig.notificationSoundEnabled = true
  Freshchat.init(freshchatConfig)
  // if (Platform.OS === 'ios') {
  //   permissions = {
  //     alert: true,
  //     badge: true,
  //     sound: true
  //   }
  //   PushNotificationIOS.requestPermissions(permissions)
  //   PushNotificationIOS.addEventListener('register', token => {
  //     Freshchat.setPushRegistrationToken(token)
  //   })
  // } else {
  try {
    const token = await messaging().getToken()
    if (token) Freshchat.setPushRegistrationToken(token)
  } catch (err) {
    Sentry.captureException(err)
  }
  // }
  // Linking.openURL(`mailto:rickyfabian999@gmail.com?subject=sendmail&body=${token}`)
}

export const setFreshchatUser = async (user, reset) => {
  if (Platform.OS === 'ios' && __DEV__) return null
  try {
    if (reset) Freshchat.resetUser()
    let freshchatUser = new FreshchatUser()
    let userPropertiesJson = { 'user_type': 'guest' }
    // If user has logged in then set freshchat user to the current user
    // Else set to a default user
    if (user) {
      let freshchatRestoreId = await AsyncStorage.getItem('freshchatRestoreId')
      let restoreId = null
      if (freshchatRestoreId) {
        let restore = (JSON.parse(freshchatRestoreId)).filter((o) => o.externalId === user.email)
        restoreId = get(restore, '[0].restoreId', null)
      }
      freshchatUser.firstName = user.first_name
      freshchatUser.lastName = user.last_name
      freshchatUser.email = user.email
      freshchatUser.phone = user.phone
      userPropertiesJson.user_type = 'member'
      Freshchat.identifyUser(user.email, restoreId)
    } else {
      freshchatUser.firstName = 'Guest'
    }
    Freshchat.setUser(freshchatUser)
    Freshchat.setUserProperties(userPropertiesJson)
  } catch (err) {
    Sentry.captureException(err)
  }
}
