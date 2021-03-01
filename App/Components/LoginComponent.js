import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TextInput, TouchableOpacity, Dimensions, ScrollView, Image, Platform, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import getVersion from '../Services/GetVersion'
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin'
import auth from '@react-native-firebase/auth'
import appleAuth, {
  AppleButton,
  AppleAuthRequestScope,
  AppleAuthRequestOperation
} from '@invertase/react-native-apple-authentication'
// import { GoogleSignin } from 'react-native-google-signin'
import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'
import has from 'lodash/has'

import { PhoneOrEmail } from '../Utils/Misc'
import AuthValidator from '../Validations/Auth'
import { LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk'
import { useConfigFirestore } from '../Hooks/useFirestore'
// import { getBrand } from 'react-native-device-info'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import AuthActions from '../Redux/AuthRedux'
import OtpActions from '../Redux/OtpRedux'

// Components
import ForgotPassword from '../Components/ForgotPassword'
import DividerLoginRegister from '../Components/DividerLoginRegister'
import LottieComponent from '../Components/LottieComponent'
import TermsAndConditionComponent from './TermsAndConditionComponent'

// Style
import styled from 'styled-components'

const os = Platform.OS
const { width, height } = Dimensions.get('screen')

const LoginComponent = props => {
  const passwordRef = useRef()

  const { isFocused, navigate } = useNavigation()
  const [secure, setSecure] = useState(true)
  const [loginInput, setLoginInput] = useState('')
  const [loginIsPhone, setLoginIsPhone] = useState(false)
  const [password, setPassword] = useState('')
  const [action, setAction] = useState('')
  const [forgotPass, setForgotPass] = useState(false)
  const [err, setErr] = useState('')
  const { data: socmedActive } = useConfigFirestore('login-socmed', false)

  const { err: otpErr, fetching: otpFetching, success, dataOtp, dataTemp: temp } = useSelector(state => state.otp)
  const { err: authErr, fetching: authFetching } = useSelector(state => state.auth)

  const dispatch = useDispatch()
  const otpCheckRequest = (data, dataTemp) => dispatch(OtpActions.otpCheckRequest(data, dataTemp))

  useEffect(() => { setErr(otpErr) }, [otpErr])
  useEffect(() => {
    setErr(authErr)
    if (includes(authErr, 'OTP not verified')) {
      navigate('UpdatePhone', { validateNoPhone: false })
    }
  }, [authErr])

  useEffect(() => {
    if (os === 'ios' && appleAuth.isSupported) appleAuth.onCredentialRevoked(async () => console.warn('If this function executes, User Credentials have been Revoked'))
    return () => {
      dispatch(AuthActions.authResetStatus())
      dispatch(OtpActions.otpResetStatus())
    }
  }, [])

  useEffect(() => {
    if (success && !forgotPass && isFocused()) {
      dispatch(OtpActions.otpResetStatus())
      if (!dataOtp.is_used && !dataOtp.force_update) {
        setErr('Alamat email atau nomor telepon dan password salah')
      } else {
        let updatePhoneParams = { validateNoPhone: true }
        if (loginIsPhone) updatePhoneParams['loginInput'] = loginInput
        navigate('UpdatePhone', updatePhoneParams)

        if (!dataOtp.force_update) {
          let data = { action: 'social-login', verification_input: temp.email }
          navigate('ValidateOption', { choicesParam: { data } })
        } else navigate('UpdatePhone', { validateNoPhone: !dataOtp.is_used })
      }
    }
  }, [success])

  const checkOtp = async () => {
    let err = AuthValidator.loginConstraints({ email: loginInput, password })
    if (err) setErr(err)
    const newValue = await PhoneOrEmail(loginInput)
    if (has(newValue, 'phone')) setLoginIsPhone(true)
    if (newValue.err) setErr(newValue.err)
    else {
      let data = { action: 'login', ...newValue, password }
      let dataTemp = { email: loginInput, os, phone: '', utm_parameter: props.urlParam, ...data }
      setAction('login')
      otpCheckRequest(data, dataTemp)
    }
  }

  const onAppleButtonPress = async () => {
    try {
      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME]
      })

      // Ensure Apple returned a user identityToken
      // if (!appleAuthRequestResponse.identityToken) {
      //   throw 'Apple Sign-In failed - no identify token returned'
      // }

      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse
      const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce)

      // Sign the user in with the credential
      const result = await auth().signInWithCredential(appleCredential)
      let user = result.additionalUserInfo.profile
      const password = Math.floor(Math.random() * Math.floor(11111))
      let data = { action: 'social-login', email: (user.email || `${appleAuthRequestResponse.user}@privacy.appleid.com`), password: `Apple${password}` }
      let dataTemp = {
        first_name: `Apple${password}`,
        last_name: ' ',
        password: `Apple${password}`,
        confirm_password: `Apple${password}`,
        login_by: 'apple',
        registered_by: 'apple',
        action: 'social-login',
        isLogin: true,
        os,
        ...data
      }
      setAction('apple-login')
      otpCheckRequest(data, dataTemp)
    } catch (error) {

    }
  }

  const GoogleSigninOtp = async () => {
    try {
      await GoogleSignin.configure()
      const isSignedIn = await GoogleSignin.isSignedIn()
      if (isSignedIn) await GoogleSignin.revokeAccess()
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      let user = userInfo.user
      let data = { action: 'social-login', email: user.email, password: `Google${user.id}` }
      let dataTemp = {
        first_name: user.givenName,
        last_name: user.familyName,
        password: `Google${user.id}`,
        confirm_password: `Google${user.id}`,
        login_by: 'google',
        registered_by: 'google',
        action: 'social-login',
        isLogin: true,
        os,
        ...data
      }
      setAction('google-login')
      otpCheckRequest(data, dataTemp)
    } catch (error) {
      if (__DEV__) {
        console.log('Google Signin Error: ', error)
        console.log('Google Signin Error: ', statusCodes)
        console.log('Google Signin Error: ', error.code)
      }
    }
  }

  const handleFacebookLogin = async () => {
    // LoginManager.setLoginBehavior('WEB_ONLY')
    await LoginManager.setLoginBehavior(os === 'android' ? 'web_only' : 'browser')
    LoginManager.logInWithPermissions(['public_profile', 'email'])
      .then((result) => {
        if (!result.isCancelled) {
          let req = new GraphRequest('/me', {
            httpMethod: 'GET',
            version: 'v2.5',
            parameters: {
              'fields': {
                'string': 'email,name,first_name,last_name'
              }
            }
          }, (err, res) => {
            if (err) {
              console.log('err: ', err)
            } else {
              // Success
              let { email } = res
              let data = { action: 'social-login', email, password: `FB${res.id}` }
              let dataTemp = {
                first_name: res.first_name,
                last_name: res.last_name,
                confirm_password: `FB${res.id}`,
                login_by: 'facebook',
                registered_by: 'facebook',
                action: 'social-login',
                isLogin: true,
                os,
                ...data
              }
              setAction('facebook-login')
              otpCheckRequest(data, dataTemp)
            }
          })
          // Start graph request
          new GraphRequestManager().addRequest(req).start()
        }
      },
      (error) => {
        if (__DEV__) {
          console.log('Login FB fail with error: ' + error)
        }
      })
  }

  const clickForgotPassword = (value) => {
    setForgotPass(value)
  }

  // const unwantedBrands = ['xiaomi']
  return (
    forgotPass
      ? <ForgotPassword changeForgetPass={setForgotPass.bind(this)} />
      : <View style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps='always' >
          <View style={{ backgroundColor: 'white', flexDirection: 'column', padding: 20 }}>
            <FormS style={{ flexDirection: 'row' }}>
              <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} size={18} name='email' color={'#D4DCE6'} />
              <TextInput
                returnKeyType='next'
                blurOnSubmit={false}
                onSubmitEditing={() => passwordRef.current.focus()}
                selectionColor='rgba(242, 101, 37, 1)'
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType='email-address'
                autoCompleteType='email'
                underlineColorAndroid='transparent'
                value={loginInput} onChangeText={(e) => setLoginInput(e)}
                placeholder='Email atau No handphone'
                placeholderTextColor='#b2bec3'
                style={{ textDecorationColor: 'white', color: '#F26525', flex: 1, height: 40 }} />
            </FormS>
            <FormS style={{ flexDirection: 'row' }}>
              <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} size={18} name='lock' color={'#D4DCE6'} />
              <TextInput
                ref={passwordRef}
                autoCapitalize='none'
                selectionColor='rgba(242, 101, 37, 1)'
                underlineColorAndroid='transparent'
                keyboardType='default'
                style={{ flexGrow: 95, height: 40, color: 'rgba(242, 101, 37, 1)' }} value={password} onChangeText={(e) => setPassword(e)} placeholder='Kata sandi' placeholderTextColor='#b2bec3' secureTextEntry={secure} />
              <TouchableOpacity onPress={() => setSecure(!secure)} style={{ alignSelf: 'center', marginRight: 10 }} >
                <Icon size={18} name={`eye${secure ? '' : '-off'}`} color={'#757886'} />
              </TouchableOpacity>
            </FormS>
            {!isEmpty(err) && <Error>{`${err}. Jika ada keluhan silakan klik icon chat di kanan bawah.`}</Error>}
            <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => clickForgotPassword(true)}>
              <Text style={{ fontFamily: 'Quicksand-Bold', color: '#008CCF', fontSize: 12, textAlign: 'right', marginVertical: 10 }}>Lupa kata sandi?</Text>
            </TouchableOpacity>
            {(otpFetching || authFetching) && action === 'login'
              ? <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF7F45', paddingTop: 10, paddingBottom: 10, borderRadius: 3, marginTop: 20 }}>
                <LottieComponent buttonBlueLoading style={{ height: 25, width: 30 }} />
              </View>
              : <TouchableOpacity onPress={() => checkOtp()} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF7F45', paddingTop: 10, paddingBottom: 10, borderRadius: 3 }}>
                <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 16, color: 'white' }}>Masuk</Text>
              </TouchableOpacity>
            }
            {(os === 'android' || socmedActive) &&
              <>
                <DividerLoginRegister />
                {(otpFetching || authFetching) && action === 'google-login'
                  ? <View style={{ paddingVertical: 10, borderWidth: 1, borderColor: '#9B9B9B', borderRadius: 3, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieComponent loginRegisterPageGoogle style={{ height: 25, width: 30 }} />
                  </View>
                  : <TouchableOpacity onPress={() => GoogleSigninOtp()} style={{ paddingVertical: 10, borderWidth: 1, borderColor: '#9B9B9B', borderRadius: 3, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: '#757885', textAlign: 'center', fontFamily: 'Quicksand-Bold' }}>
                      <Image source={require('../assets/images/icon/google-btn-logo.webp')} style={{ alignSelf: 'center', height: 15, width: 15 }} /> Masuk dengan Google</Text>
                  </TouchableOpacity>
                }
                <View style={{ marginVertical: 15 }} />
                {(otpFetching || authFetching) && action === 'facebook-login'
                  ? <View style={{ paddingVertical: 10, backgroundColor: '#4267B2', borderRadius: 3, marginBottom: 15 }}>
                    <LottieComponent loginRegisterPageFB style={{ height: 25, width: 30 }} />
                  </View>
                  : <TouchableOpacity onPress={() => handleFacebookLogin()} style={{ paddingVertical: 10, backgroundColor: '#4267B2', borderRadius: 3, marginBottom: 15 }}>
                    <Text style={{ fontSize: 16, color: 'white', textAlign: 'center', fontFamily: 'Quicksand-Bold' }}>
                      <Icon style={{ alignSelf: 'center', marginRight: 20 }} size={18} name='facebook' color={'white'} /> Masuk dengan Facebook</Text>
                  </TouchableOpacity>
                }
                {os === 'ios' &&
                  <View style={{ borderWidth: 1, borderColor: '#9B9B9B', borderRadius: 3, justifyContent: 'center', alignItems: 'center' }}>
                    {(otpFetching || authFetching) && action === 'apple-login' ? <ActivityIndicator style={{ height: 40, width: 40 }} color='black' />
                      : <AppleButton
                        // buttonStyle={AppleButton.Style.WHITE}
                        // buttonType={AppleButton.Type.SIGN_IN}
                        style={{
                          borderRadius: 0,
                          width: width * 0.89,
                          height: 33
                        }}
                        onPress={() => onAppleButtonPress()}
                      />
                    }
                  </View>}
              </>

            }
            <TermsAndConditionComponent />
            <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={{ uri: 'https://res.cloudinary.com/ruparupa-com/image/upload/v1561709485/2.1/svg/Login-mobile-new.jpg' }} style={{ width: width * 0.95, height: height * 0.3 }} />
            </View>
            <View style={{ padding: 15 }}>
              <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 16, color: '#757886', textAlign: 'center' }}>{getVersion()}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
  )
}

export default LoginComponent

const FormS = styled.View`
  border: 1px #e5e9f2 solid;
  padding: 0px;
  border-radius: 3px;
  margin-top: 5px;
  margin-bottom: 10px;
`

const Error = styled.Text`
  text-align: center;
  color: #F3251D;
  font-size: 14px;
  font-family: Quicksand-Regular;
  padding-bottom: 10px;
  padding-top: 5px;
`
