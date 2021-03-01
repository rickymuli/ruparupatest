import React, { useState, useEffect } from 'react'
import { View, Text, TouchableWithoutFeedback, Image, Dimensions } from 'react-native'
import { homepageCategoryRecommendation } from '../Services/Emarsys'
import analytics from '@react-native-firebase/analytics'

import map from 'lodash/map'
import chunk from 'lodash/chunk'
import isEmpty from 'lodash/isEmpty'
import split from 'lodash/split'
import last from 'lodash/last'
import get from 'lodash/get'
import forEach from 'lodash/forEach'

const ExploreByCategoryRecommendation = ({ navigation }) => {
  const [categories, setCategories] = useState([])
  const { width } = Dimensions.get('window')

  useEffect(() => {
    getRecommendation()
  }, [])

  const getRecommendation = async () => {
    const categoryRecommendation = await homepageCategoryRecommendation()
    let odiCategories = forEach(categoryRecommendation, (item) => { return (item?.customFields?.available_odi ?? false) ? item : null }) // eslint-disable-line
    setCategories(odiCategories)
  }

  const _handleAnalytic = (data) => {
    analytics().logSelectContent({ content_type: 'explore-by-category-recommendation', item_id: !data.customFields.c_category_url ? '' : data.customFields.c_category_url })
  }

  const goToPcp = (item) => {
    _handleAnalytic(item)
    const itemDetail = {
      data: { url_key: item.customFields.c_category_url,
        boostEmarsys: get(categories[0], 'productId', '') },
      search: ''
    }
    navigation.navigate('ProductCataloguePage', {
      itemDetail
    })
  }

  if (isEmpty(categories)) return null
  return (
    <View style={{ backgroundColor: 'white', marginVertical: 15 }}>
      <Image source={{ uri: 'https://cdn.ruparupa.io/promotion/ruparupa/Mobile-apps/kategori-yang-mungkin-anda-suka.webp' }} style={{ height: 50, width, resizeMode: 'contain' }} />
      <View style={{ marginTop: 5 }}>
        {map(chunk(categories, Math.round(categories.length / 3)), (items, index) => {
          return (
            <View key={`grid2 ${index}`} style={{ flexDirection: 'row', marginTop: 2 }}>
              {map(items, (item, i) => {
                let title = last(split(item.categoryPath, '>'))
                return <TouchableWithoutFeedback key={`${i}`} onPress={() => goToPcp(item)}>
                  <View style={{ width: (width / 3), justifyContent: 'center', padding: 5 }}>
                    <Image source={{ uri: item.imageUrl }} style={{ flex: 1, marginBottom: 5, height: (width / 3), resizeMode: 'contain' }} />
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ fontFamily: 'Quicksand-Medium', color: '#757886', textAlign: 'center', flex: 1, flexWrap: 'wrap', fontSize: 12 }}>{title}</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              })}
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default ExploreByCategoryRecommendation
