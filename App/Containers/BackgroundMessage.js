// @flow

import { useEffect } from 'react'
import messaging from '@react-native-firebase/messaging'
import { sendNotification } from '../Services/NotificationHelpers'

const BackgroundMessage = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) sendNotification(remoteMessage)
    })

    return unsubscribe
  }, [])
}

export default BackgroundMessage
