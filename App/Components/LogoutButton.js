import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { Freshchat } from 'react-native-freshchat-sdk'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { LoginManager } from 'react-native-fbsdk'
import DeviceInfo from 'react-native-device-info'
import {
  ButtonContainer,
  ButtonGreyOutline,
  ButtonGreyText } from '../Styles/StyledComponents'

// Redux
import AuthActions from '../Redux/AuthRedux'

class LogoutButton extends Component {
  doLogout = async () => {
    const { auth } = this.props
    const uniqueId = await DeviceInfo.getUniqueId()
    this.props.navigation.navigate('Homepage')
    this.props.logout(auth.user.customer_id, uniqueId)
    LoginManager.logOut()
    // Freshchat.resetUser()
  }

  render () {
    return (
      <ButtonContainer>
        <ButtonGreyOutline onPress={() => this.doLogout()}>
          <ButtonGreyText><Icon name='exit-to-app' size={20} style={{ color: '#555761', marginRight: 15 }} /> Keluar</ButtonGreyText>
        </ButtonGreyOutline>
      </ButtonContainer>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

const mapDispatchToProps = (dispatch) => ({
  logout: (customerId, uniqueId) => dispatch(AuthActions.authLogout({ customerId, uniqueId }))
})

export default connect(mapStateToProps, mapDispatchToProps)(LogoutButton)
