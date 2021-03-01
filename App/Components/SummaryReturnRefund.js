import React, { Component } from 'react'
import { View, Dimensions, Text, TouchableOpacity, Image } from 'react-native'
import { Container, DistributeSpaceBetween, FontSizeM, Bold, InfoBox } from '../Styles/StyledComponents'
import { UpperCase, NumberWithCommas } from '../Utils/Misc'
import { WithContext } from '../Context/CustomContext'
import dayjs from 'dayjs'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import config from '../../config'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

// Component
import LoadingComponent from './LoadingComponent'
import EasyModal from './EasyModal'

class SummaryReturnRefund extends Component {
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
    const { item, returnMethods, index, returnRefund } = this.props
    const renderData = [
      {
        header: 'No Pesanan',
        data: item.invoiceNo
      },
      {
        header: 'Tanggal Pesanan',
        data: dayjs(item.orederDate).format('D MMMM YYYY')
      },
      {
        header: 'Produk yang dikembalikan',
        data: UpperCase(item.name.toLowerCase())
      },
      {
        header: 'Metode Pengembalian',
        data: returnMethods[index].reasonName
      },
      {
        header: 'Estimasi Pengembalian Dana'
      }
    ]
    const discountStep = (item.discount_step === 0) ? 1 : item.discount_step
    let discountItemQty = 0
    item.promo_items.map((promoItems, index) => {
      discountItemQty += promoItems.discount_item_qty
    })
    return (
      <Container>
        {renderData.map((data, dataIndex) => (
          <View style={{ marginBottom: 20 }} key={`return summary ${dataIndex}`}>
            <DistributeSpaceBetween>
              <View style={{ width: Dimensions.get('screen').width * 0.45, alignSelf: 'flex-start' }}>
                <FontSizeM>{data.header}</FontSizeM>
              </View>
              <View style={{ width: Dimensions.get('screen').width * 0.45, alignSelf: 'flex-start' }}>
                {(dataIndex === 4)
                  ? returnRefund.fetchingEstimation
                    ? <LoadingComponent />
                    : <TouchableOpacity onPress={() => this.refs.child.setModal()}>
                      <Text style={{ fontSize: 16, fontFamily: 'Quicksand-Bold', lineHeight: 16, color: '#008CCF', textDecorationLine: 'underline' }}>{(!isEmpty(returnRefund.estimationData[index])) ? `Rp ${NumberWithCommas(returnRefund.estimationData[index].refund_product + returnRefund.estimationData[index].refund_shipping + returnRefund.estimationData[index].refund_voucher)}` : 'Rp. --'}</Text>
                    </TouchableOpacity>
                  : <Text style={{ fontSize: 16, fontFamily: 'Quicksand-Bold', lineHeight: 16 }}>{data.data}</Text>
                }
              </View>
            </DistributeSpaceBetween>
          </View>
        ))}
        <EasyModal ref='child' size={80} close>
          <Image source={{ uri: `${config.imageURL}/w_150,h_150,q_auto/${item.image_url}` }} style={{ justifyContent: 'center', alignSelf: 'center', width: 150, height: 150 }} />
          <Container>
            <Bold style={{ fontSize: 20 }}>{UpperCase(item.name.toLowerCase())}</Bold>
            {!isEmpty(item.promo_items) &&
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, fontFamily: 'Quicksand-Regular' }}>Produk Promo </Text>
              <Icon name='information' color='#F26525' />
              <Bold style={{ fontSize: 14, color: '#F26525' }}>{`Buy ${discountItemQty} Get ${discountStep}`}</Bold>
            </View>
            }
            {(returnRefund.estimationData.findIndex((data) => data.sales_order_item_id === item.sales_order_item_id) !== -1)
              ? !isEmpty(returnRefund.estimationData[returnRefund.estimationData.findIndex((data) => data.sales_order_item_id === item.sales_order_item_id)])
                ? this.renderRefundEstimationPrice(returnRefund.estimationData[returnRefund.estimationData.findIndex((data) => data.sales_order_item_id === item.sales_order_item_id)])
                : null
              : null
            }
          </Container>
        </EasyModal>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  returnRefund: state.returnRefund
})

export default WithContext(connect(mapStateToProps)(SummaryReturnRefund))
