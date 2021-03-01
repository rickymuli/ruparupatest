import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, Dimensions } from 'react-native'
import dayjs from 'dayjs'
import { Container, DistributeSpaceBetween, Bold, FontSizeM, InfoBox } from '../Styles/StyledComponents'
import { UpperCase, NumberWithCommas } from '../Utils/Misc'
import isEmpty from 'lodash/isEmpty'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'
import config from '../../config'

// Redux
import ReturnRefundActions from '../Redux/ReturnRefundRedux'

// Components
import EasyModal from '../Components/EasyModal'
import LottieComponent from './LottieComponent'

class RefundStatusDetail extends Component {
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

  showEstimateDetail = () => {
    const { refundData } = this.props
    let items = []
    let item = refundData.item
    let promoItems = []
    item.promo_items.forEach((promo) => {
      promoItems.push({
        'sales_order_item_id': promo.sales_order_item_id,
        'qty_refunded': item.qty * promo.qty_ordered
      })
    })
    items.push({
      'sales_order_item_id': item.sales_order_item_id,
      'qty_refunded': item.qty_refunded,
      'refund_reason_id': item.refund_reason_id,
      'promo_items': promoItems
    })
    this.props.getEstimation(items)
    this.refs.child.setModal()
  }

  render () {
    const { returnRefund, item, noRefund, refundData } = this.props
    let reason = ''
    switch (refundData.refund_type) {
      case 'cancel_refund': reason = 'Batalkan Pesanan'; break
      case 'return_refund': reason = 'Pengembalian Dana'; break
      case 'tukar_guling': reason = 'Tukar Guling'; break
    }
    const renderData = [
      {
        header: 'No Pengajuan',
        data: noRefund
      },
      {
        header: 'Tanggal Pengajuan',
        data: dayjs(item.created_at).format('D MMMM YYYY')
      },
      {
        header: 'Produk yang dikembalikan',
        data: UpperCase(item.name.toLowerCase())
      },
      {
        header: 'Metode Pengembalian',
        data: reason
      },
      {
        header: 'Estimasi Pengembalian Dana'
      }
    ]
    const discountStep = (item.discount_step === 0) ? 1 : item.discount_step
    let discountItemQty = 0
    let estimationPrice = refundData.subtotal + refundData.refund_shipping_default + (refundData.registration_voucher_amount + refundData.redeem_voucher_amount + refundData.refund_voucher_amount + refundData.refund_voucher_bc_amount)
    item.promo_items.map((promoItems, index) => {
      discountItemQty += promoItems.discount_item_qty
    })
    return (
      <View style={{ marginTop: 10 }}>
        {renderData.map((data, dataIndex) => (
          <View style={{ marginBottom: 20 }} key={`return summary ${dataIndex}`}>
            <DistributeSpaceBetween>
              <View style={{ width: Dimensions.get('screen').width * 0.45, alignSelf: 'flex-start' }}>
                <FontSizeM>{data.header}</FontSizeM>
              </View>
              <View style={{ width: Dimensions.get('screen').width * 0.45, alignSelf: 'flex-start' }}>
                {(dataIndex === 4)
                  ? <TouchableOpacity onPress={() => this.showEstimateDetail()}>
                    <Text style={{ fontSize: 16, fontFamily: 'Quicksand-Bold', lineHeight: 16, color: '#008CCF', textDecorationLine: 'underline' }}>{`Rp ${NumberWithCommas(estimationPrice)}`}</Text>
                  </TouchableOpacity>
                  : <Text style={{ fontSize: 16, fontFamily: 'Quicksand-Bold', lineHeight: 16 }}>{data.data}</Text>
                }
              </View>
            </DistributeSpaceBetween>
          </View>
        ))}
        <EasyModal ref='child' size={80} close>
          {returnRefund.fetchingEstimation
            ? <LottieComponent />
            : <>
              {!isEmpty(returnRefund.estimationData)
                ? <Image source={{ uri: `${config.imageURL}/w_150,h_150,q_auto/${returnRefund.estimationData[0].image_url}` }} style={{ justifyContent: 'center', alignSelf: 'center', width: 150, height: 150 }} />
                : null
              }
              <Container>
                <Bold style={{ fontSize: 20 }}>{UpperCase(item.name.toLowerCase())}</Bold>
                {!isEmpty(item.promo_items) &&
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, fontFamily: 'Quicksand-Regular' }}>Produk Promo </Text>
                  <Icon name='information' color='#F26525' />
                  <Bold style={{ fontSize: 14, color: '#F26525' }}>{`Buy ${discountItemQty} Get ${discountStep}`}</Bold>
                </View>
                }
                {(!isEmpty(returnRefund.estimationData)) ? this.renderRefundEstimationPrice(returnRefund.estimationData[0]) : null}
              </Container>
          </>
          }
        </EasyModal>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  returnRefund: state.returnRefund
})

const mapDispatchToProps = (dispatch) => ({
  getEstimation: (data) => dispatch(ReturnRefundActions.getEstimationRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(RefundStatusDetail)
