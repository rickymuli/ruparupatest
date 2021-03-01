import React, { Component } from 'react'
import { Dimensions, Image, View } from 'react-native'
import styled from 'styled-components'
import dayjs from 'dayjs'

export default class OrderNews extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: props.newsData
    }
  }

  goToOrderList () {
    const { userEmail, orderId } = this.props.newsData
    this.props.navigation.navigate('OrderStatusDetail', {
      orderData: {
        email: userEmail,
        order_id: orderId
      }
    })
  }

  render () {
    const { shipmentStatus, orderId, shippingFromStore, createdDate, invoiceNo, orderNo, carrierName, trackingNumber } = this.props.newsData
    switch (shipmentStatus) {
      case 'received':
        return (
          <ItemContainer onPress={() => this.goToOrderList()} >
            <Image source={require('../assets/images/order-status/diterima-check-status-detail.webp')} style={{ height: 48, width: 47 }} />
            <NotifDescription>
              <View style={{ flexDirection: 'row' }}>
                <TitleText>{orderId}{' - Di Terima Paket #'}{orderNo}</TitleText>
                <DateText>{dayjs(createdDate).format('D MMMM YYYY, hA')}</DateText>
              </View>
              <DescText>{'Pesanan ada terkirim via ' + shippingFromStore + ' dengan no resi ' + carrierName + ' ' + trackingNumber + ', invoice: ' + invoiceNo}</DescText>
            </NotifDescription>
          </ItemContainer>
        )
      case 'pickup':
        return (
          <ItemContainer onPress={() => this.goToOrderList()} >
            <Image source={require('../assets/images/order-status/diproses-diambil-status-detail.webp')} style={{ height: 48, width: 47 }} />
            <NotifDescription>
              <View style={{ flexDirection: 'row' }}>
                <TitleText>{orderId}{' - Di Ambil Paket #'}{orderNo}</TitleText>
                <DateText>{dayjs(createdDate).format('D MMMM YYYY, hA')}</DateText>
              </View>
              <DescText>{'Pesanan ada terkirim via ' + shippingFromStore + ' dengan no resi ' + carrierName + ' ' + trackingNumber + ', invoice: ' + invoiceNo}</DescText>
            </NotifDescription>
          </ItemContainer>
        )
      case 'delivery':
        return (
          <ItemContainer onPress={() => this.goToOrderList()} >
            <Image source={require('../assets/images/order-status/diproses-regular-status-detail.webp')} style={{ height: 48, width: 47 }} />
            <NotifDescription>
              <View style={{ flexDirection: 'row' }}>
                <TitleText>{orderId}{' - Di Proses Paket #'}{orderNo}</TitleText>
                <DateText>{dayjs(createdDate).format('D MMMM YYYY, hA')}</DateText>
              </View>
              <DescText>{'Pesanan ada terkirim via ' + shippingFromStore + ' dengan no resi ' + carrierName + ' ' + trackingNumber + ', invoice: ' + invoiceNo}</DescText>
            </NotifDescription>
          </ItemContainer>
        )
      case 'canceled':
        return (
          <ItemContainer onPress={() => this.goToOrderList()} >
            <Image source={require('../assets/images/order-status/dibatalkan-check-status-detail.webp')} style={{ height: 48, width: 47 }} />
            <NotifDescription>
              <View style={{ flexDirection: 'row' }}>
                <TitleText>{orderId}{' - Di Batalkan Paket #'}{orderNo}</TitleText>
                <DateText>{dayjs(createdDate).format('D MMMM YYYY, hA')}</DateText>
              </View>
              <DescText>{'Pesanan ada DiBatalakan via ' + shippingFromStore + ' dengan no resi ' + carrierName + ' ' + trackingNumber + ', invoice: ' + invoiceNo}</DescText>
            </NotifDescription>
          </ItemContainer>
        )
      default:
        return null
    }
  }
}

const ItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal: 5;
  padding-vertical: 15;
`
const NotifDescription = styled.View`
  flex-wrap: wrap;
  width: ${Dimensions.get('window').width * 0.75}
  margin-right: 20px;
`
const DescText = styled.Text`
  font-size: 10;
  font-family: Quicksand-Regular;
`
const TitleText = styled.Text`
  font-size: 12;
  font-weight: bold;
  font-family: Quicksand-Regular;
  margin-bottom: 1px;
`

const DateText = styled.Text`
  opacity: 0.5;
  position: absolute;
  font-size: 8;
  font-family: Quicksand-Regular;
  margin-bottom: 1px;
  right:0;
  bottom:0;
`
