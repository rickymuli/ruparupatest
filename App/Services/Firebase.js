
import {
  Notification
  // NotificationOpen
} from '@react-native-firebase/app'
import messaging from '@react-native-firebase/messaging'
import dynamicLinks from '@react-native-firebase/dynamic-links'
import { sendNotification, sendNotificationIos, onNotificationOpened, onFirechatNotificationOpened } from '../Services/NotificationHelpers'
import isEmpty from 'lodash/isEmpty'
import UrlParser from '../Utils/Misc/UrlParser'
// import { Alert } from 'react-native'
import remoteConfig from '@react-native-firebase/remote-config'
// import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { Platform } from 'react-native'
import analytics from '@react-native-firebase/analytics'
import AsyncStorage from '@react-native-async-storage/async-storage'

const isIos = Platform.OS === 'ios'
// export const ListenFirebaseMessage = () => messaging().onMessage(async remoteMessage => (isIos ? sendNotificationIos(remoteMessage) : sendNotification(remoteMessage)))
export const ListenFirebaseMessage = () => {
  messaging().onMessage(async remoteMessage => {
    if (__DEV__) console.log('onMessage', remoteMessage)
    if (isIos) sendNotificationIos(remoteMessage)
    else sendNotification(remoteMessage)
    return Promise.resolve()
  })
  messaging().onNotificationOpenedApp(remoteMessage => {
    if (!isEmpty(remoteMessage)) {
      if (__DEV__) console.log('onNotificationOpenedApp') // background
      onNotificationOpened(remoteMessage)
    } else {
      onFirechatNotificationOpened(remoteMessage)
    }
  })
  // background & killed
  // messaging().setBackgroundMessageHandler(async remoteMessage => {
  //   console.log('setBackgroundMessageHandler', remoteMessage)
  //   if (!isIos && remoteMessage) sendNotification(remoteMessage)
  // })
}

export const RemoteConfig = async (params) => {
  // await remoteConfig().setConfigSettings({ isDeveloperModeEnabled: true, minimumFetchInterval: 10 }) // to disable caching while developing
  // await remoteConfig().setConfigSettings({
  //   isDeveloperModeEnabled: __DEV__
  // })
  // await remoteConfig().setDefaults({
  //   enable_ads: true,
  //   enable_patreon_login: true
  // })
  // await remoteConfig().fetch(0) <= firebase has now rejected requests
  await remoteConfig().fetch()
  const activated = await remoteConfig().activate()
  if (!activated) console.log('Remote Config not activated')
  const result = remoteConfig().getValue(params)
  return JSON.parse(result.value)
}

export const GetInitialLink = (navigationProps) => {
  dynamicLinks()
    .getInitialLink()
    .then((url) => console.log('GetInitialLink', url) && navigate(url, navigationProps))
}

const navigate = async (url, navigation) => {
  if (url) { // will not accept url that's only base url without any key url
    try {
      const isObject = (typeof url) === 'object'
      let newUrl = url

      if (!isObject) { // marketplace acquisition url is type object
        if (url.includes('/ace')) {
          newUrl = url.replace('/ace', '')
        } else if (url.includes('/informa')) {
          newUrl = url.replace('/informa', '')
        }
      }
      const urlParam = UrlParser(newUrl)
      const { urlKey, query } = urlParam
      let { page = '', method = '', marketplace = '' } = query
      if (!urlParam || (isEmpty(page) && !urlParam)) return null
      let param = {
        itmData: {
          utm_source: query.utm_source,
          utm_medium: query.utm_medium,
          utm_campaign: query.utm_campaign
        }
      }
      if (page === 'ProductCataloguePage') {
        param['itemDetail'] = (method === 'search')
          ? { data: { url_key: '' }, search: urlKey.replace('-', ' ') }
          : { data: { url_key: urlKey } }
      } else if (page === 'ProductDetailPage') param['itemData'] = { url_key: urlKey }
      else if (page === 'PromoPage') param['itemDetail'] = { data: { url_key: urlKey }, search: '' }
      else if (urlKey.includes('mp-')) { // mp-* means marketplace acquisition
        AsyncStorage.removeItem('cart_id')
        AsyncStorage.removeItem('access_token')
        // query.n === 0 => autologin, === 1 => new ruppers (non autologin)
        if (urlKey.includes('mp-s')) {
          marketplace = 'shopee'
        } else if (urlKey.includes('mp-t')) {
          marketplace = 'tokopedia'
        }
        analytics().logEvent('marketplace_acquisition', { utm_source: marketplace, utm_medium: 'referral', utm_campaign: 'akuisisi' })
        param['deeplink'] = { data: { order: query.order, autoLogin: parseInt(query.n), marketplace } }
        page = 'TahuStatic'
      } else if (urlParam.baseUrl.match(/confirmation/)) {
        page = 'ConfirmationReorder'
        param['itemData'] = query
      }
      navigation.navigate(page, param)
    } catch (error) {

    }
  }
}

export const ListenFirebaseDynamicLinks = (navigationProps) => {
  dynamicLinks().onLink(url => navigate(url, navigationProps))
}

export const ListenFirebaseNotification = (navigationProps) => {
  messaging().onNotificationOpenedApp((notificationOpen) => {
    // Get information about the notification that was opened
    let notification: Notification = notificationOpen.notification
    // Alert.alert('onMessage', JSON.stringify(notification))
    console.log('ListenFirebaseNotification')
    if (!isEmpty(notification.data)) {
      onNotificationOpened(notification)
    } else {
      onFirechatNotificationOpened(notification)
    }
  })
}

export const ListenFirebaseInitial = () => {
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('ListenFirebaseInitial', remoteMessage)
        if (!isEmpty(remoteMessage.data)) {
          onNotificationOpened(remoteMessage)
        } else {
          onFirechatNotificationOpened(remoteMessage)
        }
      }
    })
}
