import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { fonts } from '../Styles'

// Redux
import OtpActions from '../Redux/OtpRedux'

const { width } = Dimensions.get('screen')
class OtpChoices extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: {
        message: {
          icon: 'message-outline',
          text: `Kirim SMS ke ${get(props.otp, 'dataTemp.phone', '').replace(/.(?=.{3,}$)/g, '*')}`
        },
        chat: {
          icon: 'cellphone',
          text: `Kirim Whatsapp ke ${get(props.otp, 'dataTemp.phone', '').replace(/.(?=.{3,}$)/g, '*')}`
        },
        email: {
          icon: 'email-outline',
          text: `Kirim Email ke ${get(props.otp, 'dataTemp.email', '').replace(/.(?=.{12,}$)/g, '*')}`
        }
      }
    }
  }

  generateOtp () {
    const { otp, item } = this.props
    let data = otp.dataTemp
    let newParam = {
      action: data.action,
      channel: item,
      email: data.email,
      is_resend: 0,
      customer_id: (data.customer_id || 0).toString(),
      phone: data.phone
    }
    this.props.otpGenerateRequest(newParam)
  }

  render () {
    const { item, key } = this.props
    let param = this.state.data[item]
    if (!param) return null
    return (
      <TouchableOpacity key={key} onPress={() => this.generateOtp()} style={{ borderWidth: 1, borderColor: '#F0F2F7', width: width * 0.9, marginTop: 16 }}>
        <View style={{ flexDirection: 'row', padding: 18, alignItems: 'center' }}>
          <Icon name={param.icon} size={20} />
          <Text style={{ paddingLeft: 10, fontFamily: fonts.medium }}>{param.text}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const stateToProps = (state) => ({
  otp: state.otp
})

const dispatchToProps = (dispatch) => ({
  otpGenerateRequest: (params) => dispatch(OtpActions.otpGenerateRequest(params)),
  otpResetStatus: () => dispatch(OtpActions.otpResetStatus())

})

export default connect(stateToProps, dispatchToProps)(OtpChoices)
