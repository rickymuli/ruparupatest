import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'

import ProductList from '../Components/ProductList'

class RelatedProduct extends Component {
  render () {
    if (this.props.products) {
      return (
        <View style={{ backgroundColor: '#F9FAFC' }}>
          <Text style={{ fontFamily: 'Quicksand-Bold', textAlign: 'center', fontSize: 18, color: '#757886', marginVertical: 15 }}>Produk yang Anda Mungkin Suka</Text>
          <ProductList itmData={{ itm_campaign: 'RelatedProduct', itm_source: 'RelatedProduct' }} products={this.props.relatedProduct.products} navigation={this.props.navigation} />
        </View>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = (state) => ({
})

const dispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, dispatchToProps)(RelatedProduct)
