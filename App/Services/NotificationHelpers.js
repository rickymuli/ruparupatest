import { RemoteMessage } from '@react-native-firebase/app'
import { Navigate } from './NavigationService'
// import messaging from '@react-native-firebase/messaging'
import PushNotification from 'react-native-push-notification'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { Platform } from 'react-native'
import split from 'lodash/split'
// import { Alert } from 'react-native'
// import config from '../../config'
import mapKeys from 'lodash/mapKeys'
import camelCase from 'lodash/camelCase'
import {
  Freshchat,
  // FreshchatConfig,
  FaqOptions
} from 'react-native-freshchat-sdk'

// shared by bgMessage & onMessage
const isIos = Platform.OS === 'ios'
export const fetching = (campaignId, param) => {
  fetch(`https://notification.ruparupa.io/${param}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Referer': 'https://www.ruparupa.com/' },
    body: JSON.stringify({ data: { campaignId } })
  }).catch((err) => console.log(err))
}

export function configPushNotification () {
  PushNotification.configure({
    onRegister: function (token) {
      // console.log('TOKEN:', token)
    },
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      // console.log('NOTIFICATION:', notification)
      if (!isIos) onNotificationOpened(notification)
      notification.finish(PushNotificationIOS.FetchResult.NoData)
    }
  })
}

export const ListenIosOpenForeground = () => {
  PushNotificationIOS.addEventListener(
    'localNotification', (notification) => {
      let data = notification._data
      onNotificationOpened({ data })
    })
}

export function sendNotification (message: RemoteMessage) {
  if (!message) return null
  // allow foreground notification for android, but not able to render image url from firebase
  try {
    const messageData = message.data ? message.data : { title: message.title, body: message.body }
    if (messageData.campaign_id) fetching(messageData.campaign_id, 'arrived')
    PushNotification.localNotification({
      /* iOS and Android properties */
      data: messageData,
      title: messageData.title || '', // (optional)
      message: messageData.body, // (required)
      playSound: true, // (optional) default: true
      soundName: (isIos ? 'default' : 'push_notif.mp3'), // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      // repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.

      /* Android properties */
      id: message.message_id,
      autoCancel: true, // (optional) default: true
      largeIcon: messageData.large_icon, // (optional) default: 'ic_launcher'
      smallIcon: 'ruparupa_android_notification', // (optional) default: 'ic_notification' with fallback for 'ic_launcher'
      bigPicture: messageData.small_picture,
      // bigContentTitle: '', // (optional) big picture title
      // summaryText: '', // (optional) big picture text
      // bigText: 'My big text that will be shown when notification is expanded My big text that will be shown when notification is expanded', // (optional) default: 'message' prop
      // subText: 'This is a subText', // (optional) default: none
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      priority: 'high',
      visibility: 'public',
      importance: 'high', // (optional) set notification importance, default: high
      allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
      ignoreInForeground: false // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
      // actions: '["Yes", "No"]', // (Android only) See the doc for notification actions to know more
    })
  } catch (error) {

  }
}

export function sendNotificationIos (message) {
  try {
    const { title, body } = message.notification
    if (message.data.campaign_id) fetching(message.data.campaign_id, 'arrived')
    const details = {
      alertTitle: title,
      alertBody: body,
      alertAction: 'view',
      isSilent: false,
      userInfo: message.data
      // soundName: 'chime.aiff'
    }
    PushNotificationIOS.presentLocalNotification(details)
    // return Promise.resolve() // for HeadlessJS
    // let data = mapKeys(message.data, (v, key) => camelCase(key))
    // if (data.campaignId) fetching(data.campaignId, 'arrived')
    // const notification = new firebase.notifications.Notification()
    //   .setNotificationId(message.notificationId)
    //   .setTitle(message.title)
    //   .setBody(message.body)
    //   .setSound('chime.aiff')
    //   .setData(data)
    //   .ios.setBadge(message.ios.badge)
    //   firebase.notifications().displayNotification(notification)
    // return Promise.resolve() // for HeadlessJS
  } catch (err) {
    console.log(err)
  }
}

export function onNotificationOpened (notification) {
  try {
    if (notification.data.aps) return null
    let data = mapKeys(notification.data, (v, key) => camelCase(key))
    let newArray = {}
    if (data.pageType === 'confirmation' || data.pageType === 'order-detail' || data.pageType === 'order-refund') newArray = split(data.urlKey, ',')
    if (data.campaignId) fetching(data.campaignId, 'clicked')
    const itmParameter = {
      itm_source: 'notification',
      itm_campaign: `notification`
    }
    const params = {
      product: {
        dir: 'ProductDetailPage',
        item: { itemData: { url_key: data.urlKey }, itmParameter }
      },
      catalog: {
        dir: 'ProductCataloguePage',
        item: { itemDetail: { search: '', data: { url_key: data.urlKey } }, itmData: itmParameter }
      },
      'status-order': {
        dir: 'OrderStatusDetail',
        item: { orderData: { email: data.userEmail, order_id: data.orderId }, itmData: itmParameter }
      },
      cart: {
        dir: 'CartPage',
        item: { itmData: itmParameter }
      },
      profile: {
        dir: 'Profil',
        item: { itmData: itmParameter }
      },
      promo: {
        dir: 'PromoPage',
        item: { itemDetail: { data: { url_key: data.urlKey } }, itmData: itmParameter }
      },
      voucher: {
        dir: 'VoucherPage',
        item: { }
      },
      wishlist: {
        dir: 'WishlistPage',
        item: { }
      },
      confirmation: {
        dir: 'ConfirmationReorder',
        item: { itemData: { invoiceId: newArray[0], email: newArray[1] } }
      },
      'order-detail': {
        dir: 'OrderStatusDetail',
        item: { orderData: { order_id: newArray[0], email: newArray[1] }, itmData: itmParameter }
      },
      'order-refund': {
        dir: 'ReturnRefundStatusPage',
        item: { orderData: { order_id: newArray[0], email: newArray[1] }, itmData: itmParameter }
      }
    }
    let param = params[data.pageType]
    if (param) Navigate(param.dir, param.item)
    // messaging().cancelNotification(notification.notificationId)
    // messaging().removeDeliveredNotification(notification.notificationId)
  } catch (err) {
    console.log(err)
  }
}

export function onFirechatNotificationOpened (notification) {
  try {
    // let freshchatConfig = new FreshchatConfig(config.freshChatAppId, config.freshChatAppKey)
    // freshchatConfig.cameraCaptureEnabled = false
    // freshchatConfig.showNotificationBanner = true
    // freshchatConfig.notificationSoundEnabled = true
    // Freshchat.init(freshchatConfig)

    var faqOptions = new FaqOptions()
    faqOptions.showContactUsOnFaqScreens = true
    faqOptions.showContactUsOnFaqNotHelpful = true

    Freshchat.showConversations()
    // messaging().cancelNotification(notification.notificationId)
    // messaging().removeDeliveredNotification(notification.notificationId)
    // messaging().cancelAllNotifications()
    // messaging().removeAllDeliveredNotifications()
  } catch (err) {
    console.log(err)
  }
}
