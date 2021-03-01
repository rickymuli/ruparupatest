import React, { Component } from 'react'
import { Image, View, Dimensions, TouchableOpacity, Text, Platform } from 'react-native'
import config from '../../config'
import { BorderContainer, Container, Bold, DistributeSpaceBetween, FontSizeM, Price, Priceold, InfoBox } from '../Styles/StyledComponents'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'
import { NumberWithCommas, UpperCase } from '../Utils/Misc'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

// Components
import ReturnRefundPromoItem from './ReturnRefundPromoItem'
import NumberInput from './NumberInput'
import Checkbox from './Checkbox'

export default class InvoiceList extends Component {
  constructor () {
    super()
    this.state = {
      showAddress: false,
      qty: []
    }
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {}
    if (!isEmpty(props.itemQty)) {
      if (props.itemQty !== state.qty) {
        returnObj = {
          ...returnObj,
          qty: props.itemQty
        }
      }
    }
    return returnObj
  }

  changeQty = (quantityDetail) => {
    this.props.changeQty(Number(quantityDetail.qty), quantityDetail.salesOrderItemId)
  }

  renderInvoiceItems = (product, itemIndex) => {
    const { index, selectedItems, invoice } = this.props
    const win = Dimensions.get('screen')
    let status = ''
    if (product.qty_ordered - product.qty_refunded <= 0) {
      status = 'all_refunded'
    } else {
      // Status received means product has been recieved by the customer
      if (invoice.shipment_status === 'received') {
        if (includes(['F', 'M'], product.store_code.charAt(0)) || product.store_code.indexOf('DC') > -1 || product.status_fulfillment === 'incomplete') {
          status = 'cust-service'
        }
      } else {
        status = 'process'
      }
    }
    let selectedIndex = this.state.qty.findIndex(data => data.salesOrderItemId === product.sales_order_item_id)
    let qty = Number(this.state.qty[selectedIndex].qty)
    return (
      <View style={{ paddingVertical: 5, borderTopColor: '#E5E9F2', borderTopWidth: 1 }} key={`return refund product${itemIndex}`}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={(Platform.OS === 'ios') ? { borderWidth: 1, borderRadius: 100, borderColor: '#D4DCE6' } : null}>
            {(status === '')
              ? <Checkbox
                onPress={() => this.props.selectItem(index, itemIndex, product.sales_order_item_id)}
                selected={(selectedItems.some(data => isEqual(data, { invoiceIndex: index, itemIndex })))} />
              : null
            }
          </View>
          <Image source={{ uri: `${config.imageURL}/w_100,h_100,q_auto/${product.image_url}` }} style={{ width: 100, height: 100 }} />
          {(status === '')
            ? <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Bold style={{ fontSize: 16 }}>Jumlah yang dikembalikan</Bold>
              <NumberInput fromCart quantity={qty} salesOrderItemId={product.sales_order_item_id} changeQuantity={this.changeQty.bind(this)} maxStock={Number(product.qty_ordered - product.qty_refunded)} />
            </View>
            : <InfoBox>
              <DistributeSpaceBetween>
                <Icon name='information-outline' size={16} />
                <View style={{ paddingHorizontal: 10, width: Dimensions.get('screen').width * 0.45 }}>
                  <FontSizeM>
                    {(status === 'process')
                      ? 'Pengiriman produk sedang dalam proses'
                      : (status === 'cust-service')
                        ? <FontSizeM>Harap hubungi <Bold style={{ fontSize: 16 }}>customer service</Bold> untuk pengembalian produk ini</FontSizeM>
                        : status === 'all_refunded'
                          ? `Proses pengembalian barang sudah selesai`
                          : null}
                  </FontSizeM>
                </View>
              </DistributeSpaceBetween>
            </InfoBox>
          }
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 5 }}>
          <View style={{ width: win.width * 0.6 }}>
            <FontSizeM>{product.name}</FontSizeM>
          </View>
          <View style={{ flexDirection: 'column' }}>
            {(product.normal_price !== product.selling_price) &&
            <DistributeSpaceBetween>
              <Priceold>{NumberWithCommas(product.normal_price)}</Priceold>
              <Bold style={{ color: '#F26525', fontSize: 14 }}>{Math.floor((product.normal_price - product.selling_price) / product.normal_price * 100)}%</Bold>
            </DistributeSpaceBetween>
            }
            <Price>Rp {NumberWithCommas(product.selling_price)}</Price>
          </View>
        </View>
        {!isEmpty(product.promo_items)
          ? <ReturnRefundPromoItem product={product} />
          : null
        }
      </View>
    )
  }

  render () {
    const { invoice } = this.props
    return (
      <BorderContainer>
        <Container>
          <Bold style={{ fontSize: 18 }}>
            {(invoice.delivery_method !== 'pickup')
              ? `${invoice.shipping_by} dari ${invoice.shipping_from_store}`
              : `Diambil di ${invoice.shipping_from_store}`
            }
          </Bold>
          <View style={{ marginTop: 10 }}>
            <DistributeSpaceBetween>
              <Text selectable style={{ fontSize: 16, fontFamily: 'Quicksand-Regular' }}>No. Invoice</Text>
              <Bold style={{ fontSize: 16 }}>{invoice.invoice_no}</Bold>
            </DistributeSpaceBetween>
          </View>
          {(invoice.delivery_method !== 'pickup') &&
          <>
            <TouchableOpacity onPress={() => this.setState({ showAddress: !this.state.showAddress })}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontFamily: 'Quicksand-Regular', marginRight: 10 }}>Dikirim Ke </Text>
                <Bold style={{ fontSize: 16 }}>{invoice.shipping_address.address_name} </Bold>
                {(this.state.showAddress)
                  ? <Icon name='menu-up' size={18} />
                  : <Icon name='menu-down' size={18} />
                }
              </View>
            </TouchableOpacity>
            {(this.state.showAddress) &&
            <View style={{ marginTop: 10 }}>
              <View style={{ marginBottom: 5 }}>
                <FontSizeM>{invoice.shipping_address.first_name} - {invoice.shipping_address.phone}</FontSizeM>
              </View>
              <View style={{ flexWrap: 'wrap', marginBottom: 5 }}>
                <FontSizeM>{invoice.shipping_address.full_address}</FontSizeM>
              </View>
              <View style={{ marginBottom: 5 }}>
                <FontSizeM>{UpperCase(invoice.shipping_address.kecamatan.kecamatan_name.toLowerCase())}, {UpperCase(invoice.shipping_address.city.city_name.toLowerCase())}</FontSizeM>
              </View>
              <View style={{ marginBottom: 5 }}>
                <FontSizeM>{invoice.shipping_address.province.province_name} - {invoice.shipping_address.post_code}</FontSizeM>
              </View>
            </View>
            }
          </>
          }
        </Container>
        {(invoice.items.map((product, itemIndex) => (
          this.renderInvoiceItems(product, itemIndex)
        )))}
      </BorderContainer>
    )
  }
}
