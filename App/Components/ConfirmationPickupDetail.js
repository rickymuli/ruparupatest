import React, { Component, Fragment } from 'react'
import { View, Text, Dimensions, Image } from 'react-native'
import { formatWithSeparator } from '../Services/Day'
import styles from './Styles/ConfirmationPickupStyles'
import styled from 'styled-components'
import { NumberWithCommas } from '../Utils/Misc'
import { isEmpty } from 'lodash'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { fonts, colors } from '../Styles'
const { width } = Dimensions.get('screen')

export class ConfirmationPickupDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      product: props.product
    }
  }

  renderDetail = () => {
    const { product, storeNew, storeOrigin } = this.props
    return (
      <ContainerDetail>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Image
              style={{ width: width * 0.1, height: width * 0.1 }}
              source={require('../assets/images/order-status/diproses-regular-status-detail.webp')} />
          </View>
          <View style={{ flex: 6, justifyContent: 'center' }}>
            <Text style={[styles.textBold, { fontSize: 14, lineHeight: 15 }]}>Pengiriman</Text>
          </View>
        </View>

        <View style={{ paddingVertical: 15, borderBottomColor: '#e0e6ed', borderBottomWidth: 1 }}>
          <ContainerIn>
            <View style={{ flex: 1.3 }}>
              <Text style={[styles.textNormal, { fontSize: 12 }]}>Toko Asal</Text>
            </View>
            <View style={{ flex: 3 }}>
              <Text style={[styles.textNormal, { textAlign: 'right', fontSize: 12 }]}>
                {storeOrigin.store_name}
              </Text>
            </View>
          </ContainerIn>

          <ContainerIn>
            <View style={{ flex: 1.3 }}>
              <Text style={[styles.textNormal, { fontSize: 12 }]}>Toko Pengalihan</Text>
            </View>
            <View style={{ flex: 3 }}>
              <Text style={[styles.textBold, { textAlign: 'right', fontSize: 12 }]}>
                {storeNew.store_name}
              </Text>
            </View>
          </ContainerIn>
        </View>
        {!isEmpty(product) &&
          product.map((item, idx) => {
            return (
              <Fragment key={idx}>
                { this.renderProduct(item)}
              </Fragment>
            )
          }) }

        {/* <View style={{ paddingTop: 5 }}>
          {this.renderTotal()}
        </View> */}
      </ContainerDetail>
    )
  }

  renderProduct = (item) => {
    return (
      <ContainerProduct>
        <View style={{ flex: 1, paddingVertical: 10 }}>
          <Image
            source={{ uri: item.image_url }}
            style={{ width: 90,
              height: 90 }} />
        </View>

        <View style={{ flex: 2, flexDirection: 'column', paddingVertical: 10 }}>
          <Text style={[styles.textNormal, { fontSize: 12, marginBottom: 10 }]}>{item.name}</Text>
          {(item.normal_price !== item.selling_price && item.normal_price) &&
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontFamily: fonts.regular, textDecorationLine: 'line-through', color: colors.primary, fontSize: 10, textDecorationColor: colors.primary }}>Rp {NumberWithCommas(item.normal_price)}</Text>
            <Text style={{ fontFamily: fonts.regular, color: '#F3251D', fontSize: 10 }}> ({Math.floor((item.normal_price - item.selling_price) / item.normal_price * 100)}%)</Text>
          </View>
          }
          <Text style={{ fontFamily: fonts.bold, color: '#008CCF' }}>Rp {NumberWithCommas(item.selling_price)}</Text>
          <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
            <Text style={{ fontFamily: fonts.regular, textAlign: 'right', fontSize: 10 }}>Jumlah: {item.qty}</Text>
          </View>
        </View>
      </ContainerProduct>
    )
  }

  renderTotal = () => {
    return (
      <View style={{ marginVertical: 5 }}>
        <ContainerTotal>
          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={[styles.textNormal, { fontSize: 12 }]}>Biaya Kirim</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textNormal, { fontSize: 12, textAlign: 'right' }]}>Rp. 999.999</Text>
          </View>
        </ContainerTotal>

        <ContainerTotal>
          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={[styles.textNormal, { fontSize: 12 }]}>Biaya Kirim</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textNormal, { fontSize: 12, textAlign: 'right' }]}>Rp. 999.999</Text>
          </View>
        </ContainerTotal>

        <ContainerTotal>
          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={[styles.textNormal, { fontSize: 12 }]}>Total</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textNormal, { fontSize: 12, textAlign: 'right' }]}>Rp. 999.999</Text>
          </View>
        </ContainerTotal>

      </View>
    )
  }

  render () {
    const { orderNo, orderDate } = this.props
    return (
      <View>
        <TouchableOpacity onPress={() => this.props.handleOpenOrderDetail(orderNo)}>
          <View style={{ alignSelf: 'center', marginBottom: 20, marginTop: 10 }}>
            <Text style={[styles.textBold, { fontSize: 16 }]}> {orderNo}</Text>
          </View>
        </TouchableOpacity>

        <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
          <ContainerIn>
            <View style={{ flex: 1 }}>
              <Text style={styles.textNormal}>Tgl Pembelian</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.textBold, { textAlign: 'right' }]}>{formatWithSeparator(orderDate)}</Text>
            </View>
          </ContainerIn>

          {/* <ContainerIn>
            <View style={{ flex: 1 }}>
              <Text style={styles.textNormal}>Voucher</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.textBold, { textAlign: 'right' }]}>Rp. -</Text>
            </View>
          </ContainerIn>

          <ContainerIn>
            <View style={{ flex: 1 }}>
              <Text style={styles.textNormal}>Grand Total</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.textBold, { textAlign: 'right' }]}>Rp. 999.999.999,-</Text>
            </View>
          </ContainerIn> */}

          {/* ProductDetail */}
          {this.renderDetail()}
        </View>
      </View>
    )
  }
}

export default ConfirmationPickupDetail

const ContainerProduct = styled.View`
flexDirection: row; 
paddingVertical: 10;
paddingHorizontal: 5;
borderBottomColor: #e0e6ed;
borderBottomWidth: 1;
`

const ContainerDetail = styled.View`
flex: 1;
borderWidth: 2;
borderColor: #f5a623;
paddingHorizontal: 15;
paddingVertical: 15;
marginVertical: 10;
`
const ContainerIn = styled.View`
flex: 1;
flexDirection: row;
marginBottom: 10;
`
const ContainerTotal = styled.View`
flexDirection: row;
marginLeft: 30%;
marginBottom: 5;
`
