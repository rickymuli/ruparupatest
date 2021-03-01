import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import analytics from '@react-native-firebase/analytics'

import Fontisto from 'react-native-vector-icons/Fontisto'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import { PrimaryText, PrimaryTextMedium, PrimaryTextBold, TertiaryTextBold, fonts } from '../Styles'
import { NumberWithCommas } from '../Utils/Misc'
export class CheckoutButton extends PureComponent {
  goToPaymentPage () {
    // Firebase Analytic begin_checkout
    const { items, subtotal } = this.props.cart.data
    const analyticDataItems = []
    items.forEach(item => {
      item.details.forEach(detail => {
        analyticDataItems.push({
          item_id: detail.sku,
          item_name: detail.name,
          item_brand: detail.brand,
          item_category: detail.category.name,
          price: detail.prices.selling_price ?? 0,
          quantity: detail.qty_ordered
        })
      })
    })
    let analyticData = {
      coupon: '',
      currency: 'IDR',
      items: analyticDataItems,
      value: subtotal
    }
    analytics().logEvent('begin_checkout', analyticData)
    const { navigation, route } = this.props
    let itmData = route?.params?.itmData ?? {}
    let utmParameter = ''
    if (itmData.utm_source) utmParameter = `&utm_source=${itmData.utm_source}&utm_campaign=${itmData.utm_campaign}&utm_medium=${itmData.utm_medium}`
    else if (itmData.itm_source) {
      utmParameter = `&itm_source=${itmData.itm_source}&itm_campaign=${itmData.itm_campaign}&itm_term=${itmData.itm_term || ''}`
    }
    navigation.navigate('PaymentPage', { utmParameter })
  }
  render () {
    const { cart, storeData } = this.props
    if (isEmpty(get(cart, 'data.items'))) return null
    let grandTotal = get(cart, 'data.subtotal', 0) - get(cart, 'data.gift_cards_amount', 0) - get(cart, 'data.discount_amount', 0)
    let totalQtyItem = get(cart, 'data.total_qty_item', 0)
    return (
      <View style={{ padding: 10, flexDirection: 'column' }}>
        <View style={{ marginBottom: 15, flexDirection: 'column' }}>
          {get(storeData, 'store_name') &&
          <View style={{ justifyContent: 'flex-start', flexDirection: 'row', padding: 2, marginVertical: 8, alignItems: 'center' }}>
            <Fontisto name='shopping-store' size={18} />
            <Text style={{ fontFamily: fonts.medium, fontSize: 16, paddingLeft: 4 }} numberOfLines={2}>{storeData.store_name}</Text>
          </View>
          }
          <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <PrimaryTextMedium style={{ fontSize: 14 }}>Total Pesanan</PrimaryTextMedium>
            <TertiaryTextBold style={{ fontSize: 14 }}>{totalQtyItem}</TertiaryTextBold>
          </View>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <PrimaryTextMedium style={{ fontSize: 14 }}>Total Harga</PrimaryTextMedium>
            <TertiaryTextBold style={{ fontSize: 14 }}>Rp {NumberWithCommas(grandTotal)}</TertiaryTextBold>
          </View>
        </View>
        {(cart.fetching)
          ? <View style={{ paddingVertical: 10, paddingHorizontal: 20, width: '100%', backgroundColor: '#E5E9F2' }}>
            <PrimaryText style={{ fontSize: 18, textAlign: 'center' }}>...</PrimaryText>
          </View>
          : <View>
            {(cart.err !== 'NETWORK_ERROR') &&
              <TouchableOpacity
                onPress={() => this.goToPaymentPage()}
                style={{ borderRadius: 4, paddingVertical: 10, paddingHorizontal: 20, width: '100%', backgroundColor: '#F26525' }}>
                <PrimaryTextBold style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>Checkout</PrimaryTextBold>
              </TouchableOpacity>
            }
          </View>
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  cart: state.cart,
  storeData: state.storeData.data
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutButton)
