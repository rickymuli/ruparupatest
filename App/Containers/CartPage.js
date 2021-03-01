import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import analytics from '@react-native-firebase/analytics'

// redux
import CartActions from '../Redux/CartRedux'
// import StoreNewRetailActions from '../Redux/StoreNewRetailRedux'

// Components
import { HeaderComponent, Update, WishlistCart, ItemCart, CheckoutButton, RecomendationNewretail, InitStoreNewRetail, ProductRecommendationCart } from '../Components'
import ProductLastSeenCartPage from '../Components/ProductLastSeenCartPage'

// Styles
// import styled from 'styled-components'

class CartPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refresh: false
    }
  }

  // componentDidMount () {
  //   this.props.getStoreNewRetail()
  // }

  componentDidMount () {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      if (this.props.cart.data) {
        const { items, subtotal } = this.props.cart.data
        if (items) {
        // Firebase Analytic view_cart
          const analyticDataItems = []
          items.forEach(item => {
            item.details.forEach(detail => {
              analyticDataItems.push({
                item_id: detail.sku,
                item_name: detail.name,
                item_brand: detail.brand,
                item_category: detail.category.name,
                price: detail.subtotal,
                quantity: detail.qty_ordered
              })
            })
          })
          let analyticData = {
            currency: 'IDR',
            items: analyticDataItems,
            value: subtotal
          }
          analytics().logEvent('view_cart', analyticData)
        }
      }
    })
  }

  componentWillUnmount () {
    this._unsubscribe()
  }

  refreshItems = () => {
    this.setState({ refresh: true }, () => {
      // this.props.getStoreNewRetail()
      this.props.cartRequest()
    })
  }

  render () {
    // if (this.props.cart.err === 'SERVER_ERROR') {
    //   return (<Maintenance navigation={this.props.navigation} />)
    // } else {
    const { storeNewRetail, route, navigation } = this.props
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <HeaderComponent back pageName={'Keranjang Belanja'} pageType={'cart-page'} navigation={this.props.navigation} />
        <InitStoreNewRetail checkOnly />
        {/* <StoreCart navigation={this.props.navigation} /> */}
        <ScrollView >
          <ItemCart navigation={navigation} route={route} />
          {(!storeNewRetail.data)
            ? <>
              <ProductRecommendationCart navigation={navigation} />
              <WishlistCart navigation={navigation} />
              <ProductLastSeenCartPage navigation={navigation} />
              </>
            : <RecomendationNewretail navigation={navigation} />
          }
          {/* <View style={{ flex:1, backgroundColor:'white', position:'absolute', bottom: 0, justifyContent:'center', alignItems:'center', width:'100%'}}>
            </View> */}
          {/* <SnackBar
              visible={(this.props.cart.err === 'NETWORK_ERROR' || this.props.cart.err === 'SERVER_ERROR') && !this.props.cart.fetching}
              textMessage={'Terjadi Kesalahan Koneksi'}
              actionHandler={
                () => {
                  this.refreshItems()
                }}
              actionText={'coba lagi'}
              backgroundColor={'rgba(0,0,0,0.5)'}
            /> */}
        </ScrollView>
        <CheckoutButton navigation={navigation} route={route} />
        <Update param={'cartMaintenance'} navigation={navigation} />
      </View>
    )
  }
}

const stateToProps = (state) => ({
  cart: state.cart,
  storeNewRetail: state.storeNewRetail
})

const mapDispatchToProps = (dispatch) => ({
  cartRequest: () => dispatch(CartActions.cartRequest())
  // getStoreNewRetail: () => dispatch(StoreNewRetailActions.getStoreNewRetail())
})

export default connect(stateToProps, mapDispatchToProps)(CartPage)
