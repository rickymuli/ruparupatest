import React, { Component } from 'react'
import { View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Container, DistributeSpaceBetween, FontSizeM, Bold, RowItem } from '../Styles/StyledComponents'
import { formatWithSeparator } from '../Services/Day'
import { NumberWithCommas } from '../Utils/Misc'

export default class OrderInfo extends Component {
  render () {
    const { data } = this.props
    return (
      <Container>
        <DistributeSpaceBetween>
          <RowItem>
            <Icon name='calendar' size={18} />
            <View style={{ marginLeft: 10, justifyContent: 'flex-end' }}>
              <FontSizeM>Tanggal Pembelian</FontSizeM>
            </View>
          </RowItem>
          <View style={{ marginLeft: 10, justifyContent: 'flex-end' }}>
            <Bold style={{ fontSize: 16 }}>{formatWithSeparator(data.order_date)}</Bold>
          </View>
        </DistributeSpaceBetween>
        <DistributeSpaceBetween>
          <RowItem>
            <Icon name='calendar' size={18} />
            <View style={{ marginLeft: 10, justifyContent: 'flex-end' }}>
              <FontSizeM>Tanggal Pembayaran</FontSizeM>
            </View>
          </RowItem>
          <View style={{ marginLeft: 10, justifyContent: 'flex-end' }}>
            <Bold style={{ fontSize: 16 }}>{formatWithSeparator(data.payment_date)}</Bold>
          </View>
        </DistributeSpaceBetween>
        <DistributeSpaceBetween>
          <RowItem>
            <Icon name='tag-outline' size={18} />
            <View style={{ marginLeft: 10, justifyContent: 'flex-end' }}>
              <FontSizeM>Voucher</FontSizeM>
            </View>
          </RowItem>
          <View style={{ marginLeft: 10, justifyContent: 'flex-end' }}>
            <Bold style={{ color: '#F3251D', fontSize: 16 }}>- Rp{NumberWithCommas(data.gift_card_amount)}</Bold>
          </View>
        </DistributeSpaceBetween>
        <DistributeSpaceBetween>
          <RowItem>
            <Icon name='file-document' size={18} />
            <View style={{ marginLeft: 10, justifyContent: 'flex-end' }}>
              <FontSizeM>Grand Total</FontSizeM>
            </View>
          </RowItem>
          <View style={{ marginLeft: 10, justifyContent: 'flex-end' }}>
            <Bold style={{ fontSize: 16 }}>Rp{NumberWithCommas(data.grand_total)}</Bold>
          </View>
        </DistributeSpaceBetween>
      </Container>
    )
  }
}
