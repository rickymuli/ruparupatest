import React, { useState, useEffect } from 'react'
import { View, Text, ActivityIndicator, FlatList } from 'react-native'
import has from 'lodash/has'
import get from 'lodash/get'
import { cartProductRecommendation } from '../Services/Emarsys'
import ItemCard from './ItemCard'
import AddToCartButton from './AddToCartButton'
import { useSelector } from 'react-redux'

const ProductRecommendationCart = (props) => {
  const { navigation } = props
  const [recommendations, setRecommendations] = useState(null)

  const { data } = useSelector(state => state.cart)
  let itmData = {
    itm_source: 'cart-page',
    itm_campaign: 'recommendation-cart'
  }

  useEffect(() => { fetchRecommendations() }, [])

  const fetchRecommendations = async () => {
    const items = has(data, 'items') ? data.items : []
    const result = await cartProductRecommendation(items)
    setRecommendations(result)
  }

  const objectHelper = (item) => {
    let linkUrl = item.linkUrl.split('/')
    return {
      name: item.title,
      url_key: linkUrl[linkUrl.length - 1],
      variants: [{
        images: [{
          image_url: item.imageUrl
        }],
        prices: [{
          price: item.msrp,
          special_price: (item.price === item.msrp) ? null : item.price
        }],
        sku: item.productId
      }],
      brand: {
        name: item.brand
      }
    }
  }

  return (
    <View style={{ paddingVertical: 10 }}>
      {!recommendations
        ? <ActivityIndicator color={'#F26525'} size={'large'} style={{ marginTop: 40 }} />
        : <>
          <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', padding: 10 }}>
            <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 16 }}>{'Produk yang Mungkin Anda Suka'}</Text>
          </View>
          <FlatList
            horizontal
            data={recommendations}
            renderItem={({ item, index }) => {
              const data = objectHelper(item)
              const activeVariant = get(data, 'variants[0]', {})
              return (
                <View key={index}>
                  <ItemCard itmData={{ itm_campaign: 'recommendation-cart', itm_source: 'cart-page' }} itemData={data} navigation={navigation} emarsysRecommendation fromCart emarsysData={item} />
                  <AddToCartButton itmData={itmData} page={'productrecommendationcart'} payload={data} activeVariant={activeVariant} quantity={1} navigation={navigation} />
                </View>
              )
            }}
            keyExtractor={(item, index) => `cartProductRecommendation ${index}`}
          />
        </>}
    </View>
  )
}

export default ProductRecommendationCart
