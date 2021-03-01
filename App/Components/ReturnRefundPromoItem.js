import React, { Component } from 'react'
import { View, Image, Dimensions, Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Bold, FontSizeM, DistributeSpaceBetween, Price, Priceold, InfoBox, Container } from '../Styles/StyledComponents'
import config from '../../config'
import { NumberWithCommas } from '../Utils/Misc'

export default class ReturnRefundPromoItem extends Component {
  render () {
    const { product } = this.props
    const discountItemQty = (product.discount_item_qty === 0) ? 1 : product.discount_item_qty
    const discountStep = (product.discount_step === 0) ? 1 : product.discount_step
    const win = Dimensions.get('window')
    return (
      <View>
        <Container>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Text style={{ fontSize: 16, fontFamily: 'Quicksand-Regular' }}>Produk Promo </Text>
            <Icon name='information' color='#F26525' size={16} />
            <Bold style={{ fontSize: 16, color: '#F26525' }}>{`Buy ${discountItemQty} Get ${discountStep}`}</Bold>
          </View>
        </Container>
        {product.promo_items.map((item, index) => (
          <View key={`promo items for return refund ${index}`}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Image source={{ uri: `${config.imageURL}/w_100,h_100,q_auto/${item.image_url}` }} style={{ width: 100, height: 100 }} />
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Bold style={{ fontSize: 16 }}>Jumlah yang dikembalikan</Bold>
                <View style={{ marginTop: 5 }}>
                  <FontSizeM>{item.is_free_item}</FontSizeM>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 5 }}>
              <View style={{ width: win.width * 0.6 }}>
                <FontSizeM>{item.name}</FontSizeM>
              </View>
              <View style={{ flexDirection: 'column' }}>
                {(item.normal_price !== item.selling_price) &&
                <DistributeSpaceBetween>
                  <Priceold>{NumberWithCommas(item.normal_price)}</Priceold>
                  <Bold style={{ color: '#F26525', fontSize: 14 }}>{Math.floor((item.normal_price - item.selling_price) / item.normal_price * 100)}%</Bold>
                </DistributeSpaceBetween>
                }
                <Price>Rp {NumberWithCommas(item.selling_price)}</Price>
              </View>
            </View>
          </View>
        )
        )}
        <InfoBox>
          <DistributeSpaceBetween>
            <View style={{ paddingVertical: 10 }}>
              <Icon name='information-outline' color='#757886' size={16} />
            </View>
            <View style={{ padding: 10 }}>
              <FontSizeM>Untuk pembelian produk <Bold style={{ fontSize: 16 }}>{`Buy ${product.discount_step} Get ${product.promo_items.reduce((a, b) => a + (b['discount_item_qty'] || 0), 0)}`}</Bold>, maka kedua produk yang Anda dapatkan harus dikembalikan</FontSizeM>
            </View>
          </DistributeSpaceBetween>
        </InfoBox>
      </View>
    )
  }
}
