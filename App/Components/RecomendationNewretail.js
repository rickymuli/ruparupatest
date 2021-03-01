import React, { Component } from 'react'
import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import take from 'lodash/take'
import size from 'lodash/size'
import get from 'lodash/get'

// Components
import ItemCard from '../Components/ItemCard'
import AddToCartButton from '../Components/AddToCartButton'
import WishlistCart from '../Components/WishlistCart'

// Redux
import ProductActions from '../Redux/ProductRedux'

class RecomendationNewretail extends Component {
  componentDidMount () {
    this.props.productRecomendationNewRetailRequest()
  }

  render () {
    const { productRecomendation, fetchingProductRecomendation, navigation } = this.props
    if (!productRecomendation && !fetchingProductRecomendation) return null
    let data = take(productRecomendation, 6)

    let totalProductRecomendation = 0
    if (productRecomendation) totalProductRecomendation = size(productRecomendation)
    return (
      <View style={{ paddingVertical: 10 }}>
        {fetchingProductRecomendation
          ? <ActivityIndicator color={'#F26525'} size={'large'} style={{ marginTop: 40 }} />
          : (productRecomendation && totalProductRecomendation > 0)
            ? <>
              <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', padding: 10 }}>
                <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 16 }}>{'Rekomendasi'}</Text>
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
                        <ItemCard itemData={item} navigation={navigation} />
                      </View>
                      <AddToCartButton page={'relatedproduct'} payload={item} activeVariant={activeVariant} quantity={1} navigation={navigation} />
                    </View>
                  )
                }}
                ListFooterComponent={<View style={{ width: 15 }} />}
                keyExtractor={(item, index) => `${index} ${item}`}
              />
            </>
            : <WishlistCart navigation={navigation} />
        }
      </View>
    )
  }
}

const stateToProps = (state) => ({
  productRecomendation: state.product.productRecomendation,
  fetchingProductRecomendation: state.product.fetchingProductRecomendation
})

const dispatchToProps = (dispatch) => ({
  productRecomendationNewRetailRequest: () => dispatch(ProductActions.productRecomendationNewRetailRequest())
})

export default connect(stateToProps, dispatchToProps)(RecomendationNewretail)
