import React, { Component } from 'react'
import { Text, View, Dimensions, TouchableOpacity, Image } from 'react-native'
import { Container, DistributeSpaceBetween, FontSizeM, Bold, InfoBox } from '../Styles/StyledComponents'
import dayjs from 'dayjs'
import { UpperCase, NumberWithCommas } from '../Utils/Misc'
import config from '../../config'
import isEmpty from 'lodash/isEmpty'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { WithContext } from '../Context/CustomContext'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

// Components
import EasyModal from './EasyModal'

class ReturnRefundFinishComponent extends Component {
  constructor () {
    super()
    this.state = {
      isfetched: false
    }
  }

  renderRefundEstimationPrice = (returnEstimationData) => {
    const renderData = [
      {
        header: 'Harga pembelian produk',
        data: `Rp ${NumberWithCommas(returnEstimationData.refund_product)}`
      },
      {
        header: 'Ongkos Kirim',
        data: `+ Rp ${NumberWithCommas(returnEstimationData.refund_shipping)}`
      },
      {
        header: 'Penggunaan Voucher',
        data: `+ Rp ${NumberWithCommas(returnEstimationData.refund_voucher)}`
      }
    ]
    return (
      <>
        <View style={{ marginVertical: 15 }}>
          {renderData.map((data, index) => (
            <View style={{ marginBottom: 10 }} key={`estimation detail${index}`}>
              <DistributeSpaceBetween key={`render estimation detail ${index}`}>
                <View style={{ width: Dimensions.get('screen').width * 0.45 }}>
                  <FontSizeM>{data.header}</FontSizeM>
                </View>
                <View style={{ width: Dimensions.get('screen').width * 0.45 }}>
                  {index >= 1
                    ? <Text style={{ fontSize: 16, fontFamily: 'Quicksand-Bold', lineHeight: 16, color: '#049372', textAlign: 'right' }}>{data.data}</Text>
                    : <Text style={{ fontSize: 16, fontFamily: 'Quicksand-Bold', lineHeight: 16, textAlign: 'right' }}>{data.data}</Text>
                  }
                </View>
              </DistributeSpaceBetween>
            </View>
          ))}
        </View>
        <View style={{ borderTopWidth: 1, borderTopColor: '#E5E9F2', paddingVertical: 10 }}>
          <DistributeSpaceBetween>
            <Bold style={{ fontSize: 16 }}>Estimasi Pengembalian:</Bold>
            <Bold style={{ fontSize: 16 }}>{`Rp ${NumberWithCommas(returnEstimationData.refund_product + returnEstimationData.refund_shipping + returnEstimationData.refund_voucher)}`}</Bold>
          </DistributeSpaceBetween>
        </View>
        <InfoBox>
          <View style={{ paddingHorizontal: 15 }}>
            <DistributeSpaceBetween>
              <Icon name='information-outline' size={16} />
              <View style={{ paddingHorizontal: 10 }}>
                <FontSizeM>Estimasi pengambalian dana dapat berubah sesuai dengan hasil investigasi</FontSizeM>
              </View>
            </DistributeSpaceBetween>
          </View>
        </InfoBox>
      </>
    )
  }

  render () {
    const { item, returnMethods, products } = this.props
    let returnMethodIndex = returnMethods.findIndex(data => data.value === item.refund_type)
    const renderData = [
      {
        header: 'No Pengajuan',
        data: item.refund_no
      },
      {
        header: 'Tanggal Pengajuan',
        data: dayjs(item.created_at).format('D MMMM YYYY')
      },
      {
        header: 'Produk yang dikembalikan',
        data: UpperCase(item.item.name.toLowerCase())
      },
      {
        header: 'Metode Pengembalian',
        data: returnMethods[returnMethodIndex].name
      },
      {
        header: 'Estimasi Pengembalian Dana'
      }
    ]
    const productIndex = products.findIndex(product => product.sku === item.item.sku)
    const selectedProduct = products[productIndex]
    const discountItemQty = (selectedProduct.discount_item_qty === 0) ? 1 : selectedProduct.discount_item_qty
    const discountStep = (selectedProduct.discount_step === 0) ? 1 : selectedProduct.discount_step
    return (
      <Container>
        {(renderData.map((data, dataIndex) => (
          <View style={{ marginBottom: 20 }} key={`return summary ${dataIndex}`}>
            <DistributeSpaceBetween>
              <View style={{ width: Dimensions.get('screen').width * 0.45, alignSelf: 'flex-start' }}>
                <FontSizeM>{data.header}</FontSizeM>
              </View>
              <View style={{ width: Dimensions.get('screen').width * 0.45, alignSelf: 'flex-start' }}>
                {(dataIndex === 4)
                  ? <TouchableOpacity onPress={() => this.refs.child.setModal()}>
                    <Text style={{ fontSize: 16, fontFamily: 'Quicksand-Bold', lineHeight: 16, color: '#008CCF', textDecorationLine: 'underline' }}>{`Rp ${NumberWithCommas(item.refund_product + item.refund_shipping + item.refund_voucher)}`}</Text>
                  </TouchableOpacity>
                  : <Text style={{ fontSize: 16, fontFamily: 'Quicksand-Bold', lineHeight: 16 }}>{data.data}</Text>
                }
              </View>
            </DistributeSpaceBetween>
          </View>
        )))}
        <EasyModal ref='child' size={80} close>
          <ShimmerPlaceHolder
            autoRun
            width={150}
            height={150}
            visible={this.state.isfetched}
            style={{ alignSelf: 'center', justifyContent: 'center' }}
          >
            <Image
              source={{ uri: `${config.imageURL}/w_150,h_150,q_auto/${selectedProduct.image_url}` }}
              style={{ justifyContent: 'center', alignSelf: 'center', width: 150, height: 150 }}
              onLoad={() => this.setState({ isfetched: true })} />
          </ShimmerPlaceHolder>
          <Container>
            <Bold style={{ fontSize: 20 }}>{UpperCase(item.item.name.toLowerCase())}</Bold>
            {!isEmpty(selectedProduct.promo_items) &&
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, fontFamily: 'Quicksand-Regular' }}>Produk Promo </Text>
              <Icon name='information' color='#F26525' />
              <Bold style={{ fontSize: 14, color: '#F26525' }}>{`Buy ${discountItemQty} Get ${discountStep}`}</Bold>
            </View>
            }
            {this.renderRefundEstimationPrice(item)}
          </Container>
        </EasyModal>
      </Container>
    )
  }
}

export default WithContext(ReturnRefundFinishComponent)
