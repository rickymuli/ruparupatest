import 'react-native-gesture-handler'
import { AppRegistry, Platform } from 'react-native'
import App from './App/Containers/App'
import messaging from '@react-native-firebase/messaging'
import { sendNotification, fetching } from './App/Services/NotificationHelpers'
// import BackgroundMessage from './App/Containers/BackgroundMessage'
AppRegistry.registerComponent('Ruparupa', () => App)
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('setBackgroundMessageHandler', remoteMessage)
  if (Platform.OS !== 'ios') sendNotification(remoteMessage)
  else {
    // sendNotificationIos(remoteMessage)
    console.log('remoteMessage', remoteMessage)
    if (remoteMessage.data.campaign_id) fetching(remoteMessage.data.campaign_id, 'arrived')
  }
})

// For running JS on background (receiving notification while app is on the background or closed)
// AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => BackgroundMessage)
