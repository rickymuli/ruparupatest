import React, { Component } from 'react'
import { View, Text, FlatList } from 'react-native'
import { connect } from 'react-redux'
import take from 'lodash/take'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

// Components
import ItemCard from '../Components/ItemCard'
import AddToCartButton from '../Components/AddToCartButton'
import LottieComponent from '../Components/LottieComponent'

// Redux
import ProductLastSeenActions from '../Redux/ProductLastSeenRedux'

class ProductLastSeenCartPage extends Component {
  renderItem = () => {
    const { productLastSeen } = this.props
    let data = take(productLastSeen, 6)
    let itmData = {
      itm_source: 'cart-page',
      itm_campaign: 'last-seen-cart'
    }
    return (
      <View>
        {!isEmpty(data) && (
          <View style={{ alignItems: 'flex-start', flexDirection: 'row', padding: 10 }}>
            <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 16 }}>{' Produk yang Terakhir Anda Lihat!'}</Text>
          </View>
        )}
        <FlatList
          horizontal
          style={{ paddingLeft: 10 }}
          data={data}
          renderItem={({ item }) => {
            const activeVariant = get(item, 'variants[0]', {})
            return (
              <View>
                <View style={{ flex: 1 }}>
                  <ItemCard itmData={{ itm_campaign: 'last-seen-cart', itm_source: 'cart-page' }} itemData={item} navigation={this.props.navigation} />
                </View>
                <AddToCartButton itmData={itmData} page={'productlastseencartpage'} payload={item} activeVariant={activeVariant} quantity={1} navigation={this.props.navigation} />
              </View>
            )
          }}
          ListFooterComponent={<View style={{ width: 15 }} />}
          keyExtractor={(item, index) => `${index} ${item}`}
        />
      </View>
    )
  }
  render () {
    const { fetching } = this.props
    if (fetching) {
      return (
        <LottieComponent />
      )
    } else {
      return (
        this.renderItem()
      )
    }
  }
}

const stateToProps = (state) => ({
  productLastSeen: state.productLastSeen.data,
  fetching: state.productDetail.fetching
})

const dispatchToProps = (dispatch) => ({
  fetchProductLastSeen: () => dispatch(ProductLastSeenActions.productLastSeenRequest()),
  updateProductLastSeen: (item) => (dispatch(ProductLastSeenActions.productLastSeenUpdateRequest(item)))
})

export default connect(stateToProps, dispatchToProps)(ProductLastSeenCartPage)
