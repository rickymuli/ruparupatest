import React, { Component } from 'react'
import { View, TouchableOpacity, Text, ScrollView, Dimensions, Image } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { formatLLL } from '../Services/Day'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
export default class ModalTracking extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedShipment: props.selectedShipment || null,
      order: props.order || null,
      circleSize: 0.07, // in percent (Out of 1)
      width: 0
    }
  }

  componentDidMount () {
    // this is required to get the correct position for the circle icon
    const { width } = Dimensions.get('screen')
    this.setState({ width })
  }

  componentWillReceiveProps (newProps) {
    const { selectedShipment, order } = newProps
    this.setState({ selectedShipment, order })
  }

  renderStatusPending = (orderData) => {
    const { circleSize, width } = this.state
    let circleWidth = width * circleSize
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ padding: 10, width: '25%' }}>
          <Image style={{ width: width * 0.15, height: (width * 0.15 / 1996) * 352 }} source={require('../assets/images/ruparupa-logo.webp')} />
        </View>
        <View style={{ width: circleWidth, height: circleWidth, backgroundColor: '#757885', borderRadius: 100 / 2, justifyContent: 'center', alignItems: 'center', zIndex: 5, position: 'absolute', left: '21.5%' }}>
          <Icon name='check' color='white' size={18} />
        </View>
        <View style={{ flexDirection: 'column', borderLeftWidth: 3, borderLeftColor: '#E0E6ED', paddingLeft: 20, paddingVertical: 10, width: '75%' }}>
          <Text style={{ color: '#757885', fontSize: 12, fontFamily: 'Quicksand-Regular' }}>{formatLLL(orderData.payment.created_at)}</Text>
          <Text style={{ fontSize: 14, flex: 1, fontFamily: 'Quicksand-Regular' }}>Anda telah melakukan pemesanan dan menunggu konfirmasi pembayaran</Text>
        </View>
      </View>
    )
  }

  renderStatusPaid = (orderData) => {
    const { circleSize, width } = this.state
    let circleWidth = width * circleSize
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ padding: 10, width: '25%' }}>
          <Image style={{ width: width * 0.15, height: (width * 0.15 / 1996) * 352 }} source={require('../assets/images/ruparupa-logo.webp')} />
        </View>
        <View style={{ width: circleWidth, height: circleWidth, backgroundColor: '#757885', borderRadius: 100 / 2, justifyContent: 'center', alignItems: 'center', zIndex: 5, position: 'absolute', left: '21.5%' }}>
          <Icon name='check' color='white' size={18} />
        </View>
        <View style={{ flexDirection: 'column', borderLeftWidth: 3, borderLeftColor: '#E0E6ED', paddingLeft: 20, paddingVertical: 10, width: '75%' }}>
          <Text style={{ color: '#757885', fontSize: 12, fontFamily: 'Quicksand-Regular' }}>{formatLLL(orderData.payment.created_at)}</Text>
          <Text style={{ fontSize: 14, flexWrap: 'wrap', fontFamily: 'Quicksand-Regular' }}>Terima kasih sudah berbelanja di Ruparupa! Pesanan Anda telah kami terima dan sedang dalam proses verifikasi. Kami akan mengirimkan update selanjutnya ke email Anda.</Text>
        </View>
      </View>
    )
  }

  getManifestDate = (date) => {
    const monthAbbr = date.split('-')[1]
    const monthInt = ('JanFebMarAprMayJunJulAugSepOctNovDec'.indexOf(monthAbbr) / 3 + 1).toString()
    return dayjs(date.replace(monthAbbr, monthInt), 'DD-MM-YYYY HH:mm:ss').format('DD MMMM YYYY HH:mm')
  }

  renderOrderStatus = (manifest, index) => {
    const { selectedShipment, circleSize, width } = this.state
    let shipmentStatus = JSON.parse(selectedShipment.shipment_tracking.status)
    // split date to reformat date
    let newManifestDate = ''
    if (manifest.cn_date) {
      let tempManifestDate = manifest.cn_date.split(' ')
      let manifestDate = tempManifestDate[0].split('-')
      newManifestDate = manifestDate[1] + '-' + manifestDate[0] + '-' + manifestDate[2] + ' ' + tempManifestDate[1]
    }
    if (manifest.manifest_date) {
      newManifestDate = manifest.manifest_date
    }
    let circleWidth = width * circleSize

    return (
      <View style={{ flexDirection: 'column' }} key={`order status tracking ${index}`}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ padding: 10, width: '25%' }}>
            <Text style={{ fontSize: 14, fontFamily: 'Quicksand-Regular' }}>{(selectedShipment.hasOwnProperty('carrier')) ? selectedShipment.carrier.carrier_name : '3PL'}</Text>
          </View>
          <View style={[{ width: circleWidth, height: circleWidth, borderRadius: 100 / 2, justifyContent: 'center', alignItems: 'center', zIndex: 5, position: 'absolute', left: '21.5%' }, (shipmentStatus.manifest.length === (index + 1) && manifest.cn_status !== 'DELIVERED') ? { backgroundColor: '#228B22' } : { backgroundColor: '#757885' }]}>
            <Icon name='check' color='white' size={18} />
          </View>
          <View style={{ flexDirection: 'column', borderLeftWidth: 3, borderLeftColor: '#E0E6ED', paddingLeft: 20, paddingVertical: 10, width: '75%' }}>
            <Text style={{ color: '#757885', fontSize: 12, fontFamily: 'Quicksand-Regular' }}>{(newManifestDate !== '') ? this.getManifestDate(newManifestDate) : null}</Text>
            <Text style={{ fontSize: 14, flexWrap: 'wrap', fontFamily: 'Quicksand-Regular' }}>{(manifest.cn_status) ? `${manifest.cn_status} ` : null}{(manifest.keterangan) ? manifest.keterangan : null}</Text>
          </View>
        </View>
        { ((manifest.cn_status && manifest.cn_status === 'DELIVERED') || (manifest.keterangan && manifest.keterangan === 'Completed')) ? this.renderStatusDelivered(newManifestDate) : null}
      </View >
    )
  }

  renderStatusDelivered = (newManifestDate) => {
    const { circleSize, width } = this.state
    let circleWidth = width * circleSize
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ padding: 10, width: '25%' }}>
          <Image style={{ width: width * 0.15, height: (width * 0.15 / 1996) * 352 }} source={require('../assets/images/ruparupa-logo.webp')} />
        </View>
        <View style={{ width: circleWidth, height: circleWidth, backgroundColor: '#228B22', borderRadius: 100 / 2, justifyContent: 'center', alignItems: 'center', zIndex: 5, position: 'absolute', left: '21.5%' }}>
          <Icon name='check' color='white' size={18} />
        </View>
        <View style={{ flexDirection: 'column', borderLeftWidth: 3, borderLeftColor: '#E0E6ED', paddingLeft: 20, paddingVertical: 10, width: '75%' }}>
          <Text style={{ color: '#757885', fontSize: 12, fontFamily: 'Quicksand-Regular' }}>{(newManifestDate !== '') ? newManifestDate : null}</Text>
          <Text style={{ fontSize: 14, flexWrap: 'wrap', fontFamily: 'Quicksand-Regular' }}>Pesanan Anda telah diterima. Terima kasih sudah berbelanja di Ruparupa!</Text>
        </View>
      </View>
    )
  }

  render () {
    const { selectedShipment, order } = this.state
    let orderData
    let shipmentStatus
    if (selectedShipment) {
      orderData = order.data
      shipmentStatus = null
      if (selectedShipment.shipment_tracking.hasOwnProperty('status')) {
        shipmentStatus = JSON.parse(selectedShipment.shipment_tracking.status)
      }
    }
    return (
      <View style={{ flexDirection: 'column', backgroundColor: 'white' }}>
        <ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => this.props.setModalTrackingVisible(false)}>
              <Icon name='arrow-left' size={24} style={{ color: '#555761' }} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontFamily: 'Quicksand-Bold' }}>Detail Status Pesanan</Text>
              <Text style={{ fontFamily: 'Quicksand-Regular', fontSize: 12 }}>{(selectedShipment.invoice_no) ? `${selectedShipment.invoice_no}` : null}</Text>
            </View>
            <View />
          </View>
          {(selectedShipment)
            ? <View style={{ padding: 20, marginBottom: 15, borderBottomColor: '#eee', borderBottomWidth: 1 }}>
              {this.renderStatusPending(orderData)}
              {(orderData.status !== 'pending' && orderData.status !== 'expire') ? this.renderStatusPaid(orderData) : null}
              {(shipmentStatus && shipmentStatus.manifest)
                ? shipmentStatus.manifest.map((manifest, index) => { return this.renderOrderStatus(manifest, index) })
                : (orderData.status === 'complete' && orderData.updated_at)
                  ? this.renderStatusDelivered(formatLLL(orderData.updated_at))
                  : null
              }
            </View>
            : null
          }
        </ScrollView>
      </View>
    )
  }
}
