import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import get from 'lodash/get'

import styled from 'styled-components'

// Redux
import OtpActions from '../Redux/OtpRedux'

class ChangeEmail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      oldEmail: get(props.otp, 'generateData.email', ''),
      err: null
    }
  }

  componentDidMount () {
  }

  componentDidUpdate () {
    const { otp } = this.props
    const { email } = this.state
    if (otp.success && !otp.fetching) {
      this.props.otpResetStatus()
      if (otp.dataOtp.is_expired && !otp.dataOtp.is_used) {
        let data = JSON.parse(JSON.stringify(otp.generateData))
        data['email'] = email.toLowerCase()
        data['channel'] = 'email'
        this.props.otpGenerateRequest(data)
      }
    }
    if (otp.successGenerate && !otp.fetchingGenerate) {
      this.props.otpResetStatus()
      this.props.navigation.replace('ValidateOtp', { updatedValue: true })
    }
  }

  componentWillUnmount () {
    this.props.otpResetStatus()
  }

  checkOtp () {
    const { email, oldEmail } = this.state
    if (email === oldEmail) {
      this.setState({ err: 'Email tidak boleh sama' })
    } else {
      this.setState({ err: null })
      let data = {
        action: 'change-email',
        email: email.toLowerCase(),
        password: '',
        phone: '',
        updatedValueEmailOrPhone: true
      }
      this.props.checkOtp(data, data)
    }
  }

  render () {
    const { otp } = this.props
    const { email, oldEmail, err } = this.state
    return (
      <View>
        <CardHeaderSearch>
          <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 18, paddingVertical: 14 }}>Masukkan Email Baru Anda</Text>
        </CardHeaderSearch>
        <View style={{ flexDirection: 'column', padding: 20 }}>
          <FormS style={{ flexDirection: 'row', backgroundColor: '#DFE7EE' }} disabled>
            <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} color={'#D4DCE6'} name='email' size={18} />
            <Input value={oldEmail} underlineColorAndroid='transparent' />
          </FormS>
          <FormS style={{ flexDirection: 'row' }}>
            <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} color={'#D4DCE6'} name='email' size={18} />
            <Input keyboardType={'email-address'} value={email} onChangeText={(email) => this.setState({ email })} placeholder='masukkan email baru' placeholderTextColor='#b2bec3' underlineColorAndroid='transparent' />
          </FormS>
          {(err || otp.err || otp.errGenerate) &&
            <Text style={{ fontFamily: 'Quicksand-Medium', fontSize: 14, color: 'red', marginBottom: 10, textAlign: 'center' }}>
              {err || otp.err || otp.errGenerate || ''}
              {/* {`, Jika Anda mengalami kendala `} */}
              {/* <TouchableWithoutFeedback onPress={() => Linking.openURL('https://docs.google.com/forms/d/e/1FAIpQLScdZbqcqPB6QIAsTiuTJ2SyjciFxXRcFg8Q1qJ2J3XdZ3NGaA/viewform?usp=sf_link')}>
                <Text style={{ textDecorationLine: 'underline' }}>klik di sini</Text>
              </TouchableWithoutFeedback> */}
            </Text>
          }
          <TouchableOpacity onPress={() => this.checkOtp()} style={{ backgroundColor: '#F26525', height: 40, width: '100%', borderRadius: 4, justifyContent: 'center', alignItems: 'center' }} >
            {otp.fetchingGenerate
              ? <ActivityIndicator color='white' />
              : <Text style={{ fontFamily: 'Quicksand-Bold', color: 'white', textAlign: 'center' }}> Kirim </Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const stateToProps = (state) => ({
  otp: state.otp
})

const dispatchToProps = (dispatch) => ({
  otpResetStatus: () => dispatch(OtpActions.otpResetStatus()),
  checkOtp: (params, dataTemp) => dispatch(OtpActions.otpCheckRequest(params, dataTemp)),
  otpGenerateRequest: (params) => dispatch(OtpActions.otpGenerateRequest(params))
})

export default connect(stateToProps, dispatchToProps)(ChangeEmail)

const CardHeaderSearch = styled.View`
    align-items: center;
    justify-content: center;
    background-color: white;
    padding-bottom:0px;
    box-shadow: 1px 1px 1px #D4DCE6;
    elevation:2;
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
