import React, { Component } from 'react'
import { View, Text, FlatList, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import take from 'lodash/take'
import size from 'lodash/size'
import get from 'lodash/get'

// Components
import ItemCard from '../Components/ItemCard'
import AddToCartButton from '../Components/AddToCartButton'

// Redux
import UserActions from '../Redux/UserRedux'

class WishlistCart extends Component {
  componentDidMount () {
    const { wishlist, userGetAllWishlistRequest } = this.props
    !wishlist && userGetAllWishlistRequest()
  }

  render () {
    const { wishlist, fetchingWishlist, navigation } = this.props
    if (!wishlist && !fetchingWishlist) return null
    let data = take(wishlist, 6)
    let totalWishlist = size(wishlist)
    let itmData = {
      itm_source: 'cart-page',
      itm_campaign: 'wishlist-cart'
    }
    return (
      <View style={{ paddingVertical: 10 }}>
        {!wishlist
          ? <ActivityIndicator color={'#F26525'} size={'large'} style={{ marginTop: 40 }} />
          : <>
            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', padding: 10 }}>
              <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 16 }}>{'Wujudkan Wishlist kamu!'}</Text>
              {totalWishlist > 6 &&
                <TouchableWithoutFeedback onPress={() => navigation.navigate('Homepage', { screen: 'Wishlist' })}>
                  <Text style={{ fontFamily: 'Quicksand-Medium', fontSize: 12, textDecorationLine: 'underline', color: '#F26525' }}>Lihat semua {size(wishlist)} ></Text>
                </TouchableWithoutFeedback>
              }
            </View>
            <FlatList
              horizontal
              style={{ paddingLeft: 10 }}
              data={data}
              renderItem={({ item }) => {
                let activeVariant = get(item, 'variants[0]', {})
                return (
                  <View>
                    <View style={{ flex: 1 }}>
                      <ItemCard itmData={{ itm_campaign: 'wishlist-cart', itm_source: 'cart-page' }} itemData={item} navigation={this.props.navigation} />
                    </View>
                    <AddToCartButton itmData={itmData} page={'wishlistcart'} payload={item} activeVariant={activeVariant} quantity={1} navigation={this.props.navigation} />
                  </View>
                )
              }}
              ListFooterComponent={<View style={{ width: 15 }} />}
              keyExtractor={(item, index) => `${index} ${item}`}
            />
          </>
        }
      </View>
    )
  }
}

const stateToProps = (state) => ({
  wishlist: get(state.user.wishlist, 'items'),
  fetchingWishlist: state.user.fetchingWishlist
})

const dispatchToProps = (dispatch) => ({
  userGetAllWishlistRequest: () => dispatch(UserActions.userGetAllWishlistRequest())
})

export default connect(stateToProps, dispatchToProps)(WishlistCart)
