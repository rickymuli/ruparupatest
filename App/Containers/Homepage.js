import React, { useEffect, useState } from 'react'
import { View, Dimensions, RefreshControl, Linking, StatusBar } from 'react-native'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { ListenFirebaseMessage, GetInitialLink, ListenFirebaseDynamicLinks, ListenFirebaseInitial } from '../Services/Firebase'
import { navigateParamLinking } from '../Services/Dynamiclink'
// import { configPushNotification, ListenIosOpenForeground } from '../Services/NotificationHelpers'
// import { InitalFreshchat } from '../Services/Freshchat'

import { Freshchat } from 'react-native-freshchat-sdk'
// import isEmpty from 'lodash/isEmpty'

// Redux
import {
  // useSelector,
  useDispatch
} from 'react-redux'
import InspirationActions from '../Redux/InspirationRedux'
import LogActions from '../Redux/LogRedux'
import TahuActions from '../Redux/TahuRedux'
// import StoreDataAction from '../Redux/StoreDataRedux'
import config from '../../config'
import { algoliaInitClientInstance } from '../Services/AlgoliaAnalytics'
// import useEzFetch from '../Hooks/useEzFetch'
// import { CommonActions } from '@react-navigation/native'

// Components
import {
  IndexCarousel, HandleBack, Events, Inspiration, Snackbar, Update,
  ExploreByTrending, ExploreByCategory, ExploreByCategoryRecommendation, ExploreByProductRecommendation,
  CodepushDev, IndexHeader, InitStoreNewRetail
} from '../Components'
import IndexCategoryChildMenu from './IndexCategoryChildMenu'
import IndexNewRetail from '../Components/IndexNewRetail'
import { FlatList } from 'react-native-gesture-handler'

const Homepage = ({ storeCode, navigation }) => {
  // const state = useSelector(state => state.state)
  const [isScroll, setIsScroll] = useState(false)
  // const [modalIntroVisible, setModalIntroVisible] = useState(false)
  const dispatch = useDispatch()
  let snackbar
  useEffect(() => {
    dispatch(LogActions.popularSearchRequest())
    // checkFirstInstall()
    Linking.getInitialURL().then((url) => navigateParamLinking(url))
    Linking.addEventListener('url', (e) => navigateParamLinking(e.url))
    // if (Platform.OS === 'ios') {
    //   const unSubscribeIosForeground = ListenIosOpenForeground()
    // } else if (Platform.OS === 'android') configPushNotification()
    // ListenFirebaseInitial()
    // const unSubscribeFirebaseDynamicLinks = ListenFirebaseDynamicLinks(navigation)
    // GetInitialLink(navigation)
    // const unSubscribeListener = ListenFirebaseMessage()
    algoliaInitClientInstance()
    return () => {
      // unSubscribeFirebaseDynamicLinks()
      // unSubscribeIosForeground()
      // unSubscribeListener()
      // navigation.dispatch(
      //   CommonActions.reset({
      //     index: 0,
      //     routes: [
      //       { name: 'Homepage' }
      //     ]
      //   })
      // // )
      Linking.removeEventListener('url', (e) => navigateParamLinking(e.url))
      Freshchat.removeEventListeners(Freshchat.EVENT_UNREAD_MESSAGE_COUNT_CHANGED)
    }
  }, [])

  const refreshItems = () => {
    dispatch(InspirationActions.inspirationServer(storeCode))
    dispatch(TahuActions.exploreByTrendingRequest())
    dispatch(TahuActions.exploreByCategoryRequest())
  }

  // const checkFirstInstall = async () => {
  //   let alreadyInstall = await AsyncStorage.getItem('installed')
  //   if (isEmpty(alreadyInstall)) setModalIntroVisible(true)
  // }

  // const introModal = () => {
  //   return (<Modal
  //     animationType='fade'
  //     visible={modalIntroVisible}
  //     onRequestClose={() => setModalIntroVisible(false)}>
  //     <IntroModalContent setModalIntroVisible={setModalIntroVisible} />
  //   </Modal>)
  // }
  const toggleWishlist = (message) => snackbar.callWithAction(message, 'Lihat Wishlist')
  const handleScroll = (e) => {
    let y = e.nativeEvent.contentOffset.y
    if (y > 5 && !isScroll) setIsScroll(true)
    else if (y < 5 && isScroll) setIsScroll(false)
  }
  return (
    <View style={{ height: Dimensions.get('screen').height, flex: 1 }}>
      <HandleBack>
        <StatusBar translucent backgroundColor='transparent' />
        <View style={{ paddingTop: 30, paddingBottom: 10, position: 'absolute', width: '100%', zIndex: 1, backgroundColor: (isScroll ? 'white' : 'transparent') }}>
          <IndexHeader navigation={navigation} isScroll={isScroll} />
        </View>

        <FlatList
          data={[
            <IndexCarousel navigation={navigation} />,
            (config.codePushDev && <CodepushDev />),
            <IndexNewRetail />,
            <IndexCategoryChildMenu navigation={navigation} />,
            <Events data={{}} toggleWishlist={toggleWishlist} navigation={navigation} />,
            <ExploreByCategoryRecommendation navigation={navigation} />,
            <ExploreByCategory navigation={navigation} />,
            <ExploreByTrending navigation={navigation} />,
            <Inspiration titleLarge toggleWishlist={toggleWishlist} navigation={navigation} />,
            <ExploreByProductRecommendation navigation={navigation} />
          ]}
          keyExtractor={(_, index) => index}
          renderItem={({ item }) => item}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refreshItems} />
          }
          style={{ zIndex: 0 }}
          onScroll={(e) => handleScroll(e)}
        />

        <InitStoreNewRetail />
        <Update param={'maintenance'} />
        <Update param={'forceUpdate'} />
      </HandleBack>
      <Snackbar ref={r => (snackbar = r)} actionHandler={() => navigation.navigate('Homepage', { screen: 'Wishlist' })} style={{ bottom: -40, position: 'absolute' }} />
    </View>
  )
}

export default Homepage
