import React, { PureComponent } from 'react'
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import get from 'lodash/get'

// component
// import Lottie from '../Components/LottieComponent'
// import OtpChoices from '../Components/OtpChoices'
// import HeaderSearchComponent from '../Components/HeaderSearchComponent'

import styled from 'styled-components'

// Redux
import OtpActions from '../Redux/OtpRedux'

class ChangePhone extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      phone: '',
      oldPhone: get(props.otp, 'generateData.phone', ''),
      err: null
    }
  }

  componentDidUpdate () {
    const { otp } = this.props
    if (otp.success && !otp.fetching) {
      this.props.otpResetStatus()
      if (otp.dataOtp.is_expired && !otp.dataOtp.is_used) {
        let data = JSON.parse(JSON.stringify(otp.generateData))
        data['email'] = ''
        data['channel'] = 'message'
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
    const { otp } = this.props
    const { phone, oldPhone } = this.state
    let newPhone = phone.replace('+', '')
    newPhone = newPhone.replace(/^62/, '0')
    if (newPhone === oldPhone) {
      this.setState({ err: 'No handphone tidak boleh sama' })
    } else {
      this.setState({ err: null })
      let data = JSON.parse(JSON.stringify(otp.generateData))
      data['phone'] = newPhone
      data['channel'] = 'message'
      data['email'] = ''
      this.props.otpSaveDataGenerate(data)
      this.props.checkOtp(data)
      // this.props.otpGenerateRequest(data)
    }
  }

  render () {
    const { otp } = this.props
    const { phone, oldPhone, err } = this.state
    return (
      <View>
        <CardHeaderSearch>
          <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 18, paddingVertical: 14 }}>Masukkan No Handphone Baru Anda</Text>
        </CardHeaderSearch>
        <View style={{ flexDirection: 'column', padding: 20 }}>
          <FormS style={{ flexDirection: 'row', backgroundColor: '#DFE7EE' }} disabled>
            <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} color={'#D4DCE6'} name='phone' size={18} />
            <Input value={oldPhone} underlineColorAndroid='transparent' />
          </FormS>
          <FormS style={{ flexDirection: 'row' }}>
            <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} color={'#D4DCE6'} name='phone' size={18} />
            <Input keyboardType={'phone-pad'} maxLength={14} value={phone} onChangeText={(phone) => this.setState({ phone })} placeholder='masukkan phone baru' placeholderTextColor='#b2bec3' underlineColorAndroid='transparent' />
          </FormS>
          {(err || otp.err || otp.errGenerate) &&
            <Text style={{ fontFamily: 'Quicksand-Medium', fontSize: 14, color: 'red', marginBottom: 10, textAlign: 'center' }}>
              {err || otp.err || otp.errGenerate || ''}
              {/* {`, Jika Anda mengalami kendala `}
              <TouchableWithoutFeedback onPress={() => Linking.openURL('https://docs.google.com/forms/d/e/1FAIpQLScdZbqcqPB6QIAsTiuTJ2SyjciFxXRcFg8Q1qJ2J3XdZ3NGaA/viewform?usp=sf_link')}>
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
  otp: state.otp,
  user: state.user
})

const dispatchToProps = (dispatch) => ({
  otpResetStatus: () => dispatch(OtpActions.otpResetStatus()),
  checkOtp: (params) => dispatch(OtpActions.otpCheckRequest(params)),
  otpSaveDataGenerate: (params) => dispatch(OtpActions.otpSaveDataGenerate(params)),
  otpGenerateRequest: (params) => dispatch(OtpActions.otpGenerateRequest(params))
})

export default connect(stateToProps, dispatchToProps)(ChangePhone)

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
