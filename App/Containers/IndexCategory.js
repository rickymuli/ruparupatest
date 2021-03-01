import React, { Component } from 'react'
import {
  ScrollView,
  Platform,
  View,
  Dimensions,
  RefreshControl,
  Modal,
  // Text,
  // Image,
  Linking
  // InteractionManager
} from 'react-native'
// import { View as ViewAnimated } from 'react-native-animatable'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ListenFirebaseMessage, GetInitialLink, ListenFirebaseDynamicLinks, ListenFirebaseInitial } from '../Services/Firebase'
import { navigateParamLinking } from '../Services/Dynamiclink'

import { configPushNotification, ListenIosOpenForeground } from '../Services/NotificationHelpers'
import { InitalFreshchat } from '../Services/Freshchat'
import messaging from '@react-native-firebase/messaging'
import crashlytics from '@react-native-firebase/crashlytics'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import Toast from 'react-native-easy-toast'
// Redux
// import newsFeedActions from '../Redux/NewsFeedRedux'
// import InspirationPromotionActions from '../Redux/InspirationPromotionRedux'
import InspirationActions from '../Redux/InspirationRedux'
import BannerActions from '../Redux/BannerRedux'
import LogActions from '../Redux/LogRedux'
import TahuActions from '../Redux/TahuRedux'
import StoreDataAction from '../Redux/StoreDataRedux'
import {
  Freshchat
  // FreshchatConfig,
  // FreshchatUser
} from 'react-native-freshchat-sdk'
// import PushNotificationIOS from '@react-native-community/push-notificatrion-ios'
// import config from '../../config'

// Components
// import Loading from '../Components/LoadingComponent'
// import IndexNewRetail from '../Components/IndexNewRetail'
import IndexCarousel from '../Components/IndexCarousel'
import IndexCategoryChildMenu from './IndexCategoryChildMenu'
import HandleBack from '../Components/Back'
import PopupMessage from '../Components/PopupMessage'
// import IntroModalContent from '../Components/IntroModalContent'
import Events from '../Components/Events'
// import TrackUser from '../Components/TrackUser'
// import StoreCategory from '../Components/StoreCategory'
import Inspiration from '../Components/Inspiration'
import InitStoreNewRetail from '../Components/InitStoreNewRetail'
// import IndexHeader from '../Components/IndexHeader'
// import SearchButton from '../Components/SearchButton'
import Snackbar from '../Components/SnackbarComponent'
import Update from '../Components/UpdateComponent'
import ExploreByTrending from '../Components/ExploreByTrending'
import ExploreByCategory from '../Components/ExploreByCategory'
// import HeaderSearchComponent from '../Components/HeaderSearchComponent'
// import { smartlookInit } from '../Services/Smartlook'
import IndexHeader from '../Components/IndexHeader'
import ExploreByCategoryRecommendation from '../Components/ExploreByCategoryRecommendation'
import ExploreByProductRecommendation from '../Components/ExploreByProductRecommendation'
// import CodepushDev from '../Components/CodepushDev'
import { algoliaInitClientInstance } from '../Services/AlgoliaAnalytics'
import PopularSearch from '../Components/PopularSearch'
import Modal1111 from '../Components/Modal1111'

var dayjs = require('dayjs')
class IndexCategory extends Component {
  constructor (props) {
    super(props)
    this.state = {
      modalVisible: false,
      notif: 0,
      modalIntro: false,
      newsFeed: null,
      // promoInspirations: props.promoInspirations || null,
      openPromotions: true,
      refresh: false,
      scrollEventY: 0,
      unreadMessages: null,
      pageIndex: 0
      // inspiration: props.inspiration || null
    }
  }

  async componentDidMount () {
    const { navigation } = this.props
    this.props.popularSearchRequest()
    // Check first time install
    this.checkFirstInstall()
    // Firebase
    // const deviceToken = await messaging().getToken()
    // console.log(deviceToken)
    Linking.getInitialURL().then((url) => navigateParamLinking(url))
    Linking.addEventListener('url', (e) => navigateParamLinking(e.url))
    if (Platform.OS === 'ios') {
      if (!messaging().isDeviceRegisteredForRemoteMessages) {
        await messaging().registerDeviceForRemoteMessages()
      }
      this.ListenIosOpenForeground = ListenIosOpenForeground()
    } else if (Platform.OS === 'android') configPushNotification()

    this.messageListenerInitial = ListenFirebaseInitial()
    this.checkPermission()
    this.unsubscribe = ListenFirebaseDynamicLinks(navigation)
    GetInitialLink(navigation)
    this.messageListener = ListenFirebaseMessage()
    // // this.orderStatusMessageListener = this.orderStatusNotification()
    // // Method will trigger if the app was opened by a notification
    // InitializeFirebase()
    // await smartlookInit()
    await InitalFreshchat()
    algoliaInitClientInstance()
  }

  // handleOpenURL (event) {
  //   console.log('2', event.url)
  // }

  componentDidUpdate = () => {
    // if (this.props.navigation.getParam('justLogin', false)) {
    //   InteractionManager.runAfterInteractions(() => {
    //     this.props.navigation.setParams({ justLogin: false })
    //   })
    //   // this.refs.child.callWithAction(`Welcome back ${(!isEmpty(this.props.auth.user)) ? this.props.auth.user.first_name : null}`)
    // }
    if (this.state.refresh) {
      this.setState({ refresh: false })
    }
  }

  checkFirstInstall = async () => {
    let alreadyInstall = await AsyncStorage.getItem('installed')
    if (isEmpty(alreadyInstall)) {
      this.setModalIntroVisible(true)
    } else {
      // this.renderEventsAndCategory()
    }
  }

  orderStatusNotification = () => {
    messaging().onMessage((message) => {
      if (message._data.page_type === 'status-order') {
        this.setState({ notif: this.state.notif + 1 })
      }
    })
  }

  refreshItems = () => {
    this.setState({
      refresh: true
    })
    // this.renderEventsAndCategory()
    this.props.exploreByTrendingRequest()
    this.props.exploreByCategoryRequest()
    // this.props.inspirationServer()
  }

  resetNotif = () => {
    this.setState({ notif: 0 })
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    // if (nextProps.newsFeed.data !== prevState.newsFeed) {
    //   if (nextProps.newsFeed.show && !isEmpty(nextProps.newsFeed.data)) {
    //     return {
    //       newsFeed: nextProps.newsFeed.data,
    //       modalVisible: true
    //     }
    //   } else {
    //     return {
    //       newsFeed: nextProps.newsFeed.data
    //     }
    //   }
    // }
    if (nextProps.event !== prevState.event) {
      return {
        event: nextProps.event
      }
    }
    return null
  }

  setModalVisible = (visible) => {
    const { newsFeed } = this.state
    if (isEmpty(newsFeed)) {
      this.setState({ modalVisible: false })
    } else {
      this.setState({ modalVisible: visible })
    }
  }

  setModalIntroVisible = (visible) => {
    this.setState({ modalIntro: visible })
  }

  checkPermission = async () => {
    const enabled = await messaging().hasPermission()
    if (enabled && (enabled !== -1)) {
      // const channel = new firebase.notifications.Android.Channel('Notification', 'Notify Me!', firebase.notifications.Android.Importance.Max).setDescription('Main Notification for Ruparupa Mobile App!')
      // Create channel
      // messaging().android.createChannel(channel)
    } else {
      await this.requestPermission()
    }
  }

  requestPermission = async () => {
    try {
      // User is authorized
      await messaging().requestPermission()
    } catch (error) {
      crashlytics().log('Error Request Firebase Messaging Permission')
      // User has rejected permissions
    }
  }

  componentWillUnmount () {
    try {
      if (this.unsubscribel) this.unsubscribe()
      if (this.ListenIosOpenForeground) this.ListenIosOpenForeground()
      if (this.messageListenerInitial) this.messageListenerInitial()
      if (this.messageListenerIos) this.messageListenerIos()
      if (this.messageListener) this.messageListener()
      if (this.notificationOpenedListener) this.notificationOpenedListener()
      if (this.orderStatusMessageListener) this.orderStatusMessageListener()
    } catch (error) {

    }
    Freshchat.removeEventListeners(Freshchat.EVENT_UNREAD_MESSAGE_COUNT_CHANGED)
  }

  // renderEventsAndCategory = () => {
  //   const { event } = this.state
  //   const { storeCode } = this.props
  //   const { dailyDeals, flashSale, dailyDealsFetching, flashSaleFetching, dailyDealsErr, flashSaleErr } = this.props.event
  //   if (isEmpty(event) || isEmpty(event.dailyDeals) || isEmpty(event.flashSale)) {
  //     if (isEmpty(dailyDeals) && isEmpty(flashSale) && (!dailyDealsFetching || !flashSaleFetching) && (isEmpty(dailyDealsErr) || isEmpty(flashSaleErr))) {
  //       this.props.eventFlashSaleRequest(storeCode, 'flash-sale')
  //       this.props.eventDailyDealsRequest(storeCode, 'daily-deals')
  //     } else if (!isEmpty(this.props.event.dailyDeals) && !isEmpty(this.props.event.flashSale)) {
  //       this.setState({ event: this.props.event })
  //     }
  //   }
  // }

  snackbarWithAction (message, actionName, callback, duration) {
    this.refs.child.callWithAction(message, actionName, callback.bind(this), duration)
  }

  snackbarForceClose () {
    this.refs.child.forceClose()
  }

  initPage () {
    const { storeCode } = this.props
    this.props.eventFlashSaleRequest(storeCode, 'flash-sale')
    this.props.eventDailyDealsRequest(storeCode, 'daily-deals')
    // this.renderEventsAndCategory()
    // this.props.inspirationServer()
    this.props.homeRequest()
    this.props.popularSearchRequest()
    this.snackbarForceClose()
  }

  toggleWishlist (message) {
    // this.refs.toast.show(message, DURATION.LENGTH_SHORT)
    this.refs.child.callWithAction(message, 'Lihat Wishlist')
  }

  gotowishlist () {
    this.props.navigation.navigate('Homepage', { screen: 'Wishlist' })
  }

  handleScroll (e) {
    const { scrollEventY } = this.state
    let y = e.nativeEvent.contentOffset.y
    if (y > 300) this.setState({ scrollEventY: (y - 300) / 100 })
    else if (y < 300 && scrollEventY > 0) this.setState({ scrollEventY: (y - 300) / 100 })
  }

  render () {
    const { openPromotions } = this.state
    const currentTime = dayjs() // ["$L", "$d", "$x", "$y", "$M", "$D", "$W", "$H", "$m", "$s", "$ms"]
    return (
      <View style={{ height: Dimensions.get('screen').height, flex: 1 }}>
        <HandleBack>
          {/* <TrackUser /> */}
          {/* <HeaderSearchComponent help logo cartIcon withoutBoxShadow resetNotif={this.resetNotif} notif={this.state.notif} setModalVisible={this.setModalVisible} navigation={this.props.navigation} /> */}
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refresh}
                onRefresh={this.refreshItems}
              />
            }
          >
            <IndexHeader navigation={this.props.navigation} />
            {/* {config.codePushDev && <CodepushDev />} */}
            <IndexCarousel navigation={this.props.navigation} />
            <IndexCategoryChildMenu navigation={this.props.navigation} />
            {/* <SearchButton navigation={this.props.navigation} /> */}
            <Events toggleWishlist={this.toggleWishlist.bind(this)} navigation={this.props.navigation} />
            <View style={{ paddingLeft: 10 }}>
              <PopularSearch navigation={this.props.navigation} />
            </View>
            <IndexCategoryChildMenu navigation={this.props.navigation} />
            <ExploreByCategory navigation={this.props.navigation} />
            <ExploreByTrending navigation={this.props.navigation} />
            <ExploreByCategoryRecommendation navigation={this.props.navigation} />
            {openPromotions && <Inspiration titleLarge toggleWishlist={this.toggleWishlist.bind(this)} navigation={this.props.navigation} />}
            <ExploreByProductRecommendation navigation={this.props.navigation} refresh={this.state.refresh} />
          </ScrollView>
          <Modal
            animationType='fade'
            transparent
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setModalVisible(false)
            }}>
            <PopupMessage newsFeed={this.state.newsFeed} setModalVisible={this.setModalVisible} />
          </Modal>
          {/* {<Modal
            animationType='fade'
            visible={this.state.modalIntro}
            onRequestClose={() => this.setModalIntroVisible(false)}>
            <IntroModalContent setModalIntroVisible={this.setModalIntroVisible.bind(this)} />
          </Modal>} */}
          <Toast
            ref='toast'
            style={{ width: '100%', backgroundColor: '#049372', borderRadius: 0 }}
            position='top'
            positionValue={0}
            fadeInDuration={750}
            fadeOutDuration={1500}
            opacity={1}
            textStyle={{ color: '#FFFFFF', textAlign: 'center' }}
          />
          <InitStoreNewRetail />
          <Update param={'maintenance'} />
          <Update param={'forceUpdate'} />
          <Update param={'promo'} navigation={this.props.navigation} />
        </HandleBack>
        {/* <RatingStore/> */}
        {(currentTime.$D >= 25 && currentTime.$D <= 30 && currentTime.$M === 0)
          ? <Modal1111 />
          : null
        }
        <Snackbar ref='child' actionHandler={this.gotowishlist.bind(this)} style={{ bottom: -40, position: 'absolute' }} />
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  // newsFeed: state.newsFeed,
  event: state.event,
  auth: state.auth,
  inspiration: state.inspiration
  // promoInspirations: state.promoInspirations
})

const mapDispatchToProps = (dispatch) => ({
  // newsFeedRequest: () => dispatch(newsFeedActions.newsFeedRequest()),
  // newsFeedAddNews: (data) => dispatch(newsFeedActions.newsFeedAddNews(data)),
  inspirationServer: (storeCode) => dispatch(InspirationActions.inspirationServer(storeCode)),
  // inspirationPromoRequest: (storeCode, type) => dispatch(InspirationPromotionActions.inspirationPromoRequest(storeCode, type))
  // initPages
  homeRequest: () => dispatch(BannerActions.homeRequest()),
  popularSearchRequest: () => dispatch(LogActions.popularSearchRequest()),
  exploreByTrendingRequest: () => dispatch(TahuActions.exploreByTrendingRequest()),
  exploreByCategoryRequest: () => dispatch(TahuActions.exploreByCategoryRequest()),
  removeStoreData: () => dispatch(StoreDataAction.removeStoreData())
})

export default connect(mapStateToProps, mapDispatchToProps)(IndexCategory)
