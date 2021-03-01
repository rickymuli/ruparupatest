import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Dimensions, ScrollView, Platform, Modal, SafeAreaView } from 'react-native'
import { RegisterButtonView, RegisterButton, TextModal, Right, ModalHeader, ErrorCenter } from '../Styles/StyledComponents'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
// import { GoogleSignin } from '@react-native-community/google-signin'
import isEmpty from 'lodash/isEmpty'
// import { LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk'

// Component
import LottieComponent from './LottieComponent'
import TermsAndConditionComponent from './TermsAndConditionComponent'
import RegisterForm from './RegisterForm'
// import DividerLoginRegister from '../Components/DividerLoginRegister'
import AuthValidator from '../Validations/Auth'
import Checkbox from './Checkbox'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import AuthActions from '../Redux/AuthRedux'
import OtpActions from '../Redux/OtpRedux'
import RegisterActions from '../Redux/RegisterRedux'

const { width } = Dimensions.get('screen')
const RegisterComponent = props => {
  const { isFocused, navigate } = useNavigation()
  const [terms, setTerms] = useState(false)
  const [subscribe, setSubscribe] = useState(true)
  const [modalTerms, setModalTerms] = useState('')
  const [action, setAction] = useState('')
  const [err, setErr] = useState('')
  let form

  const { err: otpErr, fetching: otpFetching, success } = useSelector(state => state.otp)
  const { err: authErr, fetching: authFetching } = useSelector(state => state.auth)

  const dispatch = useDispatch()
  const otpCheckRequest = (data, dataTemp) => dispatch(OtpActions.otpCheckRequest(data, dataTemp))

  useEffect(() => { setErr(authErr) }, [authErr])
  useEffect(() => { setErr(otpErr) }, [otpErr])
  useEffect(() => {
    return () => {
      dispatch(RegisterActions.registerReset())
      dispatch(AuthActions.authResetStatus())
      dispatch(OtpActions.otpResetStatus())
    }
  }, [])

  useEffect(() => {
    if (success && isFocused()) {
      dispatch(OtpActions.otpResetStatus())
      if (action === 'register') navigate('ValidateOption')
      else navigate('UpdatePhone', { validateNoPhone: true })
    }
  }, [success])

  // const googleSignUp = async () => {
  //   GoogleSignin.configure()
  //   try {
  //     await GoogleSignin.hasPlayServices()
  //     const userInfo = await GoogleSignin.signIn()
  //     let dataTemp = {
  //       first_name: userInfo.user.givenName,
  //       last_name: userInfo.user.familyName,
  //       email: userInfo.user.email,
  //       password: `Google${userInfo.user.id}`,
  //       confirm_password: `Google${userInfo.user.id}`,
  //       login_by: 'google',
  //       registered_by: 'google',
  //       action: 'social-login',
  //       isLogin: false
  //     }
  //     let data = { action: 'social-login', email: dataTemp.email, password: dataTemp.password }
  //     setAction('google-login')
  //     otpCheckRequest(data, dataTemp)
  //   } catch (error) {
  //     if (__DEV__) {
  //       console.log('Google Signin Error: ', error)
  //     }
  //   }
  // }

  // const handleFacebookLogin = async () => {
  //   // LoginManager.setLoginBehavior('WEB_ONLY')
  //   const os = Platform.OS
  //   await LoginManager.setLoginBehavior(os === 'android' ? 'web_only' : 'browser')
  //   LoginManager.logInWithPermissions(['public_profile', 'email'])
  //     .then((result) => {
  //       if (!result.isCancelled) {
  //         let req = new GraphRequest('/me', {
  //           httpMethod: 'GET',
  //           version: 'v2.5',
  //           parameters: {
  //             'fields': {
  //               'string': 'email,name,first_name,last_name'
  //             }
  //           }
  //         }, (err, res) => {
  //           if (err) {
  //             console.log('err: ', err)
  //           } else {
  //             // Success
  //             let { email } = res
  //             let data = { action: 'social-login', email, password: `FB${res.id}` }
  //             let dataTemp = {
  //               first_name: res.first_name,
  //               last_name: res.last_name,
  //               confirm_password: `FB${res.id}`,
  //               login_by: 'facebook',
  //               registered_by: 'facebook',
  //               action: 'social-login',
  //               os,
  //               isLogin: false,
  //               ...data
  //             }
  //             setAction('facebook-login')
  //             otpCheckRequest(data, dataTemp)
  //           }
  //         })
  //         // Start graph request
  //         new GraphRequestManager().addRequest(req).start()
  //       }
  //     },
  //     (error) => {
  //       if (__DEV__) {
  //         console.log('Login FB fail with error: ' + error)
  //       }
  //     })
  // }

  const checkOtp = async (params = {}) => {
    let data = { action: 'register', email: params.email, password: params.password, phone: params.phone }
    let dataTemp = { ...params, os: Platform.OS, terms, utm_parameter: props.urlParam || '', action: 'register' }
    const err = AuthValidator.registerConstraints(dataTemp)
    setErr(err)
    if (!err) {
      setAction('register')
      otpCheckRequest(data, dataTemp)
    }
  }

  // const renderTextGoogle = () => {
  //   return (
  //     <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
  //       <Image source={require('../assets/images/icon/google-btn-logo.webp')} style={{ height: 14, width: 14, paddingRight: 20 }} resizeMode='contain' />
  //       <Text style={{ fontSize: 16, color: '#757885', textAlign: 'center', fontFamily: 'Quicksand-Bold' }}> Daftar dengan Google</Text>
  //     </View>)
  // }

  return <ScrollView keyboardShouldPersistTaps='always'>
    <View style={{ flexDirection: 'column' }}>
      <View style={{ backgroundColor: '#E5F7FF', alignItems: 'center', padding: 15, flexDirection: 'row', justifyContent: 'center' }}>
        <Icon name='information-outline' size={16} style={{ marginRight: 10, color: '#757886' }} />
        <Text style={{ textAlign: 'center', color: '#757886', fontSize: 14, fontFamily: 'Quicksand-Bold' }}>
        Voucher Rp 50.000 untuk member baru
        </Text>
      </View>
      <View style={{ flexDirection: 'column', backgroundColor: 'white', padding: 20, paddingBottom: 30 }}>
        <RegisterForm ref={ref => { form = ref }} checkOtp={checkOtp.bind(this)} />
        <TouchableOpacity onPress={() => setTerms(prevState => !prevState)} style={{ flexDirection: 'row', marginTop: 20, marginBottom: 10, alignItems: 'center' }}>
          <Checkbox onPress={() => setTerms(prevState => !prevState)} selected={terms} color='#F26525' />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: width * 0.75 }}>
            <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886' }}>Saya setuju dengan</Text>
            <TouchableOpacity onPress={() => setModalTerms(true)}>
              <Text style={{ fontFamily: 'Quicksand-Bold', color: '#757886' }}>{` Syarat & ketentuan `}</Text>
            </TouchableOpacity>
            <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886' }}>di ruparupa.com</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSubscribe(prevState => !prevState)} style={{ flexDirection: 'row', marginTop: 20, marginBottom: 20, alignItems: 'center' }}>
          <Checkbox onPress={() => setSubscribe(prevState => !prevState)} selected={subscribe} color='#F26525' />
          <View style={{ flexWrap: 'wrap', width: width * 0.75 }}>
            <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886' }} >Berlangganan penawaran menarik dari kami</Text>
          </View>
        </TouchableOpacity>
        {!isEmpty(err) &&
        <ErrorCenter>
          {`${err}. Jika ada keluhan silakan klik icon chat di kanan bawah.`}
          {/* {`, Jika Anda mengalami kendala `}
          <TouchableWithoutFeedback onPress={() => Linking.openURL('https://docs.google.com/forms/d/e/1FAIpQLScdZbqcqPB6QIAsTiuTJ2SyjciFxXRcFg8Q1qJ2J3XdZ3NGaA/viewform?usp=sf_link')}>
            <Text style={{ textDecorationLine: 'underline' }}>klik di sini</Text>
          </TouchableWithoutFeedback> */}
        </ErrorCenter>}
        {(!terms)
          ? <RegisterButtonView style={{ opacity: 0.5 }}>
            <Text style={{ fontSize: 16, color: 'white', fontFamily: 'Quicksand-Bold' }}>Daftar</Text>
          </RegisterButtonView>
          : ((otpFetching || authFetching) && action === 'register' && isEmpty(err))
            ? <RegisterButtonView>
              <LottieComponent buttonBlueLoading style={{ height: 16, width: 21 }} />
            </RegisterButtonView>
            : <RegisterButton onPress={() => form.checkOtp()}>
              <Text style={{ fontSize: 16, color: 'white', fontFamily: 'Quicksand-Bold' }}>Daftar</Text>
            </RegisterButton>
        }
        {/* <DividerLoginRegister /> */}
        {/* {(!terms)
          ? <View>
            <GoogleButtonView style={{ opacity: 0.5 }}>
              {renderTextGoogle()}
            </GoogleButtonView>
            <View style={{ marginTop: 25, paddingVertical: 10, backgroundColor: '#4267B2', borderRadius: 3, marginBottom: 15, opacity: 0.7 }}>
              <Text style={{ fontSize: 16, color: 'white', textAlign: 'center', fontFamily: 'Quicksand-Bold' }}><Icon style={{ alignSelf: 'center', marginRight: 20 }} size={18} name='facebook-box' color={'white'} /> Daftar dengan Facebook</Text>
            </View>
          </View>
          : ((otpFetching || authFetching) && action === 'google-login' && isEmpty(err))
            ? <GoogleButtonView>
              <LottieComponent loginRegisterPageGoogle style={{ height: 25, width: 30 }} />
            </GoogleButtonView>
            : ((otpFetching || authFetching) && action === 'facebook-login' && isEmpty(err))
              ? <View style={{ paddingVertical: 10, backgroundColor: '#4267B2', borderRadius: 3, marginBottom: 15 }}>
                <LottieComponent loginRegisterPageFB style={{ height: 25, width: 30 }} />
              </View>
              : <View>
                <GoogleButton onPress={() => googleSignUp()}>
                  {renderTextGoogle()}
                </GoogleButton>
                <TouchableOpacity onPress={() => handleFacebookLogin()} style={{ marginTop: 25, paddingVertical: 10, backgroundColor: '#4267B2', borderRadius: 3, marginBottom: 15 }}>
                  <Text style={{ fontSize: 16, color: 'white', textAlign: 'center', fontFamily: 'Quicksand-Bold' }}><Icon style={{ alignSelf: 'center', marginRight: 20 }} size={18} name='facebook-box' color={'white'} /> Daftar dengan Facebook</Text>
                </TouchableOpacity>
              </View>
        } */}
      </View>
    </View>
    <Modal
      animationType='slide'
      transparent={false}
      visible={modalTerms}
      onRequestClose={() => {
        setModalTerms(false)
      }}>
      <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>
        <ModalHeader>
          <TextModal>Syarat dan Ketentuan</TextModal>
          <Right><Icon name='close-circle' size={24} color='#D4DCE6' onPress={() => setModalTerms(false)} /></Right>
        </ModalHeader>
        <ScrollView>
          <TermsAndConditionComponent fromRegis />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  </ScrollView>
}

export default RegisterComponent
