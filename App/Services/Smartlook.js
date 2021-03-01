import Smartlook from 'smartlook-react-native-wrapper'
import has from 'lodash/has'
import GetLocalData from './GetLocalData'
import config from '../../config'
// import { RemoteConfig } from '../Services/Firebase'

export const checkRemoteConfig = async () => {
  // const isEnabled = await RemoteConfig('smartlook_enabled')
  // return isEnabled.active
}

// smartlook_enabled
export const smartlookInit = async () => {
  try {
    Smartlook.setupAndStartRecording(config.smartlookApiKey)
    console.log('smartlook is recording: ', await Smartlook.isRecording())
    // const remoteConfigEnabled = await checkRemoteConfig()
    // if (config.smartlookEnableRecord && remoteConfigEnabled) {
    //   Smartlook.setupAndStartRecording(config.smartlookApiKey)
    //   console.log('smartlook is recording: ', await Smartlook.isRecording())
    // }
  } catch (e) {
    console.log(e)
  }
}

export const setUpIdentityNotLoggedIn = async (data) => {
  try {
    const isRecording = await Smartlook.isRecording()
    // const remoteConfigEnabled = await checkRemoteConfig()
    if (isRecording) {
      let isLoggedIn = await GetLocalData.getToken()
      if (!isLoggedIn) {
        let emailOrPhoneId = has(data, 'email') ? data.email : data.phone
        if (emailOrPhoneId) Smartlook.setUserIdentifier(emailOrPhoneId, { visitorEmail: emailOrPhoneId })
      }
    }
  } catch (error) {

  }
}

export const setUpIdentityLoggedIn = async (customerId, email, name) => {
  try {
    const isRecording = await Smartlook.isRecording()
    // const remoteConfigEnabled = await checkRemoteConfig()
    if (isRecording) Smartlook.setUserIdentifier(customerId, { visitorEmail: email, visitorName: name })
  } catch (error) {

  }
}

export const trackCustomEvent = async (eventName, props = {}) => {
  try {
    const isRecording = await Smartlook.isRecording()
    // const remoteConfigEnabled = await checkRemoteConfig()
    if (isRecording) Smartlook.trackCustomEvent(eventName, props)
  } catch (error) {

  }
}
