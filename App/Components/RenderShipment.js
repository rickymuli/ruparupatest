import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Modal, SafeAreaView, Linking, Platform } from 'react-native'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import { UpperCase } from '../Utils/Misc'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'

// Components
import DeliveryLogo from './DeliveryLogo'
import ModalTracking from './ModalTracking'

class RenderShipment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showAddress: false,
      modalTrackingVisible: false,
      selectedShipment: null
    }
  }

  handleModalTracking = (shipment) => {
    this.setState({ selectedShipment: shipment }, () => {
      this.setModalTrackingVisible(true)
    })
  }

  setModalTrackingVisible (visible) {
    this.setState({ modalTrackingVisible: visible })
  }

  toggleShowHideAddress = () => {
    let { showAddress } = this.state
    if (showAddress) {
      this.setState({ showAddress: false })
    } else {
      this.setState({ showAddress: true })
    }
  }

  ucFirst (address) {
    if (!isEmpty(address)) {
      return UpperCase(address.toLowerCase())
    } else {
      return null
    }
    // return (address.charAt(0).toUpperCase() + address.toLowerCase().slice(1))
  }

  // Render shipping address
  renderShippingAddress = (shippingAddress) => {
    const { showAddress } = this.state
    return (
      <View style={{ flexDirection: 'column', marginTop: 10 }}>
        <TouchableOpacity onPress={() => this.toggleShowHideAddress()}>
          <Text style={{ fontFamily: 'Quicksand-Regular' }}>Dikirim ke <Text style={{ fontFamily: 'Quicksand-Bold' }}>{this.ucFirst(shippingAddress.address_name)}</Text> {(showAddress) ? <Icon name='chevron-up' size={20} /> : <Icon name='chevron-down' size={20} />}</Text>
        </TouchableOpacity>
        {(showAddress)
          ? <View style={{ flexDirection: 'column', paddingVertical: 10 }}>
            <Text style={{ fontFamily: 'Quicksand-Regular', marginBottom: 5 }}>{this.ucFirst(shippingAddress.first_name)} - {shippingAddress.phone}</Text>
            <Text style={{ fontFamily: 'Quicksand-Regular', marginBottom: 5 }}>{this.ucFirst(shippingAddress.full_address)}</Text>
            <Text style={{ fontFamily: 'Quicksand-Regular', marginBottom: 5 }}>{this.ucFirst(shippingAddress.kecamatan.kecamatan_name)}, {this.ucFirst(shippingAddress.city.city_name)}</Text>
            <Text style={{ fontFamily: 'Quicksand-Regular', marginBottom: 5 }}>{shippingAddress.province.province_name} - {shippingAddress.post_code}</Text>
          </View>
          : null
        }
      </View>
    )
  }

  openGps (shipment) {
    var res = shipment.shipping_from_geolocation.split(',')
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' })
    const latLng = `${res[0]},${res[1]}`
    const label = shipment.shipping_from_store
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    })
    Linking.openURL(url)
  }

  render () {
    const { shipment, order } = this.props
    let shipmentStatusDescription
    switch (shipment.shipment_status) {
      case 'new':
        shipmentStatusDescription = 'New Order'
        break
      case 'pending':
        shipmentStatusDescription = 'Pesanan anda sedang kami alihkan'
        break
      case 'standby':
      case 'processing':
        shipmentStatusDescription = 'Pesanan anda sedang disiapkan'
        break
      case 'ready_to_pickup':
        if (shipment.details[0].delivery_method === 'pickup') {
          shipmentStatusDescription = 'Pesanan anda siap diambil'
        } else {
          shipmentStatusDescription = 'Menunggu kurir '
        }
        break
      case 'peding_delivered':
      case 'received':
        shipmentStatusDescription = 'Pesanan anda telah diterima'
        break
      case 'picked':
        shipmentStatusDescription = 'Pesanan anda sudah diserahkan ke kurir'
        break
      case 'shipped':
        shipmentStatusDescription = 'Pesanan anda sedang dalam proses pengiriman'
        break
      default:
        break
    }

    return (
      <View style={{ paddingHorizontal: 10, marginTop: 15, flexDirection: 'column' }}>
        <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 16 }}>
          {(shipment.shipping_by === 'Ruparupa')
            ? <Text style={{ fontSize: 18 }}>rup<Text style={{ color: '#F26524' }}>a</Text>rup<Text style={{ color: '#0C94D4' }}>a</Text></Text>
            : <Text style={{ fontSize: 18 }}>{shipment.shipping_by}</Text>
          }
          {(shipment.shipping_from_store)
            ? (shipment.details[0].delivery_method === 'pickup')
              ? ` diambil di ${shipment.shipping_from_store}`
              : ` dari ${shipment.shipping_from_store}`
            : ` dari Gudang`
          }
        </Text>
        {(get(shipment, 'details[0].delivery_method', '') === 'pickup' && shipment.shipping_from_geolocation)
          ? <TouchableOpacity onPress={() => this.openGps(shipment)} style={{ justifyContent: 'center', alignItems: 'center', width: '50%', borderWidth: 1, borderColor: '#E0E6ED', borderRadius: 3, marginVertical: 2, paddingVertical: 2 }}>
            <Text style={{ fontFamily: 'Quicksand-Regular', fontSize: 18, textAlign: 'center' }}>Lihat Map</Text>
          </TouchableOpacity>
          : null
        }
        {(!isEmpty(shipment.shipping_address))
          ? this.renderShippingAddress(shipment.shipping_address)
          : (!isEmpty(shipment.details[0].shipping_address) && !isEmpty(shipment.details[0].shipping_address.full_address))
            ? this.renderShippingAddress(shipment.details[0].shipping_address)
            : null
        }
        {(shipment.carrier) ? <DeliveryLogo shipment={shipment} /> : null}
        {(shipment.shipment_status === 'ready_to_pickup' && shipment.customer_pin_code)
          ? <View style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 18, fontFamily: 'Quicksand-Regular' }}>Kode Pick up Point <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{shipment.customer_pin_code}</Text></Text>
          </View>
          : null
        }
        {(!isEmpty(shipmentStatusDescription))
          ? <Text style={{ fontFamily: 'Quicksand-Bold', paddingVertical: 10, color: '#555761', fontSize: 15 }}>{shipmentStatusDescription}</Text>
          : null
        }
        {(shipment.shipment_tracking)
          ? <TouchableOpacity onPress={() => this.handleModalTracking(shipment)} style={{ borderColor: '#E0E6ED', borderWidth: 1, borderRadius: 3, padding: 10 }}>
            <Text style={{ fontFamily: 'Quicksand-Medium', fontSize: 18, textAlign: 'center' }}>Lihat Detail</Text>
          </TouchableOpacity>
          : null
        }
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#eee', marginVertical: 20 }} />
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.modalTrackingVisible}
          onRequestClose={() => this.setModalTrackingVisible(false)}
        >
          <SafeAreaView>
            <ModalTracking setModalTrackingVisible={this.setModalTrackingVisible.bind(this)} order={order} selectedShipment={shipment} />
          </SafeAreaView>
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  order: state.order
})

export default connect(mapStateToProps)(RenderShipment)
