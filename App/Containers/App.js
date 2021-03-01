import '../Config'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Alert, Platform, StatusBar, Linking, YellowBox } from 'react-native'
// import { configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import RNAsyncStorageFlipper from 'rn-async-storage-flipper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import codePush from 'react-native-code-push'
import isEmpty from 'lodash/isEmpty'

// import fontConfig from '../Config/FontConfig'
import MainStore from '../Redux'
import messaging from '@react-native-firebase/messaging'
import analytics from '@react-native-firebase/analytics'
import crashlytics from '@react-native-firebase/crashlytics'
// import perf from '@react-native-firebase/perf'
import RNRestart from 'react-native-restart'
// import DeviceInfo from 'react-native-device-info'
import AppNavigation from '../Navigation/AppNavigation'
import SplashScreen from 'react-native-splash-screen'
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler'
import * as Sentry from '@sentry/react-native'
// import { Integrations as TracingIntegrations } from "@sentry/tracing";
import config from '../../config'
import UserFeedbackModal from '../Components/UserFeedbackModal'
import CodepushMandatoryModal from '../Components/CodepushMandatoryModal'

if (__DEV__) {
  // setJSExceptionHandler((error, isFatal) => console.log('error'))
  const exceptionhandler = (error, isFatal) => {
    console.log({ error, isFatal })
    if (error) {
      if (config.codePushProd) {
        Sentry.captureException(error)
        crashlytics().recordError(error)
      } else throw new Error(error)
      if (Platform.OS === 'ios') {
        Alert.alert(
          'Unexpected error occurred',
          `
          Opss.. Terjadi kesalahan sistem,
          Tim kami sedang menangani ini.
          Silahkan restart aplikasi,
          atau check update terbaru kami.
          `,
          [{
            text: 'Check Update',
            onPress: () => {
              Linking.openURL((Platform.OS !== 'android' ? 'itms-apps://itunes.apple.com/us/app/id1324434624?mt=8' : 'https://play.google.com/store/apps/details?id=com.mobileappruparupa'))
            }
          }, {
            text: 'Restart',
            onPress: () => {
              RNRestart.Restart()
            }
          }]
        )
      }
    }
  }
  // your error handler function
  setJSExceptionHandler(exceptionhandler, true)
  // const currentHandler = getJSExceptionHandler()
  setNativeExceptionHandler(error => {
    // do the things
    if (config.codePushProd) {
      Sentry.captureException(error)
      crashlytics().recordError(error)
    } else throw new Error(error)
  })
};

// const theme = {
//   ...DefaultTheme,
//   roundness: 5,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: '#F26525',
//     text: '#757885'
//   },
//   fonts: configureFonts(fontConfig)
// }

// const codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_START, installMode: codePush.InstallMode.ON_NEXT_RESTART }

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isAppCrash: false,
      sentryCrashInfo: {
        event: {},
        hint: {}
      },
      isCodepushMandatory: false,
      codepushProgress: 0
    }
  }
  syncCodepush = async () => {
    const hasUpdate = await codePush.checkForUpdate()
    if (hasUpdate && hasUpdate.isMandatory) {
      this.setState({ isCodepushMandatory: true })
    } else if (hasUpdate) {
      codePush.sync({ installMode: codePush.InstallMode.ON_NEXT_RESTART })
    }

    const metadata = await codePush.getUpdateMetadata()
    return metadata
  }

  initSentry = async () => {
    let release, appVersion
    const packageName = (Platform.OS === 'ios') ? config.packageNameIos : config.packageNameAndroid
    if (__DEV__) appVersion = (Platform.OS === 'ios') ? config.versionStgIos : config.versionStgAndroid
    else appVersion = (Platform.OS === 'ios') ? config.versionIos : config.versionAndroid

    const codepushUpdate = await this.syncCodepush()
    if (codepushUpdate) release = `${packageName}@${codepushUpdate.appVersion}+codepush:${codepushUpdate.label}`// com.mobileappruparupa@1.6.8+codepush:v7
    else release = `${packageName}@${appVersion}` // com.mobileappruparupa@1.6.8

    Sentry.init({
      dsn: 'https://31bc020c8881488bb834122aaec3f134@o411948.ingest.sentry.io/5287890',
      autoSessionTracking: true,
      environment: 'production',
      tracesSampleRate: 0.2,
      release,
      beforeSend: beforeSend = (event, hint) => { // eslint-disable-line
        if (event.exception && (Platform.OS !== 'ios') && !isEmpty(hint.originalException)) {
          this.setState({ isAppCrash: true, sentryCrashInfo: { event, hint } })
        }
        return event
      }
      // debug: true
    })
    Sentry.setTags({ 'app.version': appVersion })
  }

  initFirebase = async () => {
    try {
      // let isMonitored = await perf().isPerformanceCollectionEnabled
      analytics().setAnalyticsCollectionEnabled(true)
      const enable = await messaging().hasPermission()
      if (enable === -1) await messaging().requestPermission()
      if (!messaging().isDeviceRegisteredForRemoteMessages) await messaging().registerDeviceForRemoteMessages()
      messaging().subscribeToTopic('general')
      messaging().subscribeToTopic(`${Platform.OS}`)
    } catch (e) {
      console.log(e)
    }
  }

  componentDidMount () {
    console.disableYellowBox = true
    YellowBox.ignoreWarnings([
      'VirtualizedLists should never be nested' // TODO: Remove when fixed
    ])
    this.initFirebase()
    if (!__DEV__) {
      try {
        if (config.codePushProd) {
          this.initSentry()
          crashlytics().setCrashlyticsCollectionEnabled(true)
        } else Sentry.init({ dsn: 'https://31bc020c8881488bb834122aaec3f134@o411948.ingest.sentry.io/5287890', debug: true, environment: 'staging', tracesSampleRate: 0.2 })
        // .then(_ => {
        //   console.log(crashlytics().isCrashlyticsCollectionEnabled, 'crashlytics enabled')
        // })
      } catch (error) {

      }
    } else {
      const isHermes = () => global.HermesInternal !== null
      console.log('isHermes', isHermes())
      RNAsyncStorageFlipper(AsyncStorage)
    }
    SplashScreen.hide()
  }
  render () {
    const { store } = MainStore
    const { isCodepushMandatory, isAppCrash, sentryCrashInfo } = this.state
    if (!store) return null
    return (
      // <Sentry.TouchEventBoundary>
      <Provider store={store}>
        {/* <PaperProvider theme={theme}> */}
        <StatusBar backgroundColor='white' barStyle='dark-content' />
        {/* <SafeAreaView style={{ flex: 1, backgroundColor: '#ffff' }}> */}
        <AppNavigation />
        <UserFeedbackModal isAppCrash={isAppCrash} sentryCrashInfo={sentryCrashInfo} />
        <CodepushMandatoryModal isCodepushMandatory={isCodepushMandatory} />
        {/* </SafeAreaView> */}
        {/* </PaperProvider> */}
      </Provider>
      // </Sentry.TouchEventBoundary>
    )
  }
}

export default codePush({ checkFrequency: codePush.CheckFrequency.MANUAL })(App)
