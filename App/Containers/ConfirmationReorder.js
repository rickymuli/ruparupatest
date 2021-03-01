import React, { Component } from 'react'
import { View, Text, Dimensions, Image, ScrollView, Platform, Linking, TouchableOpacity } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import { LoginManager } from 'react-native-fbsdk'
import DeviceInfo from 'react-native-device-info'

import styles from '../Components/Styles/ConfirmationPickupStyles'
import ConfirmationPickupDetail from '../Components/ConfirmationPickupDetail'

import ConfirmationPickup from './ConfirmationPickup'
import ConfirmationRefund from './ConfirmationRefund'
import ConfirmationDelivery from './ConfirmationDelivery'
import LottieComponent from '../Components/LottieComponent'

import ReorderActions from '../Redux/ReorderRedux'
import AuthActions from '../Redux/AuthRedux'

const { width, height } = Dimensions.get('screen')

export class ConfirmationReorder extends Component {
  // static navigationOptions = {
  //   header: null
  // }
  constructor (props) {
    super(props)
    this.state = {
      products: {},
      isPickup: false,
      isDelivery: false,
      isRefund: false,
      isActionType: 'default',
      addressSelected: 0,
      addressList: [],
      showModal: false,
      storeNew: '',
      storeOrigin: '',
      orderDate: '',
      orderNo: '',
      invoiceNo: '',
      fetching: false,
      email: '',
      isUser: false,
      user: {},
      didLogin: false,
      reorderStatus: '',
      errMsg: null,
      token: '',
      customerId: ''
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    let returnData = {}
    const { invoiceNo, isUser, didLogin } = prevState
    if (nextProps.route && nextProps.route.name && nextProps.route.name === 'ConfirmationReorder') {
      if (nextProps.route.params && !isEmpty(nextProps.route.params)) {
        if (nextProps.route.params.itemData && !isEmpty(nextProps.route.params.itemData)) {
          let itemData = nextProps.route.params.itemData
          if (itemData.invoiceId && itemData.invoiceId !== invoiceNo) {
            let data = {
              invoice_no: itemData.invoiceId,
              email: itemData.email
            }
            nextProps.getInvoiceConfirmation(data)
            returnData = { ...returnData, invoiceNo: itemData.invoiceId, email: itemData.email }
          }
        }
      }
    }

    if (nextProps.auth.fetching === false && !isUser && didLogin) {
      this.handleLogin()
    }
    if (nextProps.reorderData) {
      if (nextProps.reorderData.customer_login) { // user need login
        if (nextProps.route && nextProps.route.params && nextProps.route.params.itemData && !isEmpty(nextProps.route.params.itemData)) {
          if (nextProps.user && nextProps.user.email === nextProps.route.params.itemData.email && (parseInt(nextProps.user.customer_id) === nextProps.reorderData.customer_id)) {
            if (nextProps.reorderData.cart_id && nextProps.reorderData.reorder_status === 'customer_confirmation' && nextProps.reorderData.customer_confirmation === 10) {
              // if user already choose confirmation method delivery but didn't complete payment
              nextProps.navigation.navigate('PaymentPage', { cart_id: nextProps.reorderData.cart_id, from: 'ConfirmationReorder' })
              // props.reorderInit()
            }
            returnData = { ...returnData, isUser: true, email: nextProps.route.params.itemData.email, user: nextProps.user }
          } else returnData = { ...returnData, isUser: false }
        } else returnData = { ...returnData, isUser: false }
      } else {
        // user is guest, doesn't need login
        returnData = { ...returnData, isUser: true, email: nextProps.route.params.itemData.email }
        if (nextProps.reorderData.cart_id && nextProps.reorderData.reorder_status === 'customer_confirmation' && nextProps.reorderData.customer_confirmation === 10) {
          // if user already choose confirmation method delivery but didn't complete payment
          nextProps.navigation.navigate('PaymentPage', { cart_id: nextProps.reorderData.cart_id, from: 'ConfirmationReorder' })
          // props.reorderInit()
        }
      }
    }

    if (nextProps.reorder && nextProps.reorderData) {
      if (nextProps.reorderData.token && nextProps.reorderData.token !== prevState.token) returnData = { ...returnData, token: nextProps.reorderData.token }
      if (nextProps.reorderData.customer_id && nextProps.reorderData.token !== prevState.customerId) returnData = { ...returnData, customerId: nextProps.reorderData.customer_id }
      if (nextProps.reorder.success !== prevState.success) returnData = { ...returnData, success: nextProps.reorder.success }
      if (nextProps.reorder.fetching !== prevState.fetching) returnData = { ...returnData, fetching: nextProps.reorder.fetching }
      if (!isEmpty(nextProps.reorderData.items) && nextProps.reorderData.items !== prevState.products) returnData = { ...returnData, products: nextProps.reorderData.items }
      if (nextProps.reorderData.order_date !== prevState.orderDate) returnData = { ...returnData, orderDate: nextProps.reorderData.order_date }
      if (nextProps.reorderData.order_no !== prevState.orderNo) returnData = { ...returnData, orderNo: nextProps.reorderData.order_no }
      if (!isEmpty(nextProps.reorderData.store_new) && nextProps.reorderData.store_new !== prevState.storeNew) returnData = { ...returnData, storeNew: nextProps.reorderData.store_new }
      if (!isEmpty(nextProps.reorderData.store_origin) && nextProps.reorderData.store_origin !== prevState.storeOrigin) returnData = { ...returnData, storeOrigin: nextProps.reorderData.store_origin }
      if (nextProps.reorderData.reorder_status !== prevState.reorderStatus) returnData = { ...returnData, reorderStatus: nextProps.reorderData.reorder_status }
    }

    if (nextProps.confirmationData && !isEmpty(nextProps.confirmationData)) {
      if (nextProps.confirmationData.new_order_no && nextProps.confirmationData.new_order_no !== prevState.orderNo) {
        returnData = { ...returnData, orderNo: nextProps.confirmationData.new_order_no, confirmationData: nextProps.confirmationData }
      }
    }

    return returnData
  }

  setChangeState =(state, value) => {
    this.setState({ [state]: value })
  }

  renderLogo = (style = {}) => (
    <View style={[{ alignItems: 'center', alignSelf: 'center', postion: 'absolute' }, style]}>
      <Image style={{ width: width * 0.4, height: width * 0.07 }} source={require('../assets/images/ruparupa-logo-copy.webp')} />
    </View>
  )

  renderDefault = () => {
    const { storeNew } = this.state
    return (
      <View style={{ paddingVertical: 15 }}>
        <DelivBox >
          <View style={{ flexDirection: 'column' }}>
            <Text style={[styles.textNormal, { paddingVertical: 8 }]}>
                Pesanan Anda telah dialihkan ke <Text style={styles.textBold}>{storeNew.store_name}</Text>. Apakah Anda bersedia melakukan penjemputan pesanan di toko baru atau dikirimkan ke alamat Anda (biaya ongkos kirim ditanggung customer)?
            </Text>
            <Text style={[styles.textNormal, { paddingVertical: 5 }]}>
                Alamat Toko:
            </Text>

            <Text style={styles.textBold}>{storeNew.address_line_2}</Text>

            <TouchableOpacity onPress={() => this.openGps(storeNew)}>
              <Text style={[styles.textNormal, {
                textDecorationLine: 'underline',
                paddingVertical: 10,
                marginBottom: 10
              }]}>
                  Lihat Lokasi</Text>
            </TouchableOpacity>
            <ButtonSecondary onPress={() => this.setChangeState('isActionType', 'pickup')}>
              <ButtonTextSecondary>Penjemputan Mandiri</ButtonTextSecondary>
            </ButtonSecondary>

            <ButtonSecondary onPress={() => this.setChangeState('isActionType', 'delivery')}>
              <ButtonTextSecondary>Dikirim ke Alamat Anda</ButtonTextSecondary>
            </ButtonSecondary>

            <ButtonSecondary onPress={() => this.setChangeState('isActionType', 'refund')}>
              <ButtonTextSecondary>Pengembalian Dana</ButtonTextSecondary>
            </ButtonSecondary>
          </View>
        </DelivBox>
      </View>
    )
  }

  componentDidMount () {
    const { route } = this.props
    if (route && route.params && route.params.itemData && route.name === 'ConfirmationReorder') {
      let itemData = this.props.route.params.itemData
      if (itemData.invoiceId) {
        let data = {
          invoice_no: itemData.invoiceId,
          email: itemData.email
        }
        this.props.getInvoiceConfirmation(data)
      }
    }
  }

  handleOpenOrderDetail = (orderNo) => {
    const { email } = this.state
    this.props.navigation.navigate('OrderStatusDetail', {
      orderData: {
        order_id: orderNo,
        email
      }
    })
  }

  handleLogin = () => {
    const { invoiceNo, email } = this.state
    const { auth } = this.props
    if (auth.user) {
      this.doLogout()
    } else this.props.navigation.navigate('Profil', { from: 'ConfirmationReorder', itemData: { invoiceId: invoiceNo, email: email } })
  }

  doLogout = async () => {
    const { invoiceNo, email } = this.state
    const { auth } = this.props
    try {
      const uniqueId = await DeviceInfo.getUniqueId()
      this.props.logout(auth.user.customer_id, uniqueId)
      LoginManager.logOut()
      this.props.navigation.navigate('Profil', { from: 'ConfirmationReorder', itemData: { invoiceId: invoiceNo, email: email } })
    } catch (error) {
      if (__DEV__) {
        console.log(error)
      }
    }
  //   // Freshchat.resetUser()
  }

  openGps (store) {
    var res = store.geolocation.split(',')
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' })
    const latLng = `${res[0]},${res[1]}`
    const label = store.store_name
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    })

    Linking.openURL(url)
  }

  renderScreen = () => {
    const { isActionType, storeNew, invoiceNo, orderNo, email, token, customerId } = this.state
    switch (isActionType) {
      case 'default':
        return (this.renderDefault())

      case 'pickup':
        return (<ConfirmationPickup setChangeState={this.setChangeState}
          storeNew={storeNew}
          orderNo={orderNo}
          invoiceNo={invoiceNo}
          handleInit={this.handleInit}
          navigation={this.props.navigation}
          handleOpenOrderDetail={this.handleOpenOrderDetail}
          openGps={this.openGps}
          email={email} />)

      case 'delivery':
        return (<ConfirmationDelivery setChangeState={this.setChangeState}
          storeNew={storeNew}
          invoiceNo={invoiceNo}
          handleAddAddress={this.handleAddAddress}
          navigation={this.props.navigation}
          handleInit={this.handleInit}
          email={email}
          token={token}
          customerId={customerId} />)

      case 'refund':
        return (<ConfirmationRefund setChangeState={this.setChangeState}
          storeNew={storeNew}
          invoiceNo={invoiceNo}
          navigation={this.props.navigation}
          handleInit={this.handleInit}
          email={email} />)

      default:
        return (this.renderDefault())
    }
  }

  handleInit= () => {
    this.setState({
      isDeliveryConsent: false,
      isPickupConsent: false,
      isRefundConsent: false
    })

    this.props.reorderInit()
  }

  render () {
    const { reorderStatus, products, orderDate, orderNo, storeNew, storeOrigin, fetching, isUser } = this.state
    if (isUser) {
      return (
        <View style={{ height: height, flex: 1 }}>
          <View style={styles.header} >
            {this.renderLogo({ opacity: 1 })}
          </View>

          {fetching
            ? <LottieComponent />
            : (reorderStatus === 'completed' || reorderStatus === 'canceled')
              ? <DelivBox >
                <View style={{ flexDirection: 'column' }}>
                  <Text style={{
                    fontFamily: 'Quicksand-Regular',
                    fontSize: 14,
                    paddingVertical: 10,
                    textAlign: 'center' }}> {reorderStatus === 'completed' ? 'Terima kasih atas konfirmasi Anda. Pesanan Anda sedang diproses.'
                      : reorderStatus === 'canceled' ? 'Tidak dapat melakukan perubahan pada pesanan. Saat ini pesanan Anda sudah kami proses'
                        : null}</Text>
                  <ButtonSecondary onPress={() => { this.props.navigation.navigate('Home') }}>
                    <ButtonTextSecondary>Kembali ke Halaman Utama</ButtonTextSecondary>
                  </ButtonSecondary>
                </View>
              </DelivBox>
              : <ScrollView>
                {this.renderScreen()}
                <ConfirmationPickupDetail
                  product={products}
                  orderDate={orderDate}
                  orderNo={orderNo}
                  storeNew={storeNew}
                  storeOrigin={storeOrigin}
                  handleOpenOrderDetail={this.handleOpenOrderDetail} />
              </ScrollView>}
        </View>

      )
    } else {
      return (
        <View style={{ height: height, flex: 1 }}>
          <View style={styles.header} >
            {this.renderLogo({ opacity: 1 })}
          </View>

          {fetching
            ? <LottieComponent />
            : <View style={{ paddingVertical: 15 }}>
              <DelivBox >
                <View style={{ flexDirection: 'column' }}>
                  <Text style={{
                    fontFamily: 'Quicksand-Regular',
                    fontSize: 14,
                    paddingVertical: 10,
                    textAlign: 'center' }}>Untuk melanjutkan, silahkan masuk dengan akun yang Anda gunakan untuk transaksi ini</Text>
                  <ButtonPrimary onPress={() => { this.handleLogin() }}>
                    <ButtonTextPrimary>Login</ButtonTextPrimary>
                  </ButtonPrimary>
                  <ButtonSecondary onPress={() => { this.props.navigation.navigate('Home') }}>
                    <ButtonTextSecondary>Kembali ke Halaman Utama</ButtonTextSecondary>
                  </ButtonSecondary>
                </View>
              </DelivBox>
            </View>
          }
        </View>

      )
    }
  }
}

const stateToProps = (state) => ({
  reorder: state.reorder,
  reorderData: state.reorder.data,
  fetching: state.reorder.fetching,
  confirmationData: state.reorder.confirmationData,
  user: state.auth.user,
  auth: state.auth
})

const dispatchToProps = (dispatch) => ({
  authInit: () => dispatch(AuthActions.authInit()),
  logout: (customerId, uniqueId) => dispatch(AuthActions.authLogout({ customerId, uniqueId })),
  getInvoiceConfirmation: (data) => dispatch(ReorderActions.reorderInvoiceRequest(data)),
  reorderInit: () => dispatch(ReorderActions.reorderInit())
})

export default connect(stateToProps, dispatchToProps)(ConfirmationReorder)

const DelivBox = (props) => {
  return (
    <View style={{ backgroundColor: '#E5F7FF', padding: 10, marginTop: 4 }}>
      <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 10 }}>
        {props.children}
      </View>
    </View>
  )
}

const ButtonPrimary = styled.TouchableOpacity`
  backgroundColor: #F26525;
  borderRadius: 5;
  padding: 10px;
  marginTop: 10px;
  marginBottom: 10px;
`

const ButtonTextPrimary = styled.Text`
  fontFamily: Quicksand-Bold;
  textAlign: center;
  color: white;
`

const ButtonSecondary = styled.TouchableOpacity`
  backgroundColor: #008CCF;
  borderRadius: 5;
  padding: 10px;
  marginBottom: 10px;
`
const ButtonTextSecondary = styled.Text`
  fontFamily: Quicksand-Regular;
  textAlign: center;
  color: white;
  fontSize: 14;
`
