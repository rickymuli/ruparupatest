import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, Text, TouchableOpacity } from 'react-native'
import {
  ButtonContainer,
  ButtonGreyOutline,
  ButtonGreyText } from '../Styles/StyledComponents'
import { LoginManager } from 'react-native-fbsdk'
import DeviceInfo from 'react-native-device-info'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import get from 'lodash/get'
import { fonts } from '../Styles'

// Redux
import AuthActions from '../Redux/AuthRedux'
import CartActions from '../Redux/CartRedux'

class DashboardButtonNavigationFull extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isVisible: false
    }
  }

  doLogout = async () => {
    const { auth } = this.props
    try {
      const uniqueId = await DeviceInfo.getUniqueId()
      this.props.navigation.navigate('Homepage')
      this.props.logout(auth.user.customer_id, uniqueId)
      LoginManager.logOut()
    } catch (error) {
      if (__DEV__) {
        console.log(error)
      }
    }
    // Freshchat.resetUser()
  }

  onPressFeedback () {
    const { title, pressAction } = this.props
    if (title === 'Keluar') this.doLogout()
    else if (title === 'Keluar dari Toko') this.setState({ isVisible: true })
    else pressAction()
  }

  renderExpireModal () {
    const { storeNewRetail, resetCart } = this.props
    return (
      <Modal
        backdropTransitionOutTiming={1}
        isVisible={this.state.isVisible}
        animationIn={'slideInDown'}
        animationOut={'slideOutUp'}
        onBackdropPress={() => this.setState({ isVisible: false })}
      >
        <View style={{ backgroundColor: 'white', padding: 18, borderRadius: 4 }}>
          <Text style={{ fontFamily: fonts.bold, marginBottom: 12, fontSize: 16 }}>{`Konfirmasi`}</Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 14 }}>{'Anda akan keluar dari sesi di Toko'}</Text>
          <Text style={{ fontFamily: fonts.medium, marginBottom: 12, fontSize: 14 }}>{(get(storeNewRetail, 'data.store_name', '')).replace(/, |,/g, ',\n')}</Text>
          <Text style={{ fontFamily: fonts.medium, marginBottom: 12, fontSize: 14 }}>{`Cek kembali keranjang belanjaan Anda, jangan sampai ada produk tertinggal.`}</Text>
          <Text style={{ fontFamily: fonts.bold, marginBottom: 12, fontSize: 14 }}>{`Terimakasih`}</Text>
          <TouchableOpacity onPress={() => this.setState({ isVisible: false }, () => resetCart())} style={{ backgroundColor: '#FF7F45', alignSelf: 'stretch', paddingVertical: 6, borderRadius: 4, marginTop: 6, marginBottom: 4, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: fonts.medium, color: 'white', fontSize: 16 }}>Iya</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setState({ isVisible: false })} style={{ alignSelf: 'stretch', paddingVertical: 6, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: fonts.medium, fontSize: 14 }}>Tidak</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }

  render () {
    const { title, iconName } = this.props
    return (
      <>
        <ButtonContainer>
          <ButtonGreyOutline onPress={() => this.onPressFeedback()}>
            <ButtonGreyText><Icon name={iconName} size={20} style={{ color: '#555761', marginRight: 15 }} /> {title}</ButtonGreyText>
          </ButtonGreyOutline>
        </ButtonContainer>
        {title === 'Keluar dari Toko' && this.renderExpireModal()}
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  storeNewRetail: state.storeNewRetail
})

const mapDispatchToProps = (dispatch) => ({
  logout: (customerId, uniqueId) => dispatch(AuthActions.authLogout({ customerId, uniqueId })),
  resetCart: () => dispatch(CartActions.cartTypeRequest())

})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardButtonNavigationFull)
