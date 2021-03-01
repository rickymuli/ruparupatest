import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import { WithContext } from '../Context/CustomContext'

// Redux Action
import ProductLastSeenActions from '../Redux/ProductLastSeenRedux'

// Components
import ProductList from '../Components/ProductList'

// Styles
import styles from '../Components/Styles/SearchScreenStyles'

class ProductLastSeen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      productLastSeen: null,
      productDetail: null,
      productDetailUpdate: false
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (isEmpty(prevState.productLastSeen) && !isEqual(nextProps.productLastSeen, prevState.productLastSeen)) {
      return {
        productLastSeen: nextProps.productLastSeen
      }
    }
    if (!isEqual(nextProps.productDetail, prevState.productDetail)) {
      return {
        productDetail: nextProps.productDetail,
        productDetailUpdate: true
      }
    }
    return null
  }

  componentDidMount () {
    const { productDetailUpdate } = this.state
    this.props.fetchProductLastSeen()
    if (productDetailUpdate && this.props.productDetail) {
      this.setState({ productDetailUpdate: false })
      this.props.updateProductLastSeen(this.props.productDetail)
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { productDetailUpdate } = this.state
    if (productDetailUpdate && this.props.productDetail) {
      this.setState({ productDetailUpdate: false })
      this.props.updateProductLastSeen(this.props.productDetail)
    }
  }

  render () {
    const { productLastSeen } = this.state
    const { FromIndexSearch } = this.props
    let itmData = { itm_campaign: 'ProductLastSeen' }
    if (!isEmpty(productLastSeen)) {
      if (FromIndexSearch) {
        itmData['itm_source'] = 'Search'
        return (
          <View>
            <Text style={styles.headerText}>Terakhir Dilihat </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <ProductList itmData={itmData} FromIndexSearch toggleWishlist={this.props.toggleWishlist} products={productLastSeen} navigation={this.props.navigation} />
            </View>
          </View>
        )
      } else {
        itmData['itm_source'] = 'product-detail-page'
        return (
          <View style={{ marginTop: 15, backgroundColor: '#F9FAFC' }}>
            <Text style={{ fontFamily: 'Quicksand-Bold', textAlign: 'center', fontSize: 18, color: '#757886', marginVertical: 15 }}>Produk yang Terakhir Anda Lihat</Text>
            <ProductList itmData={itmData} products={productLastSeen} navigation={this.props.navigation} />
          </View>
        )
      }
    } else {
      return null
    }
  }
}

const mapStateToProps = (state) => ({
  productLastSeen: state.productLastSeen.data
})

const dispatchToProps = (dispatch) => ({
  fetchProductLastSeen: () => dispatch(ProductLastSeenActions.productLastSeenRequest()),
  updateProductLastSeen: (item) => (dispatch(ProductLastSeenActions.productLastSeenUpdateRequest(item)))
})

export default WithContext(connect(mapStateToProps, dispatchToProps)(ProductLastSeen))
