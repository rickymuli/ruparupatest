import React, { useEffect, useState } from 'react'
import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Carousel from 'react-native-snap-carousel'
import Emarsys from 'react-native-emarsys-wrapper'

import chunk from 'lodash/chunk'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import forEach from 'lodash/forEach'

import ItemCard from './ItemCard'

const ProductRecommendation = (props) => {
  const { activeVariant, itmData } = props
  const [supplierCode, setSupplierCode] = useState('')
  const [productRecommendation, setProductRecommendation] = useState([])
  const [carousel, setCarousel] = useState(null)
  const [carouselIndex, setCarouselIndex] = useState(0)

  useEffect(() => {
    getSupplierCode()
    getEmarsysProductRecommendation()
  }, [])

  const getSupplierCode = () => {
    let availabilityZone = ''

    if (activeVariant.supplier && activeVariant.supplier.supplier_code === 'R120') {
      availabilityZone = 'TGI'
    } else if (activeVariant.company_code) {
      if (activeVariant.company_code.AHI === 10) {
        availabilityZone = 'AHI'
      } else if (activeVariant.company_code.HCI === 10) {
        availabilityZone = 'HCI'
      }
    }
    setSupplierCode(availabilityZone)
    // return availabilityZone
  }

  const getEmarsysProductRecommendation = async () => {
    try {
      let result = await Emarsys.predict.recommendProductsLimit('RELATED', 16) // logic, limit
      result = forEach(result, item => {
        if (item.customFields.c_company_id === supplierCode) return item
      })
      result = chunk(result, 4)
      setProductRecommendation(result)
    } catch (e) {
      console.log(e)
    }
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

  const renderSetsOf4 = (data) => {
    return (
      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
        {map(data, (item, index) => {
          const itemData = objectHelper(item)
          return <ItemCard itemData={itemData} emarsysData={item} emarsysRecommendation fromProductList noWishlist key={`productRecommendationRow ${index}`} itmData={{ ...itmData, 'itm_campaign': 'pdp-product-recommendation' }} replaceNavigation />
        })}
      </View>
    )
  }

  if (isEmpty(productRecommendation)) return null
  return (
    <View style={{ marginTop: 15, backgroundColor: '#F9FAFC' }}>
      <Text style={{ fontFamily: 'Quicksand-Bold', textAlign: 'center', fontSize: 18, color: '#757886', marginVertical: 15 }}>Produk yang Mungkin Anda Suka</Text>
      <Carousel
        ref={(c) => { setCarousel(c) }}
        data={productRecommendation}
        sliderWidth={Dimensions.get('screen').width}
        itemWidth={Dimensions.get('screen').width}
        activeSlideAlignment={'start'}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        renderItem={({ item }) => {
          return renderSetsOf4(item)
        }}
        onSnapToItem={i => setCarouselIndex(i)}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: Dimensions.get('screen').width, position: 'absolute', top: '50%', paddingHorizontal: 10 }}>
        <TouchableOpacity onPress={() => carousel.snapToPrev()}
          style={{ backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
          <Icon name='chevron-left' size={40} color='#757886' style={{ opacity: (carouselIndex === 0) ? 0.4 : 1 }} />
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }} onPress={() => carousel.snapToNext()}>
          <Icon name='chevron-right' size={40} color='#757886' style={{ opacity: (carouselIndex === (productRecommendation.length - 1)) ? 0.4 : 1 }} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ProductRecommendation
