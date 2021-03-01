import React, { PureComponent } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import get from 'lodash/get'

// Component
import { Lottie } from './'

// Styles
import { PrimaryTextMedium } from '../Styles'
import Styles from '../Containers/Styles/ProductDetailPageStyles'

export default class AddToCartMini extends PureComponent {
  render () {
    const { activeVariant, onClickBuyNow, page, buttonText, stock, loading, cart, goToPage } = this.props
    const { buttonCartMini, buttonTextMini, buttonPickup, button } = Styles
    let isPickupModal = page === 'pickupmodal'
    let isReviewRatingModal = page === 'reviewrating'
    let isProductRecommendationCart = page === 'productRecommendationCart'
    let isPurchasedItem = page === 'purchaseditem'
    let isUpgradeMembership = page === 'memberUpgrade'
    // Set Text Button
    let text = buttonText || 'Tambahkan'
    if (isPickupModal || (activeVariant && activeVariant.is_in_stock > 0) || (stock && stock.global_stock_qty > 0) || isProductRecommendationCart || isPurchasedItem || isUpgradeMembership) {
      if (get(activeVariant, 'status_preorder') === 10) text = 'Pre order'
      let style = { button: buttonCartMini, text: buttonTextMini }
      if (isPickupModal) style = { button: buttonPickup, text: Styles.buttonText }
      if (isReviewRatingModal) style = { button, text: Styles.buttonText }
      if (isPurchasedItem) text = 'Beli Lagi'
      if (isUpgradeMembership) {
        text = 'Tingkatkan Membership'
        style = { button, text: Styles.buttonText }
      }
      if (isUpgradeMembership && goToPage) {
        return (
          <TouchableOpacity disabled={loading || cart.fetching} onPress={() => onClickBuyNow()} style={[style.button, loading || cart.fetching ? { borderColor: '#757886' } : {}]}>
            {
              loading
                ? <Lottie buttonBlueLoading style={{ height: 25, width: 'auto' }} />
                : <Text style={[style.text, loading || cart.fetching ? { color: '#757886' } : {}]}>{text}</Text>
            }
          </TouchableOpacity>
        )
      } else {
        return (
          <TouchableOpacity disabled={loading || cart.fetching} onPress={() => onClickBuyNow()} style={[style.button, loading || cart.fetching ? { borderColor: '#757886' } : {}]}>
            {
              loading
                ? <Lottie addToCart style={{ height: 16, width: 'auto' }} />
                : <Text style={[style.text, loading || cart.fetching ? { color: '#757886' } : {}]}>{text}</Text>
            }
          </TouchableOpacity>
        )
      }
    } else {
      if (activeVariant && activeVariant.is_in_stock === 0) {
        return (
          <View style={Styles.buttonDisabled}>
            <PrimaryTextMedium style={{ textAlign: 'center' }}>{activeVariant.label === 'New Arrivals' ? 'Coming Soon' : 'Stok Habis'}</PrimaryTextMedium>
          </View>
        )
      }
      return null
    }
  }
}
