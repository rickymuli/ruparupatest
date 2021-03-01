import React, { useState, useEffect } from 'react'
import { View, ImageBackground, Dimensions, Platform, RefreshControl, ScrollView, Text, Image, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import has from 'lodash/has'
import get from 'lodash/get'
import styled from 'styled-components'
import ContextProvider from '../Context/CustomContext'
import useEzFetch from '../Hooks/useEzFetch'
import { useNavigation } from '@react-navigation/native'
import DeviceInfo from 'react-native-device-info'
import { LoginManager } from 'react-native-fbsdk'

// Redux
import MiscActions from '../Redux/MiscRedux'
import AuthActions from '../Redux/AuthRedux'

// UI-UX component
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import SnackbarComponent from '../Components/SnackbarComponent'
import Loading from '../Components/LottieComponent'

// Tahu conditional rendering component
import TahuMain from '../Components/TahuMain'

const { width, height } = Dimensions.get('screen')

const TahuStatic = (props) => {
  const { get, fetching: fetchingStatic } = useEzFetch()
  const { fetching: fetchingTahu } = useEzFetch()
  const { navigate } = useNavigation()

  // State
  const [deeplinkParams, setDeeplinkParams] = useState(null)
  const [itemDetail, setItemDetail] = useState(null)
  const [dataTahu, setDataTahu] = useState(null)

  // Redux State
  const misc = useSelector(state => state.misc)
  const auth = useSelector(state => state.auth)

  // Redux Action
  const dispatch = useDispatch()
  const authAutoLoginRequest = (token) => dispatch(AuthActions.authAutoLoginRequest(token))
  const miscVerifyMarketplaceAcquisitionRequest = (orderId) => dispatch(MiscActions.miscVerifyMarketplaceAcquisitionRequest(orderId))

  // Component Did Mount
  useEffect(() => {
    let tempItemDetail = props?.route?.params?.itemDetail ?? null
    let tempDeeplinkParams = props.route?.params?.deeplink ?? null
    setDeeplinkParams(tempDeeplinkParams)
    setItemDetail(tempItemDetail)
    verifyStaticRequest(tempItemDetail, tempDeeplinkParams)
  }, [])

  // Component Did Update
  useEffect(() => {
    let newItemDetail = props?.route?.params?.itemDetail ?? null
    if (!isEqual(newItemDetail, itemDetail) && !isEmpty(itemDetail)) {
      let tempDeeplinkParams = props.route?.params?.deeplink ?? null
      setItemDetail(newItemDetail)
      setDeeplinkParams(tempDeeplinkParams)
      verifyStaticRequest(newItemDetail, tempDeeplinkParams)
    }
    if (has(misc, 'verifyMarketplaceAcquisition.token')) {
      if ((deeplinkParams?.data?.autoLogin === 0) && !auth.user && !auth.fetching) {
        authAutoLoginRequest(misc.verifyMarketplaceAcquisition.token)
      }
    }
  }, [misc, auth])

  const verifyStaticRequest = (itemDetail, deeplinkParams) => {
    if (has(deeplinkParams, 'data')) {
      marketplaceAcquisitionRequest(deeplinkParams)
    } else {
      let companyCode = get(itemDetail, 'data.company_code', '')
      let urlKey = has(itemDetail, 'url_key') ? get(itemDetail, 'url_key', '') : get(itemDetail, 'data.url_key', '')
      let bu = ''
      if (!isEmpty(companyCode)) {
        bu = (companyCode === 'AHI') ? 'ace/' : (companyCode === 'HCI') ? 'informa/' : ''
      }
      get(`${bu}routes/${urlKey}`, {},
        ({ response }) => {
          if (response.ok) {
            getTahuData(response.data.data)
          }
        }
      )
    }
  }

  const getTahuData = (dataStatic) => {
    let itemDetailTemp = props?.route?.params?.itemDetail ?? null
    let companyCode = get(itemDetailTemp, 'data.company_code', '')
    let bu = ''
    if (!isEmpty(companyCode)) {
      bu = (companyCode === 'AHI') ? 'ace/' : (companyCode === 'HCI') ? 'informa/' : ''
    }
    let companyName = (companyCode === 'AHI') ? 'ace' : (companyCode === 'HCI') ? 'informa' : 'ruparupa'
    get(`${bu}tahu/campaign/active/${dataStatic.reference_id}`, { 'user-platform': Platform.OS, 'x-company-name': companyName },
      ({ response }) => {
        if (response.ok) {
          setDataTahu(response.data.data.template[0])
        }
      })
  }

  const marketplaceAcquisitionRequest = async (deeplinkParams) => {
    const marketplaceAcquisitionTahuPage = (deeplinkParams.data.autoLogin === 0) ? 'marketplace-ruppers' : 'marketplace-non-ruppers'
    verifyStaticRequest({ url_key: marketplaceAcquisitionTahuPage })
    miscVerifyMarketplaceAcquisitionRequest(deeplinkParams.data.order)

    const uniqueId = await DeviceInfo.getUniqueId()
    dispatch(AuthActions.authLogout({ customerId: auth.user.customer_id, uniqueId }))
    LoginManager.logOut()
  }

  const gotowishlist = () => {
    navigate('Homepage', { screen: 'Wishlist' })
  }

  const refreshItems = () => {
    verifyStaticRequest(itemDetail, deeplinkParams)
  }

  const getContext = () => {
    let context = {
      companyCode: get(itemDetail, 'data.company_code', '')
    }
    return context
  }

  const toggleWishlist = (message) => {
    snackbarRef.callWithAction(message, 'Lihat Wishlist')
  }

  const callSnackbar = (message, type) => {
    snackbarRef.call(message, type)
  }

  const renderExpiredPromo = () => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
        <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 28, textAlign: 'center' }}>Promo Tidak Ditemukan</Text>
        <Image source={require('../assets/images/promo/promo-berakhir.webp')} style={{ height: width, width: width * 0.9 }} />
        <TouchableOpacity onPress={() => navigate('Homepage')} style={{ backgroundColor: '#F26525', alignSelf: 'center', paddingVertical: 10, paddingHorizontal: 26, borderRadius: 5, marginTop: 8 }}>
          <Text style={{ fontFamily: 'Quicksand-Bold', textAlign: 'center', color: 'white', fontSize: 20 }}>Kembali Ke Home</Text>
        </TouchableOpacity>
      </View>
    )
  }

  let tahuComponents = get(dataTahu, 'template_components', '')
  let marketplaceAcquisition, snackbarRef
  if (deeplinkParams) marketplaceAcquisition = { ...misc.verifyMarketplaceAcquisition, order: deeplinkParams.data.order, marketplace: deeplinkParams.data.marketplace }
  return (
    <>
      <ContextProvider value={getContext()}>
        <HeaderSearchComponent home back search cartIcon navigation={props.navigation} pageType={'tahu-page'} />
        {(fetchingStatic || fetchingTahu)
          ? <Loading />
          : (isEmpty(tahuComponents))
            ? renderExpiredPromo()
            : <>
              <ImageBackground style={{ width: width, height: height, flex: 1 }}
                source={(!isEmpty(dataTahu.background)) ? { uri: dataTahu.background } : null}
              >
                <ScrollView
                  refreshControl={
                    <RefreshControl
                      onRefresh={refreshItems.bind(this)}
                    />
                  }
                  style={{ flex: 1 }}>
                  {map(tahuComponents, (item, i) =>
                    <View style={{ backgroundColor: isEmpty(dataTahu.background) && `#${dataTahu.calendar_styles.background_color}`, flex: 1 }} key={i}>
                      <TahuMain item={item} navigation={props.navigation} toggleWishlist={toggleWishlist} callSnackbar={callSnackbar} marketplaceAcquisition={marketplaceAcquisition} />
                    </View>
                  )}
                  {(deeplinkParams && (!misc.verifyMarketplaceAcquisition || misc.verifyMarketplaceAcquisition.haveUsed)) &&
                  <ErrorMessageBox>
                    <Text style={{ color: '#a94442', fontFamily: 'Quicksand-Regular' }}>Kode promo di atas telah digunakan / expired</Text>
                  </ErrorMessageBox>
                  }
                </ScrollView>
                <SnackbarComponent ref={ref => { snackbarRef = ref }} actionHandler={gotowishlist} />
              </ImageBackground>
            </>
        }
      </ContextProvider>
    </>
  )
}

export default TahuStatic

const ErrorMessageBox = styled.View`
  borderWidth: 1; 
  borderColor: #ebccd1;
  backgroundColor: #f2dede;
  padding: 15px;
  borderRadius: 4px;
  marginBottom: 20px;
  marginTop: 5px;
  marginRight: 10px;
  marginLeft: 10px;
`
