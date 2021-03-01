import React, { useEffect, useMemo } from 'react'
import { Text, View, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, Linking, Image, Dimensions } from 'react-native'
import config from '../../config'
import get from 'lodash/get'
import replace from 'lodash/replace'
import Icon from 'react-native-vector-icons/Ionicons'

import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import EasyModal from '../Components/EasyModal'
import Toast, { DURATION } from 'react-native-easy-toast'

import OtpInput from '../Components/OtpInput'
import ChatButton from '../Components/ChatButton'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import AuthActions from '../Redux/AuthRedux'
import OtpActions from '../Redux/OtpRedux'
import RegisterActions from '../Redux/RegisterRedux'

const { width } = Dimensions.get('screen')
const ValidateOtp = (props) => {
  const { navigation } = props
  const updatedValue = props?.route?.params?.updatedValue ?? false
  let toast, modal

  const { successValidate, generateData = {}, dataOtp, dataTemp } = useSelector(state => state.otp)
  const { fetching: authFetching } = useSelector(state => state.auth)
  const { fetching: registerFetching } = useSelector(state => state.register)
  const { user } = useSelector(state => state.user)

  const dispatch = useDispatch()

  useEffect(() => {
    if (user && ['register', 'social-login', 'login'].includes(dataTemp.action)) {
      dispatch(OtpActions.otpInit())
      dispatch(RegisterActions.registerReset())
      dispatch(AuthActions.authResetStatus())
      navigateHome()
    }
  }, [user])

  useEffect(() => {
    if (successValidate) {
      switch (dataTemp.action) {
        case 'login': dispatch(AuthActions.authRequest(dataTemp)); break
        case 'register':
        case 'social-login':
          if (dataTemp.isLogin) dispatch(AuthActions.authRequest(dataTemp))
          else dispatch(RegisterActions.registerRequest(dataTemp))
          break
        case 'change-phone':
          if (!updatedValue) navigation.replace('ChangePhone')
          else navigateHome()
          break
        case 'change-email':
          if (!updatedValue) navigation.replace('ChangeEmail')
          else navigateHome()
          break
        case 'change-password':
        case 'forgot-password': navigation.navigate('UpdatePassword'); break
        case 'check-point': navigation.goBack(); break
        default: navigateHome()
          break
      }
    }
  }, [successValidate])

  useEffect(() => {
    let resendOtp = props?.route?.params?.resendOtp ?? false
    if (resendOtp) {
      toast.show('OTP berhasil dikirim ulang', DURATION.LENGTH_SHORT)
    }
    return () => {
      dispatch(OtpActions.otpResetStatus())
    }
  }, [])

  const navigateHome = () => {
    const fromPDP = props?.route?.params?.fromPDP ?? false
    if (fromPDP) {
      let dir = 'ProductDetailPage'
      if (get(fromPDP, 'itemData.is_extended')) dir = 'ProductDetailPageStore'
      navigation.setParams({ fromPDP: null })
      navigation.replace(dir, { ...fromPDP })
    } else {
      navigation.replace('Homepage', {
        screen: 'Home',
        params: { justLogin: true }
      })
    }
  }

  const authRequest = () => {
    if (get(dataOtp, 'is_used')) dispatch(AuthActions.authRequest(dataTemp))
    else dispatch(RegisterActions.registerRequest(dataTemp))
  }

  const channel = useMemo(() => {
    if (!generateData) return ''
    let isEmail = generateData.channel === 'email'
    let regex = isEmail ? /.(?=.{12,}$)/g : /.(?=.{3,}$)/g
    let data = isEmail ? generateData.email : generateData.phone
    return replace(data, regex, '*')
  }, [generateData])

  return (
    <View style={{ flex: 1 }}>
      <HeaderSearchComponent home pageName={'Verifikasi'} pageType={'ValidateOtp'} navigation={navigation} />
      <View style={{ paddingTop: 20, paddingHorizontal: 22 }}>
        <Text style={{ fontFamily: 'Quicksand-Medium', fontSize: 16 }}>
          {`Silahkan masukkan kode verifikasi yang telah dikirimkan ke ${channel} `}
        </Text>
        <OtpInput navigation={navigation} />
      </View>
      <Toast
        ref={(ref) => { toast = ref }}
        style={{ width: '100%', backgroundColor: '#049372', borderRadius: 0 }}
        position='top'
        positionValue={0}
        fadeInDuration={750}
        fadeOutDuration={1500}
        opacity={1}
        textStyle={{ color: '#FFFFFF', textAlign: 'center' }}
      />
      <ChatButton />
      <EasyModal ref={(ref) => { modal = ref }} size={60}>
        <View style={{ paddingVertical: 10, paddingHorizontal: 14, flexDirection: 'row-reverse' }} >
          <TouchableOpacity onPress={() => modal.setModal(false)} >
            <Icon name={'md-close'} size={24} />
          </TouchableOpacity>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={{ uri: `${config.imageRR}w_360,h_360,f_auto/v1575354545/2.1/svg/otp-not-sent-mobileapp.png` }}
            style={{ width: width * 0.5, height: width * 0.4 }} />
          <View style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
            <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 24 }}>Oops Terjadi kesalahan </Text>
          </View>
          <View style={{ paddingHorizontal: 24, width: '100%' }}>
            <TouchableOpacity onPress={() => authRequest()} disabled={(authFetching || registerFetching)} style={{ backgroundColor: '#FF7F45', alignSelf: 'stretch', paddingVertical: 10, borderRadius: 5, alignItems: 'center' }}>
              { authFetching || registerFetching
                ? <ActivityIndicator color='white' />
                : <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 16, color: 'white', textAlign: 'center' }}> Coba lagi </Text>
              }
            </TouchableOpacity>
          </View>
          <Text style={{ fontFamily: 'Quicksand-Regular', marginTop: 8 }}>
            {`Jika masalah masih terjadi, silahkan `}
            <TouchableWithoutFeedback onPress={() => Linking.openURL('https://docs.google.com/forms/d/e/1FAIpQLScdZbqcqPB6QIAsTiuTJ2SyjciFxXRcFg8Q1qJ2J3XdZ3NGaA/viewform?usp=sf_link')}>
              <Text style={{ textDecorationLine: 'underline', color: 'blue' }}>klik disini</Text>
            </TouchableWithoutFeedback>
          </Text>
        </View>
      </EasyModal>
    </View>
  )
}

export default ValidateOtp
