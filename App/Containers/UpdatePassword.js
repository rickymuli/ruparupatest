import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ActivityIndicator, Platform } from 'react-native'
import { connect } from 'react-redux'

import styled from 'styled-components'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import ChatButton from '../Components/ChatButton'

import get from 'lodash/get'

// Redux
import AuthActions from '../Redux/AuthRedux'
import OtpActions from '../Redux/OtpRedux'

class UpdatePassword extends Component {
  constructor (props) {
    super(props)
    this.state = {
      securePass: true,
      secureConfirm: true,
      password: '',
      confirmPassword: '',
      resetPassword: false
    }
  }

  componentDidUpdate () {
    const { auth, otp } = this.props
    const { resetPassword } = this.state
    if (resetPassword && !auth.fetching && !auth.err && !otp.err) {
      this.props.otpResetStatus()
      this.props.navigation.replace('Homepage')
    }
  }

  componentWillUnmount () {
    this.props.authResetStatus()
    this.props.otpResetStatus()
  }

  updatePass () {
    const { otp, resetPassword, changePasswordRequest } = this.props
    const { confirmPassword, password } = this.state
    let action = get(otp.generateData, 'action', '')
    let data = {
      confirmPassword,
      password
    }
    this.setState({ resetPassword: true })
    if (action === 'change-password') {
      changePasswordRequest(data)
    } else if (action === 'forgot-password') {
      data['token'] = get(otp, 'data.token', '')
      resetPassword(data)
    }
  }

  render () {
    const { confirmPassword, password, securePass, secureConfirm } = this.state
    const { otp, auth } = this.props
    return (
      <View style={{ flex: 1 }}>
        <CardHeaderSearch style={{ marginTop: Platform.OS === 'android' ? 10 : 0 }} >
          <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 18, paddingVertical: 14 }}>Masukkan Kata Sandi Baru Anda</Text>
        </CardHeaderSearch>
        <View style={{ flexDirection: 'column', padding: 20 }}>
          <FormS style={{ flexDirection: 'row' }}>
            <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} color={'#D4DCE6'} name='lock' size={18} />
            <Input secureTextEntry={securePass} value={password} onChangeText={(password) => this.setState({ password })} placeholder='Kata sandi baru' placeholderTextColor='#b2bec3' underlineColorAndroid='transparent' />
            <TouchableOpacity onPress={() => this.setState({ securePass: !securePass })} style={{ alignSelf: 'center', marginRight: 10 }} >
              <Icon size={18} name={`eye${securePass ? '' : '-off'}`} color={'#757886'} />
            </TouchableOpacity>
          </FormS>
          <FormS style={{ flexDirection: 'row' }}>
            <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} color={'#D4DCE6'} name='lock' size={18} />
            <Input secureTextEntry={secureConfirm} value={confirmPassword} onChangeText={(confirmPassword) => this.setState({ confirmPassword })} placeholder='Ulangi kata sandi baru' placeholderTextColor='#b2bec3' underlineColorAndroid='transparent' />
            <TouchableOpacity onPress={() => this.setState({ secureConfirm: !secureConfirm })} style={{ alignSelf: 'center', marginRight: 10 }} >
              <Icon size={18} name={`eye${secureConfirm ? '' : '-off'}`} color={'#757886'} />
            </TouchableOpacity>
          </FormS>
          {(otp.err || auth.err) &&
            <Text style={{ fontFamily: 'Quicksand-Medium', fontSize: 14, color: 'red', marginBottom: 18, textAlign: 'center' }}>
              {`${(otp.err || auth.err || '')}. Jika ada keluhan silakan klik icon chat di kanan bawah.`}
            </Text>
          }
          <TouchableOpacity onPress={() => this.updatePass()} style={{ backgroundColor: '#F26525', height: 40, width: '100%', borderRadius: 4, justifyContent: 'center', alignItems: 'center' }} >
            {auth.fetching
              ? <ActivityIndicator color='white' />
              : <Text style={{ fontFamily: 'Quicksand-Bold', color: 'white', textAlign: 'center' }}> Kirim </Text>
            }
          </TouchableOpacity>
        </View>
        <ChatButton />
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  otp: state.otp,
  auth: state.auth
})

const dispatchToProps = (dispatch) => ({
  changePasswordRequest: (param) => dispatch(AuthActions.authChangePasswordRequest(param)),
  resetPassword: (param) => dispatch(AuthActions.authResetRequest(param)),
  authResetStatus: () => dispatch(AuthActions.authResetStatus()),
  otpResetStatus: () => dispatch(OtpActions.otpResetStatus())
})

export default connect(mapStateToProps, dispatchToProps)(UpdatePassword)

const CardHeaderSearch = styled.View`
    align-items: center;
    justify-content: center;
    background-color: white;
    padding-bottom:0px;
    box-shadow: 1px 1px 1px #D4DCE6;
    elevation:2;
    padding-top: 30px
`

const FormS = styled.View`
  border: 1px #e5e9f2 solid;
  padding: 0px;
  border-radius: 3px;
  margin-top: 5px;
  margin-bottom: 10px;
`
const Input = styled.TextInput`
  text-decoration-color: white;
  color: #757885; 
  flex: 1;
  height: 40;
`
