import React, { PureComponent } from 'react'
import { View, Clipboard, Text, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { UpperCase, NumberWithCommas } from '../Utils/Misc'
import dayjs from 'dayjs'

import OrderActions from '../Redux/OrderRedux'

class OrderTransactionLogo extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      from: props.from || null,
      shipment: props.shipment || null,
      index: props.index
    }
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {}
    if (!isEqual(props.shipment, state.shipment)) {
      returnObj = {
        ...returnObj,
        shipment: props.shipment
      }
    }
    return returnObj
  }

  setCopy = (string) => {
    Clipboard.setString(string)
    this.props.callSnackbar('Berhasil Tersalin')
  }

  // Render Virtual Account component
  renderVa = (orderData) => {
    if (orderData && orderData.payment) {
      return (
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Quicksand-Regular' }}>Nomor Virtual Account {UpperCase(orderData.payment.va_bank)} Anda</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
            <View style={{ borderWidth: 1, borderColor: '#E5E9F2', padding: 15, flexGrow: 85 }}>
              <Text>{orderData.payment.va_number}</Text>
            </View>
            <TouchableOpacity onPress={() => this.setCopy(orderData.payment.va_number)} style={{ backgroundColor: '#F26524', padding: 15, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Quicksand-Medium', color: 'white' }}>Salin <Icon name='content-copy' size={20} color='white' /></Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 20, textAlign: 'center' }}>Total Pembayaran: Rp {NumberWithCommas(orderData.grand_total)}</Text>
          </View>
        </View>
      )
    } else {
      return null
    }
  }

  renderTransactionPending = (index) => {
    const { order } = this.props
    const orderData = order.data
    return (
      <View style={{ padding: 20, marginBottom: 15, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(207, 207, 207, 0.5)', flexDirection: 'column' }} key={`Pending transaction(s) ${index}`}>
        {this.renderVa(orderData)}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#E5F7FF', padding: 10, marginVertical: 10 }}>
          <Icon name='information' size={16} />
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Quicksand-Regular', textAlign: 'center' }}>Silahkan selesaikan pembayaran Anda sebelum <Text style={{ fontFamily: 'Quicksand-Bold' }}>{(orderData.payment && orderData.payment.expire_transaction) ? dayjs(orderData.payment.expire_transaction).format('dddd, DD MMM YYYY HH:mm') : ''} WIB</Text></Text>
            {/* <Text style={{ fontFamily: 'Quicksand-Regular', textAlign: 'center' }}>Petunjuk pembayaran <Icon name='help-circle' /></Text> */}
          </View>
        </View>
      </View>
    )
  }

  render () {
    let { shipment, index, from } = this.state
    const { order } = this.props
    let status = shipment.shipment_status
    const orderData = order.data
    let logo, statusPengiriman
    let isReorder = false
    index += 1
    if (isEmpty(status) && from === 'header' && orderData.status === 'new') {
      if (index === 1) {
        return (
          <View style={{ paddingHorizontal: 10 }}>
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
        logo = require('../assets/images/order-status/diproses-diambil-status-detail.webp')
        break
      case 'canceled':
        if (shipment.reorder && shipment.reorder.action === 'reorder' && shipment.reorder.status === 'completed') {
          statusPengiriman = `Dialihkan ${shipment.reorder.new_order_no ? `ke ${shipment.reorder.new_order_no}` : null}`
          isReorder = true
        } else statusPengiriman = 'Dibatalkan'
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
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', paddingRight: 10 }}>
            <Image source={logo} style={{ width: 40, height: 40 }} />
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
            <TouchableOpacity disabled={!isReorder} onPress={() => {
              if (isReorder) {
                this.props.getOrderDetail(shipment.reorder.new_order_no, orderData.customer.email)
              }
            }}>
              <Text style={{ fontFamily: 'Quicksand-Bold', color: '#757886', fontSize: 18, width: 185 }}>{statusPengiriman}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: 'column', position: 'absolute', right: 0 }}>
          <Text style={{ textAlign: 'right', fontFamily: 'Quicksand-Regular', fontSize: 14 }}>No. Invoice</Text>
          {
            shipment.invoice_no
              ? <TouchableOpacity onPress={() => this.setCopy(shipment.invoice_no)} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Icon name='content-copy' size={14} color={'#757886'} />
                <Text style={{ textAlign: 'right', fontFamily: 'Quicksand-Bold', fontSize: 14, marginLeft: 5 }}>{shipment.invoice_no}</Text>
              </TouchableOpacity>
              : null
          }
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  order: state.order
})

const mapDispatchToProps = (dispatch) => ({
  getOrderDetail: (orderId, email) => dispatch(OrderActions.orderRequest(orderId, email))
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderTransactionLogo)
