import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Modal, ScrollView, Clipboard, Dimensions, TextInput, Image } from 'react-native'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import has from 'lodash/has'
import get from 'lodash/get'
import { createFilter } from 'react-native-search-filter'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import dayjs from 'dayjs'
import { UpperCase, NumberWithCommas } from '../Utils/Misc'
import StepIndicator from 'react-native-step-indicator'
import Toast, { DURATION } from 'react-native-easy-toast'

// Components
import RenderPurchasedItems from '../Components/RenderPurchasedItems'
import OrderItem from '../Components/OrderItem'
import DeliveryLogo from '../Components/DeliveryLogo'
import ModalTracking from '../Components/ModalTracking'
import LottieComponent from '../Components/LottieComponent'
// import ChatButton from '../Components/ChatButton'
import HeaderSearchComponent from '../Components/HeaderSearchComponent'

// Redux
import OrderActions from '../Redux/OrderRedux'

// Styles
import styled from 'styled-components'
import styles from './Styles/OrderStatusPageStyle'
import { fonts } from '../Styles'
import { Snackbar } from '../Components'
import ContextProvider from '../Context/CustomContext'

const KEYS_TO_FILTERS = ['order_no']
class OrderStatusPage extends Component {
  static navigationOptions = {
    header: null
  }

  constructor (props) {
    super(props)
    // this.keyboardWillShow = this.keyboardWillShow.bind(this)
    // this.keyboardWillHide = this.keyboardWillHide.bind(this)
    this.state = {
      auth: props.auth || undefined,
      order: props.order || undefined,
      searchTerm: '',
      hasSearch: false,
      orderId: '',
      email: '',
      modalVisible: false,
      searching: false,
      showAddress: false,
      modalTrackingVisible: false,
      selectedShipment: null,
      orderData: null
    }

    this.snackbar = React.createRef()
  }

  componentDidMount () {
    const { auth } = this.state
    if (auth && auth.user) {
      this.props.getOrderList()
    }
  }

  // componentWillUnmount () {
  //   this.keyboardWillShowSub.remove()
  //   this.keyboardWillHideSub.remove()
  // }

  // componentDidMount () {
  //   this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
  //   this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
  // }

  // keyboardWillShow = event => {
  //   this.props.navigation.setParams({
  //     keyboard: false
  //   })
  // }

  // keyboardWillHide = event => {
  //   this.props.navigation.setParams({
  //     keyboard: true
  //   })
  // }

  componentWillReceiveProps (newProps) {
    const { auth, order } = newProps
    const { searching } = this.state
    const orderData = newProps?.route?.params?.orderData ?? 'no data'
    if (orderData !== this.state.orderData) {
      this.setState({
        orderData,
        modalVisible: false
      }, () => {
        this.handleOpenOrderDetail(orderData.orderId, orderData.userEmail)
      })
    }
    if (searching && !order.fetching) {
      this.setState({ auth, order, searching: false })
      if (order.data && order.data.hasOwnProperty('cart_id')) {
        this.setModalVisible(true)
      }
    }
    if (!isEqual(this.state.order, order)) {
      this.setState({ order })
    }
  }

  delayState = (term) => {
    setTimeout(() => {
      this.setState({
        hasSearch: true,
        searchTerm: term
      })
    }, 200)
  }

  handleSubmitOrder = () => {
    const { orderId, email } = this.state
    let handledOrderId = orderId.toUpperCase()
    let handledEmail = email.toLowerCase()
    this.props.getOrderDetail(handledOrderId, handledEmail)
    this.setState({ searching: true })
  }

  handleOpenOrderDetail = (orderNo, userEmail) => {
    this.props.getOrderDetail(orderNo, userEmail)
    this.setState({ searching: true })
  }

  setModalVisible (visible) {
    this.setState({ modalVisible: visible })
  }

  setModalTrackingVisible (visible) {
    this.setState({ modalTrackingVisible: visible })
  }

  handleModalTracking = (shipment) => {
    this.setState({ selectedShipment: shipment }, () => {
      this.setModalTrackingVisible(true)
    })
  }

  renderOrderResult = () => {
    const { order, orderId, email } = this.state
    if (isEmpty(orderId) && isEmpty(email) && order.data) {
      return (
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessage}>Nomor order dan email tidak boleh kosong</Text>
        </View>
      )
    }
    if (order.data && !order.data.hasOwnProperty('cart_id')) {
      return (
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessage}>Maaf, order Anda tidak ditemukan</Text>
        </View>
      )
    } else if (order.err) {
      return (
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessage}>{order.err}</Text>
        </View>
      )
    }
  }

  renderProgressBar = (shipment) => {
    const { order } = this.state
    const orderData = order.data
    let status = shipment.shipment_status
    let deliveryMethod = shipment.details[0].delivery_method
    if (typeof status === 'undefined' && orderData.status !== 'expire' && orderData.status !== 'canceled') {
      status = 'pending'
    } else if (orderData.status === 'expire' || orderData.status === 'canceled') {
      status = 'canceled'
    }
    const labels = [`Pesanan kami ${status === 'canceled' ? 'batalkan' : 'terima'}`, 'Pembayaran diterima', 'Persiapan barang', 'Pengiriman', 'Pesanan Anda diterima']
    let currentPosition = 0
    let progressColor = '#F3251D'

    switch (status) {
      case 'new':
        currentPosition = 1
        progressColor = '#F5A623'
        break
      case 'processing':
      case 'standby':
      case 'hold':
        currentPosition = 2
        progressColor = '#F5A623'
        break
      case 'ready_to_pickup':
        progressColor = '#F5A623'
        if (deliveryMethod === 'pickup') {
          labels[3] = 'Siap Diambil'
          currentPosition = 3
        } else {
          currentPosition = 2
        }
        break
      case 'picked':
      case 'shipped':
        progressColor = '#F5A623'
        currentPosition = 3
        break
      case 'pending_delivered':
      case 'received':
        currentPosition = 4
        progressColor = '#049372'
        break
      default:
        if (orderData.status === 'new') {
          currentPosition = 0
          progressColor = '#049372'
        } else if (orderData.status === 'hold') {
          currentPosition = 1
          progressColor = '#049372'
        } else {
          currentPosition = 0
          progressColor = '#049372'
        }
        currentPosition = 0
        progressColor = '#F3251D'
    }

    const customStyles = {
      stepIndicatorSize: 27,
      currentStepIndicatorSize: 27,
      separatorStrokeWidth: 5,
      currentStepStrokeWidth: 5,
      stepStrokeCurrentColor: progressColor,
      stepStrokeWidth: 2,
      stepStrokeFinishedColor: progressColor,
      stepStrokeUnFinishedColor: '#aaaaaa',
      separatorFinishedColor: progressColor,
      separatorUnFinishedColor: '#aaaaaa',
      stepIndicatorFinishedColor: '#ffffff',
      stepIndicatorUnFinishedColor: '#aaaaaa',
      // '#555761'
      stepIndicatorCurrentColor: progressColor,
      stepIndicatorLabelFontSize: 15,
      currentStepIndicatorLabelFontSize: 15,
      stepIndicatorLabelCurrentColor: 'transparent',
      stepIndicatorLabelFinishedColor: 'transparent',
      stepIndicatorLabelUnFinishedColor: 'transparent',
      labelColor: '#999999',
      labelSize: 15,
      currentStepLabelColor: '#555761'
    }

    const { height } = Dimensions.get('screen')

    return (
      <View style={{ marginVertical: 20, height: height * 0.3 }}>
        <StepIndicator
          customStyles={customStyles}
          stepCount={labels.length}
          currentPosition={currentPosition}
          labels={labels}
          direction='vertical'
        />
      </View>
    )
  }

  toggleShowHideAddress = () => {
    let { showAddress } = this.state
    if (showAddress) {
      this.setState({ showAddress: false })
    } else {
      this.setState({ showAddress: true })
    }
  }

  // Set address to have upper case first
  ucFirst (address) {
    if (!isEmpty(address)) {
      return UpperCase(address.toLowerCase())
    } else {
      return null
    }
    // return (address.charAt(0).toUpperCase() + address.toLowerCase().slice(1))
  }

  // Render shipping address
  renderShippingAddress = (shipment) => {
    const { showAddress } = this.state
    let shippingAddress = ''
    if (shipment.shipping_address) {
      shippingAddress = shipment.shipping_address
    } else {
      if (shipment.details[0].shipping_address && shipment.details[0].shipping_address.full_address !== '') {
        shippingAddress = shipment.details[0].shipping_address
      } else {
        return null
      }
    }
    return (
      <View style={{ flexDirection: 'column', marginTop: 10 }}>
        <TouchableOpacity onPress={() => this.toggleShowHideAddress()}>
          <Text style={{ fontFamily: fonts.regular }}>Dikirim ke <Text style={{ fontFamily: fonts.bold }}>{this.ucFirst(shippingAddress.address_name)}</Text> {(showAddress) ? <Icon name='chevron-up' size={20} /> : <Icon name='chevron-down' size={20} />}</Text>
        </TouchableOpacity>
        {(showAddress) &&
          <View style={{ flexDirection: 'column', paddingVertical: 10 }}>
            <Text style={{ fontFamily: fonts.regular, marginBottom: 5 }}>{this.ucFirst(shippingAddress.first_name)} - {shippingAddress.phone}</Text>
            <Text style={{ fontFamily: fonts.regular, marginBottom: 5 }}>{this.ucFirst(shippingAddress.full_address)}</Text>
            <Text style={{ fontFamily: fonts.regular, marginBottom: 5 }}>{this.ucFirst(shippingAddress.kecamatan.kecamatan_name)}, {this.ucFirst(shippingAddress.city.city_name)}</Text>
            <Text style={{ fontFamily: fonts.regular, marginBottom: 5 }}>{shippingAddress.province.province_name} - {shippingAddress.post_code}</Text>
          </View>
        }
      </View>
    )
  }

  // Render shipment description. By who and its destination
  renderShipment = (shipment) => {
    let shipmentStatusDescription
    switch (shipment.shipment_status) {
      case 'new':
        shipmentStatusDescription = 'Pembayaran diterima'
        break
      case 'hold':
        shipmentStatusDescription = 'Sedang direview'
        break
      case 'processing':
      case 'standby':
        if (shipment.status_fulfillment === 'tidak_lengkap') {
          shipmentStatusDescription = 'Barang dikirim terpisah'
        } else if (shipment.status_fulfillment === 'batal') {
          shipmentStatusDescription = 'Barang tidak ada'
        } else {
          shipmentStatusDescription = 'Sedang disiapkan'
        }
        break
      case 'ready_to_pickup':
        if (shipment.details[0].delivery_method === 'pickup') {
          shipmentStatusDescription = 'Siap diambil'
        } else {
          shipmentStatusDescription = 'Menunggu kurir '
        }
        break
      case 'picked':
        if (shipment.details[0].delivery_method === 'pickup') {
          shipmentStatusDescription = 'Sudah Anda ambil'
        } else {
          shipmentStatusDescription = 'Sudah diserahkan ke kurir'
        }
        break
      case 'shipped':
        shipmentStatusDescription = 'Sedang dikirim'
        break
      case 'pending_delivered':
      case 'received':
        shipmentStatusDescription = 'Telah diterima'
        break
      default:
        shipmentStatusDescription = ''
        break
    }
    return (
      <View style={{ paddingHorizontal: 10, marginTop: 25, flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
          {(shipment.shipping_by === 'Ruparupa')
            ? <Text style={{ fontFamily: fonts.bold, fontSize: 18 }}>rup<Text style={{ fontFamily: fonts.regular, color: '#F26524' }}>a</Text>rup<Text style={{ fontFamily: fonts.regular, color: '#0C94D4' }}>a</Text></Text>
            : <Text style={{ fontFamily: fonts.bold, fontSize: 18 }}>{shipment.shipping_by}</Text>
          }
          {(shipment.shipping_from_store)
            ? (shipment.details[0].delivery_method === 'pickup')
              ? <Text style={{ fontFamily: fonts.bold, fontSize: 16 }}> diambil di {shipment.shipping_from_store}</Text>
              : <Text style={{ fontFamily: fonts.bold, fontSize: 16 }}> dari {shipment.shipping_from_store}</Text>
            : <Text style={{ fontFamily: fonts.bold, fontSize: 16 }}> dari Gudang</Text>
          }
        </View>
        {this.renderShippingAddress(shipment)}
        {(shipment.carrier) ? <DeliveryLogo shipment={shipment} /> : null}
        {(shipment.invoice_no)
          ? <View style={{ marginVertical: 10 }}>
            <Text selectable style={{ fontFamily: fonts.regular }}>No. Invoice {shipment.invoice_no}</Text>
          </View>
          : null
        }
        {(!isEmpty(shipmentStatusDescription))
          ? <Text style={{ fontFamily: fonts.bold, paddingVertical: 10, color: '#555761', fontSize: 15 }}>{shipmentStatusDescription}</Text>
          : null
        }
        {(shipment.shipment_tracking)
          ? <TouchableOpacity onPress={() => this.handleModalTracking(shipment)} style={{ borderColor: '#E0E6ED', borderWidth: 1, borderRadius: 3, padding: 10 }}>
            <Text style={{ fontFamily: fonts.medium, fontSize: 18, textAlign: 'center' }}>Lihat Detail</Text>
          </TouchableOpacity>
          : null
        }
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#eee', marginVertical: 20 }} />
      </View>
    )
  }

  renderModalContent = () => {
    // Required for changing month language to Indonesian
    const { order, selectedShipment } = this.state
    const orderData = order.data
    const bodyStyle = {
      negative: {
        borderColor: '#F3251D',
        borderWidth: 4,
        borderRadius: 5,
        flexDirection: 'column',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 15
      },
      positive: {
        borderColor: '#049372',
        borderWidth: 4,
        borderRadius: 5,
        flexDirection: 'column',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 15
      },
      pending: {
        borderColor: '#F5A623',
        borderWidth: 4,
        borderRadius: 5,
        flexDirection: 'column',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 15
      }
    }
    if (order.data && has(order, 'data.order_no')) {
      return (
        <View style={{ flexDirection: 'column' }}>
          <ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15 }}>
              <View />
              <Text style={{ fontFamily: fonts.bold, textAlign: 'center', fontSize: 16 }}>{get(order, 'data.order_no', '')}</Text>
              <TouchableOpacity onPress={() => this.setModalVisible(false)}>
                <Icon name='close-circle' color='#D4DCE6' size={24} />
              </TouchableOpacity>
            </View>
            {(order.data && order.data.shipment)
              ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                {order.data.shipment.map((shipment, index) => { return this.renderTransactionLogo('header', shipment, index) })}
              </View>
              : null
            }
            <View style={{ flexDirection: 'column', paddingLeft: 10, paddingRight: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                <Text style={{ fontFamily: fonts.regular, fontSize: 14 }}>Tgl Pembelian</Text>
                <Text style={{ fontFamily: fonts.bold, fontSize: 14 }}>{(orderData.payment && orderData.payment.created_at) ? dayjs(orderData.created_at).format('DD MMM YY | HH:mm') : null}</Text>
              </View>
              {(orderData.payment && orderData.payment.status === 'paid')
                ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                  <Text style={{ fontFamily: fonts.regular, fontSize: 14 }}>Tgl Pembayaran</Text>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 14 }}>{(orderData.payment.updated_at) ? dayjs(orderData.payment.updated_at).format('DD MMM YY | HH:mm') : dayjs(orderData.payment.created_at).format('DD MMM YY | HH:mm')}</Text>
                </View>
                : null
              }
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                <Text style={{ fontFamily: fonts.regular, fontSize: 14 }}>Voucher</Text>
                <Text style={{ fontFamily: fonts.bold, fontSize: 14 }}>Rp &#45;{((parseInt(orderData.discount_amount) + parseInt(orderData.gift_cards_amount)) > 0) ? NumberWithCommas((parseInt(orderData.discount_amount) + parseInt(orderData.gift_cards_amount))) : null}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                <Text style={{ fontFamily: fonts.regular, fontSize: 14 }}>Grand Total</Text>
                <Text style={{ fontFamily: fonts.bold, fontSize: 14 }}>Rp {NumberWithCommas(orderData.grand_total)}</Text>
              </View>
            </View>
            {(orderData && orderData.shipment)
              ? orderData.shipment.map((shipment, index) => (
                <View key={`order modal body ${index}`} style={(orderData.status === 'canceled') ? bodyStyle.negative : (shipment.shipment_status === 'received') ? bodyStyle.positive : bodyStyle.pending}>
                  {this.renderTransactionLogo('body', shipment, index)}
                  {this.renderProgressBar(shipment)}
                  {this.renderShipment(shipment)}
                  {(shipment.details && shipment.details.length > 0)
                    ? <View style={{ flexDirection: 'column' }}>
                      {shipment.details.map((item, index) => { return (<RenderPurchasedItems item={item} key={`purchased items ${index}`} />) })}
                    </View>
                    : null
                  }
                  <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                      <Text style={{ fontFamily: fonts.regular }}>Biaya Kirim</Text>
                      <Text style={{ fontFamily: fonts.regular }}>{(shipment.biaya_kirim > 0) ? `Rp ${NumberWithCommas(shipment.biaya_kirim)}` : 'Gratis'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                      <Text style={{ fontFamily: fonts.regular }}>Biaya Layanan</Text>
                      <Text style={{ fontFamily: fonts.regular }}>Rp {(shipment.biaya_layanan) ? NumberWithCommas(shipment.biaya_layanan) : 0}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                      <Text style={{ fontFamily: fonts.regular }}>Total</Text>
                      <Text style={{ fontFamily: fonts.regular }}>Rp {NumberWithCommas(shipment.total)}</Text>
                    </View>
                  </View>
                </View>
              ))
              : null
            }
            <Modal
              animationType='slide'
              transparent={false}
              visible={this.state.modalTrackingVisible}
              onRequestClose={() => this.setModalTrackingVisible(false)}
            >
              <ModalTracking setModalTrackingVisible={this.setModalTrackingVisible.bind(this)} order={order} selectedShipment={selectedShipment} />
            </Modal>
          </ScrollView>
          <Toast
            ref='toast'
            style={{ width: '100%', backgroundColor: '#049372', borderRadius: 0 }}
            position='top'
            positionValue={0}
            fadeInDuration={750}
            fadeOutDuration={1500}
            opacity={1}
            textStyle={{ color: '#FFFFFF', textAlign: 'center' }}
          />
        </View>
      )
    }
  }

  // Rendering Transaction Logo. Success / Pending / Rejected
  // Also renders virtual account if the customer decides to make transactions through bank transfer
  renderTransactionLogo = (from, shipment, index) => {
    let status = shipment.shipment_status
    const { order } = this.state
    const orderData = order.data
    index = index + 1
    let statusPengiriman = ''
    let logo = ''
    // Rendering Pending
    if (isEmpty(status) && from === 'header' && orderData.status === 'new') {
      if (index === 1) {
        return (
          <View style={{ paddingHorizontal: 10 }} key={`loop shipment ${index}`}>
            {this.renderTransactionPending(index)}
          </View>
        )
      } else {
        return null
      }
    }

    if (orderData.status === 'pending' && typeof status === 'undefined') {
      if (shipment.details[0].delivery_method === 'delivery' || shipment.details[0].delivery_method === 'store_fulfillment') {
        status = 'pending_delivery'
      } else {
        status = 'pending_pickup'
      }
    }

    if (status === 'pending') {
      if (shipment.details[0].delivery_method === 'delivery' || shipment.details[0].delivery_method === 'store_fulfillment') {
        status = 'pending_delivery'
      } else {
        status = 'pending_pickup'
      }
    }

    // if order status expire change status to canceled
    if (orderData.status === 'expire' || orderData.status === 'canceled') {
      status = 'canceled'
      logo = require('../assets/images/order-status/dibatalkan-check-status-detail.webp')
    }

    if (orderData.status === 'hold') {
      status = 'Pengiriman'
      logo = require('../assets/images/order-status/diproses-regular-status-detail.webp')
    }
    /*
      Pengiriman
      Pickup
      Cancel / refund
      Complete
    */
    switch (status) {
      case 'pending_delivery':
      case 'processing':
      case 'ready_to_pickup_by_3pl':
      case 'picked_up_by_3pl':
      case 'pending_delivered':
      case 'stand_by':
      case 'shipped':
      case 'new':
        statusPengiriman = 'Pengiriman'
        logo = require('../assets/images/order-status/diproses-regular-status-detail.webp')
        break
      case 'pending_pickup':
      case 'ready_to_pickup':
        statusPengiriman = 'Diambil'
        logo = require('../assets/images/order-status/diproses-regular-status-detail.webp')
        break
      case 'canceled':
        statusPengiriman = 'Dibatalkan'
        logo = require('../assets/images/order-status/dibatalkan-check-status-detail.webp')
        break
      case 'picked_up_by_customer':
      case 'received':
        statusPengiriman = 'Diterima'
        logo = require('../assets/images/order-status/diterima-check-status-detail.webp')
        break
      default:
        statusPengiriman = 'Pengiriman'
        logo = require('../assets/images/order-status/diproses-regular-status-detail.webp')
        break
    }

    if (from === 'header') {
      return (
        <View style={{ flexDirection: 'column', paddingHorizontal: 10, marginBottom: 15, justifyContent: 'center', alignItems: 'center' }} key={`order ${index}`}>
          <Image source={logo} style={{ width: 75, height: 75 }} />
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
            <Text style={{ fontFamily: fonts.regular, color: '#757886', fontSize: 14 }}>{statusPengiriman}</Text>
            <Text style={{ fontFamily: fonts.regular, color: '#757886', fontSize: 12 }}>paket #{index}</Text>
          </View>
        </View>
      )
    } else {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', paddingLeft: 10, paddingRight: 10 }}>
            <Image source={logo} style={{ width: 75, height: 75 }} />
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
            <Text style={{ fontFamily: fonts.bold, color: '#757886', fontSize: 18 }}>{statusPengiriman}</Text>
            <Text style={{ fontFamily: fonts.bold, color: '#757886', fontSize: 18 }}>paket #{index}</Text>
          </View>
        </View>
      )
    }
  }

  // Copy VA to Clipboard
  setVa = (vaNumber) => {
    Clipboard.setString(vaNumber)
    this.refs.toast.show('Tersalin', DURATION.LENGTH_SHORT)
  }

  // Render Virtual Account component
  renderVa = (orderData) => {
    if (orderData && orderData.payment) {
      return (
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.regular }}>Nomor Virtual Account {UpperCase(orderData.payment.va_bank)} Anda</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
            <View style={{ borderWidth: 1, borderColor: '#E5E9F2', padding: 10, flexGrow: 85 }}>
              <Text>{orderData.payment.va_number}</Text>
            </View>
            <TouchableOpacity onPress={() => this.setVa(orderData.payment.va_number)} style={{ backgroundColor: '#F26524', width: 80, height: 40, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.regular, color: 'white' }}>Salin <Icon name='content-copy' size={20} color='white' /></Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 20, textAlign: 'center' }}>Total Pembayaran: Rp {NumberWithCommas(orderData.grand_total)}</Text>
          </View>
        </View>
      )
    } else {
      return null
    }
  }

  renderTransactionPending = (index) => {
    const { order } = this.state
    const orderData = order.data
    return (
      <View style={{ padding: 20, marginBottom: 15, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(207, 207, 207, 0.5)', flexDirection: 'column' }} key={`Pending transaction(s) ${index}`}>
        {this.renderVa(orderData)}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#E5F7FF', padding: 10, marginVertical: 10 }}>
          <Icon name='information' size={16} />
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Text style={{ fontFamily: fonts.regular, textAlign: 'center' }}>Silahkan selesaikan pembayaran Anda sebelum <Text style={{ fontFamily: fonts.bold }}>{(orderData.payment && orderData.payment.expire_transaction) ? dayjs(orderData.payment.expire_transaction).format('dddd, DD MMM YYYY HH:mm') : ''} WIB</Text>. Untuk petunjuk pembayaran silahkan ikuti petunjuk dibawah.</Text>
            <Text style={{ fontFamily: fonts.regular, textAlign: 'center' }}>Petunjuk pembayaran <Icon name='help-circle' /></Text>
          </View>
        </View>
      </View>
    )
  }
   getContext = () => {
     return {
       callSnackbarWithAction: (message, actionText, callback, duration) => this.snackbar.current.callWithAction(message, actionText, callback, duration)
     }
   }
   // Render the order status page
   render () {
     // Get state datas for validation on user's authentications and orders
     const { order, auth, orderId, email, hasSearch } = this.state
     let orderList = (order && order.orderList && order.orderList.length > 0) ? order.orderList : []
     let userEmail = (auth && auth.user) ? auth.user.email : undefined
     let filteredOrderList = []
     if (orderList.length > 0) {
       filteredOrderList = orderList.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
     }
     return (
       <ContextProvider value={this.getContext()}>
         <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
           <HeaderSearchComponent home pageName={'Pesanan Sayaxxx'} pageType={'order-status-page'} navigation={this.props.navigation} />
           {(auth && isEmpty(auth.user))
             ? <View style={{ flexDirection: 'column' }}>
               <View style={{ paddingLeft: 10, paddingTop: 20, paddingRight: 10, backgroundColor: 'white', flexDirection: 'column', borderBottomWidth: 1, borderBottomColor: '#D4DCE6', paddingBottom: 10 }}>
                 <FormS style={{ flexDirection: 'row' }}>
                   <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} size={18} name='magnify' color={'#D4DCE6'} />
                   <TextInput underlineColorAndroid='transparent' value={orderId} autoCapitalize='characters' onChangeText={(orderId) => this.setState({ orderId })} placeholder='Nomor Pesanan' style={{ textDecorationColor: 'white', flex: 1, height: 40 }} />
                 </FormS>
                 <FormS style={{ flexDirection: 'row' }}>
                   <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} size={18} name='email' color={'#D4DCE6'} />
                   <TextInput
                     underlineColorAndroid='transparent'
                     autoCapitalize='none'
                     keyboardType='email-address'
                     value={email}
                     onChangeText={(email) => this.setState({ email: email.toLowerCase() })}
                     placeholderTextColor='#b2bec3'
                     placeholder='Email Anda'
                     style={{ textDecorationColor: 'white', flex: 1, height: 40 }} />
                 </FormS>
                 <TouchableOpacity onPress={() => this.handleSubmitOrder()} style={{ borderWidth: 1, borderColor: '#008CCF', borderRadius: 3, paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
                   <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: '#008CCF', textAlign: 'center' }}>{(order && order.fetching) ? 'Mohon Menunggu...' : 'Cek Status Pesanan'}</Text>
                 </TouchableOpacity>
                 {this.renderOrderResult()}
               </View>
               <Modal
                 animationType='slide'
                 transparent={false}
                 visible={this.state.modalVisible}
                 onRequestClose={() => this.setModalVisible(false)}
               >
                 {this.renderModalContent()}
               </Modal>
             </View>
             : (auth && auth.user && (order && !order.fetching && order.orderList && order.orderList.length <= 0))
               ? <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                 <Image
                   source={require('../assets/images/keranjang-kosong.webp')}
                   style={{ width: Dimensions.get('screen').width * 0.5, height: Dimensions.get('screen').height * 0.45 }}
                 />
                 <Text style={{ fontFamily: fonts.medium, fontSize: 16 }}><Icon name='information' size={20} /> Maaf Anda belum memiliki transaksi</Text>
                 {/* <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Homepage')}
                  style={{ borderWidth: 1, borderColor: '#E0E6ED', borderRadius: 3, paddingVertical: 5, paddingHorizontal: 15, marginTop: 15, width: Dimensions.get('screen').width * 0.8 }}
                >
                  <Text style={{ fontFamily: fonts.bold, fontSize: 16, textAlign: 'center' }}>Belanja Sekarang</Text>
                </TouchableOpacity> */}
               </View>
               : <View style={{ flexDirection: 'column', backgroundColor: 'white', paddingHorizontal: 5, paddingBottom: 100 }}>
                 <ScrollView>
                   {(auth && auth.user && order && order.orderList && order.orderList.length > 0)
                     ? <View style={{ justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', paddingHorizontal: 10 }}>
                       <SearchPesanan onChangeText={this.delayState} underlineColorAndroid='transparent' placeholderTextColor='#b2bec3' placeholder='Cari nomor transaksi Anda..' />
                       <IconInnerSearch>
                         <Icon name='magnify' size={25} />
                       </IconInnerSearch>
                     </View>
                     : null
                   }
                   {(filteredOrderList && filteredOrderList.length > 0)
                     ? <OrderItem handleOpenOrderDetail={this.handleOpenOrderDetail.bind(this)} filteredOrderList={filteredOrderList} userEmail={userEmail} navigation={this.props.navigation} />
                     : <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                       {(!hasSearch || order.fetching)
                         ? <LottieComponent />
                         : <Text style={{ fontFamily: fonts.regular, textAlign: 'center' }}>{(order && order.err) ? `${order.err}` : 'Maaf, pesanan Anda tidak ditemukan.'}</Text>
                       }
                     </View>
                   }
                 </ScrollView>
                 <Modal
                   animationType='slide'
                   transparent={false}
                   visible={this.state.modalVisible}
                   onRequestClose={() => this.setModalVisible(false)}
                 >
                   {this.renderModalContent()}
                 </Modal>
               </View>
           }
           <Snackbar ref={this.snackbar} actionHandler={() => this.props.navigation.navigate('WishlistPage')} />
         </View>
       </ContextProvider>
     )
   }
}

const stateToProps = (state) => ({
  order: state.order,
  auth: state.auth
})

const dispatchToProps = (dispatch) => ({
  getOrderDetail: (orderId, email) => dispatch(OrderActions.orderRequest(orderId, email)),
  getOrderList: () => dispatch(OrderActions.orderListRequest()),
  orderInit: () => dispatch(OrderActions.orderInit())
})

export default connect(stateToProps, dispatchToProps)(OrderStatusPage)

const IconInnerSearch = styled.View`
 position: absolute;
 zIndex: 1;
 right: 20px;
`

const SearchPesanan = styled.TextInput`
 borderWidth: 1;
 borderColor: #D4DCE6;
 borderRadius: 3;
 marginVertical: 8;
 paddingLeft: 20;
 paddingVertical: 5;
 font-family:${fonts.regular};
`

const FormS = styled.View`
  border: 1px #e5e9f2 solid;
  padding: 0px;
  border-radius: 3px;
  margin-top: 5px;
  margin-bottom: 10px;
`
