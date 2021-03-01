import { useEffect, useState } from 'react'
import { DeviceEventEmitter, BackHandler, Dimensions, ToastAndroid } from 'react-native'
import { GetState, Navigator } from '../Services/NavigationService'

const Back = (props) => {
  const [exit, setExit] = useState(false)
  useEffect(() => {
    DeviceEventEmitter.removeAllListeners('hardwareBackPress')
    DeviceEventEmitter.addListener('hardwareBackPress', () => handleHardwareBack(props))
    return () => {
      DeviceEventEmitter.removeAllListeners('hardwareBackPress')
    }
  }, [])

  const exitApp = () => {
    setTimeout(() => setExit(false), 7000)
    setExit((state) => {
      if (!state) {
        ToastAndroid.showWithGravityAndOffset(
          'Tekan sekali lagi untuk keluar',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          Dimensions.get('screen').height * 0.3
        )
        return !exit
      } BackHandler.exitApp()
    })
  }

  const handleHardwareBack = (props) => {
    const state = GetState()
    const navigator = Navigator()
    let index = state ? state.index : 0
    if (index === 0) exitApp()
    else if (state.routes[index].name === 'PaymentPage') return true
    else navigator && navigator.canGoBack() && navigator.goBack()
  }

  return (props.children)
}

export default Back
