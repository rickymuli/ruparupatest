import React, { Component } from 'react'
import { View, Text, Dimensions, Image, FlatList, ScrollView, Platform } from 'react-native'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import orderBy from 'lodash/orderBy'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

// Components
import ItemCard from '../Components/ItemCard'
import LottieComponent from '../Components/LottieComponent'
import SnackbarComponent from '../Components/SnackbarComponent'
import HeaderSearchComponent from '../Components/HeaderSearchComponent'

// Redux
import UserActions from '../Redux/UserRedux'

// Styles
import styled from 'styled-components'
import { PrimaryTextBold, fonts } from '../Styles'

// Util
import ItemFilter from '../Utils/Misc/ItemFilter'

class WishlistPage extends Component {
  componentDidMount () {
    this.props.userGetAllWishlistRequest()
  }

  constructor (props) {
    super(props)
    this.state = {
      refresh: false,
      searchWishlist: ''

    }
  }

  wishlistButtonPressed = (message) => {
    this.refs.child.call(message)
  }

  refreshItems = () => {
    this.props.userGetAllWishlistRequest()
  }

  renderWishlist () {
    const { wishlist = {}, storeNewRetail } = this.props
    const { searchWishlist } = this.state
    let filteredWishlist = wishlist?.items || []
    if (searchWishlist !== '') {
      filteredWishlist = ItemFilter(wishlist.items, searchWishlist.toUpperCase(), 'name')
      filteredWishlist = orderBy(filteredWishlist, ['is_in_stock'], ['desc'])
    }
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          removeClippedSubviews={Platform.OS === 'android'}
          refreshing={this.state.refresh}
          onRefresh={() => this.refreshItems()}
          data={filteredWishlist}
          numColumns={2}
          renderItem={({ item, index }) => {
            return (
              <ItemCard storeNewRetail={storeNewRetail} itmData={{ itm_campaign: 'wishlist', itm_source: 'wishlist-page' }} wishlistButtonPressed={this.wishlistButtonPressed.bind(this)} fromProductList itemData={item} navigation={this.props.navigation} />
            )
          }}
          keyExtractor={(item, index) => `${index} ${item}`}
        />
      </View>
    )
  }

  render () {
    const { wishlist = {}, fetchingWishlist } = this.props
    const { searchWishlist } = this.state
    const { width } = Dimensions.get('screen')
    return (
      <View style={{ backgroundColor: 'white', flex: 1, marginBottom: 20 }}>
        <HeaderSearchComponent pageName={'Wishlist'} />
        <View style={{ justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', paddingHorizontal: 10 }}>
          <SearchWishlist onChangeText={(value) => this.setState({ searchWishlist: value })} value={searchWishlist} underlineColorAndroid='transparent' placeholderTextColor='#b2bec3' placeholder='Cari wishlist simpanan Anda..' />
          <IconInnerSearch>
            <Icon name='magnify' size={25} />
          </IconInnerSearch>
        </View>
        {
          fetchingWishlist
            ? <LottieComponent />
            : !isEmpty(wishlist?.items)
              ? this.renderWishlist()
              : <ScrollView>
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: 20 }}>
                  <Image source={require('../assets/images/no-wishlist.webp')} style={{ width: width * 0.5, height: 400 }} />
                  <PrimaryTextBold style={{ fontSize: 16, lineHeight: 16, marginTop: 20 }}>Jangan Sampai Ketinggalan</PrimaryTextBold>
                  <Text style={{ fontFamily: fonts.regular, fontSize: 16, textAlign: 'center' }}>Masukkan Wishlist Anda, Beli Kapan Saja</Text>
                </View>
              </ScrollView>
        }
        <SnackbarComponent ref='child' />
      </View>
    )
  }
}

const stateToProps = (state) => ({
  storeNewRetail: state.storeNewRetail,
  wishlist: state.user.wishlist,
  fetchingWishlist: state.user.fetchingWishlist
})

const dispatchToProps = (dispatch) => ({
  userGetAllWishlistRequest: () => dispatch(UserActions.userGetAllWishlistRequest())
})

export default connect(stateToProps, dispatchToProps)(WishlistPage)

const IconInnerSearch = styled.View`
 position: absolute;
 zIndex: 1;
 right: 20px;
`

const SearchWishlist = styled.TextInput`
borderWidth: 1;
 borderColor: #D4DCE6;
color: grey;
 borderRadius: 3;
 marginVertical: 8;
 paddingLeft: 20;
 paddingVertical: 5;
font-family:${fonts.regular};
 height: 40;
`
