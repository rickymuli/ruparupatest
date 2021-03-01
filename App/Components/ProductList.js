import React, { PureComponent } from 'react'
import { View } from 'react-native'
import isEmpty from 'lodash/isEmpty'

// Components
import ItemCard from './ItemCard'
import ItemLastSeen from './ItemLastSeen'

export default class ProductList extends PureComponent {
  wishlistRequest = (message) => {
    this.props.toggleWishlist(message)
  }

  ifFromIndexSearch (productDetail, index) {
    const { FromIndexSearch, itmData } = this.props
    if (FromIndexSearch) {
      if (index < 3) {
        itmData['itm_campaign'] = 'ProductLastSeen'
        return (
          <ItemLastSeen itmData={itmData} itemData={productDetail} key={`productCatalogue${index}${productDetail.url_key}`} />
        )
      } else {
        return null
      }
    } else {
      return (
        <ItemCard itmData={itmData} fromProductList validatepdp={this.props.validatepdp} itemData={productDetail} key={`productCatalogue${index}${productDetail.url_key}`} replaceNavigation />
      )
    }
  }

  render () {
    const { products } = this.props
    if (isEmpty(products)) {
      return null
    } else {
      return (
        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 5, marginTop: 3 }}>
          { products.map((productDetail, index) => (this.ifFromIndexSearch(productDetail, index)))}
        </View>
      )
    }
  }
}
