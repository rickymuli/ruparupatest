import React from 'react'
import get from 'lodash/get'
import FastImage from 'react-native-fast-image'
import config from '../../config'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Dimensions, View } from 'react-native'
import { Push } from '../Services/NavigationService'
const { width } = Dimensions.get('screen')

const ProductImageGrid = ({ itemData, gridCount = 4 }) => {
  const imageSize = width / gridCount
  let imageUrl = get(itemData, 'variants[0].images[0].image_url', '')

  let itmParameter = {
    itm_source: '',
    itm_campaign: '',
    itm_term: ''
  }
  const variants = get(itemData, 'variants[0]', {})
  const isStockEmpty = !!(itemData.is_in_stock === 0 && variants.label !== 'New Arrivals')

  return (
    <TouchableOpacity onPress={() => Push('ProductDetailPage', { itemData, itmParameter })} style={{ flex: 1 }}>
      <FastImage
        source={{
          uri: `${config.imageURL}w_100,h_100,f_auto,q_auto${imageUrl}`
        }}
        resizeMode={FastImage.resizeMode.contain}
        style={{ width: imageSize, height: imageSize, alignSelf: 'center', opacity: isStockEmpty ? 0.2 : 1 }}
      />
      {
        isStockEmpty
          ? <View style={{ aspectRatio: 1, height: imageSize, position: 'absolute', top: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
            <FastImage source={require('../assets/images/stock-habis.webp')} style={{ aspectRatio: 2.5 / 1, height: imageSize / 3 }} />
          </View>
          : null
      }
    </TouchableOpacity>
  )
}

export default ProductImageGrid
