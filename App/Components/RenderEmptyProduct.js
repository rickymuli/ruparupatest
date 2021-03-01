import React, { Component } from 'react'
import { Text, View, FlatList, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import filter from 'lodash/filter'

// Component
import LottieComponent from './LottieComponent'
import ProductList from './ProductList'

// Redux
import ProductHandlerActions from '../Redux/ProductHandler'
import InspirationActions from '../Redux/InspirationRedux'

class RenderEmptyProduct extends Component {
  constructor () {
    super()
    this.state = {
      filter: {
        maxPrice: '',
        minPrice: '',
        brands: [],
        colors: [],
        canGosend: ''
      }
    }
  }

  static getDerivedStateFromProps (props, state) {
    const { productHandler } = props
    let returnObj = {}
    let filterObj = {
      maxPrice: productHandler.maxPrice,
      minPrice: productHandler.minPrice,
      brands: productHandler.brands,
      colors: productHandler.colors,
      canGosend: productHandler.canGoSend
    }
    if (!isEqual(state.filter, filterObj)) {
      returnObj = {
        filter: filterObj
      }
    }
    return returnObj
  }

  resetFilter = () => {
    this.props.productHandlerSetFilter([], '', '', [], [])
    this.props.resetFilterAndSort()
  }

  componentDidMount () {
    if (isEmpty(this.props.inspiration.data)) {
      this.props.inspirationServer('')
    }
  }

  render () {
    const { filter } = this.state
    const { inspiration, itmData } = this.props
    let randomIndexInspiration = 0
    if (!isEmpty(inspiration.data)) {
      randomIndexInspiration = Math.floor(Math.random() * inspiration.data.length)
    }
    let resetFilter = filter(filter, (v) => !isEmpty(v))
    itmData['itm_campaign'] = 'search-no-result'
    if (inspiration.fetching || isEmpty(inspiration.data) || isEmpty(inspiration.data[randomIndexInspiration])) {
      return <LottieComponent />
    } else {
      return (
        <FlatList
          data={[inspiration.data[randomIndexInspiration].products]}
          keyExtractor={(item, index) => `Product Empty ${index}`}
          renderItem={({ item }) => (
            <View>
              <View style={{ padding: 20, marginBottom: 15 }}>
                <LottieComponent notfound style={{ width: 120, height: 120 }} />
                <Text style={{ fontFamily: 'Quicksand-Bold', color: '#757886', fontSize: 20, paddingBottom: 15 }}>Kami tidak dapat menemukan apa yang Anda cari.</Text>
                <Text style={{ fontFamily: 'Quicksand-Regular', marginBottom: 25 }}>
                Berikut rekomendasi kami untuk produk yang mungkin Anda suka. Ubah filter atau ganti kata cari untuk menemukan produk yang Anda inginkan
                </Text>
                {!isEmpty(resetFilter) &&
                  <TouchableOpacity onPress={() => this.resetFilter()} style={{ paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#D4DCE6', borderRadius: 3 }}>
                    <Text style={{ fontFamily: 'Quicksand-Regular', textAlign: 'center', fontSize: 16 }}>Reset Filter</Text>
                  </TouchableOpacity>
                }
              </View>
              <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 22, textAlign: 'center', marginBottom: 15 }}>Lihat juga barang-barang ini</Text>
              <ProductList itmData={itmData} toggleWishlist={this.toggleWishlist} products={item} navigation={this.props.navigation} />
            </View>
          )}
        />
      )
    }
  }
}

const mapStateToProps = (state) => ({
  inspiration: state.inspiration,
  productHandler: state.productHandler
})

const mapDispatchToProps = (dispatch) => ({
  inspirationServer: (storeCode) => dispatch(InspirationActions.inspirationServer(storeCode)),
  productHandlerSetFilter: (colors, minPrice, maxPrice, brand, canGoSend) => dispatch(ProductHandlerActions.productHandlerSetFilter(colors, minPrice, maxPrice, brand, canGoSend))
})

export default connect(mapStateToProps, mapDispatchToProps)(RenderEmptyProduct)
