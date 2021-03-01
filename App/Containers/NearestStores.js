import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Image, ScrollView, Dimensions, View, Text, TouchableWithoutFeedback, Linking } from 'react-native'
import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'
import map from 'lodash/map'
import styled from 'styled-components'
import StoreLocation from '../Components/StoreLocation'
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import TahuActions from '../Redux/TahuRedux'
import styles from '../Components/Styles/AppStyles'
import LottieComponent from '../Components/LottieComponent'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

const NearestStores = (props) => {
  const dispatch = useDispatch()
  const [promos, setPromos] = useState({})
  const { dataCmsBlock } = useSelector(state => state.tahu)

  const dimensions = Dimensions.get('window')
  const imageHeight = Math.round(dimensions.width / 2)
  const imageWidth = dimensions.width

  useEffect(() => {
    dispatch(TahuActions.tahuCmsBlockRequest('promos_now'))
  }, [])

  useEffect(() => {
    if (isEmpty(promos) && !isEmpty(dataCmsBlock) && includes(dataCmsBlock.identifier, 'promos_now')) {
      setPromos(dataCmsBlock.content)
    }
  }, [dataCmsBlock])

  const renderImage = (uri, width, height) => {
    return <Image style={{ width, height }} source={{ uri }} resizeMode='contain' />
  }

  const itemPressed = item => {
    let itemDetail = {
      data: {
        url_key: item.url_key
      },
      search: ''
    }
    if (item.dir === 'Browser') {
      Linking.openURL(item.target_link)
    } else {
      props.navigation.navigate(item.dir, {
        itemDetail
      })
    }
  }

  const grid2 = () => {
    return (
      <View style={[styles.flexRowWrap, { marginTop: 10 }]}>
        {(promos.length > 0)
          ? map(promos, (item, index) => (
            <TouchableWithoutFeedback onPress={() => itemPressed(item)} key={`cms pcp ${index}`}>
              <View style={styles.layoutCmsBlockContainer}>
                <ShimmerPlaceHolder
                  autoRun
                  style={styles.layoutImageFirst}
                  visible>
                  <Image source={{ uri: item.image }} style={styles.layoutImageFirst} />
                </ShimmerPlaceHolder>
                {!isEmpty(item.title) && <Text style={styles.cmsItemTitle}>{item.title}</Text>}
              </View>
            </TouchableWithoutFeedback>
          ))
          : <LottieComponent />
        }
      </View>
    )
  }

  return <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
    <HeaderSearchComponent pageName={'Toko Dekat Saya'} close navigation={props.navigation} />
    { renderImage('https://res.cloudinary.com/ruparupa-com/image/upload/v1587100789/2.1/toko-dekat-saya.png', imageWidth, imageHeight - 20) }
    <TitleText numberOfLines={1} style={{ marginTop: 20 }}>Temukan Store Terdekat</TitleText>
    <StoreLocation title='nearest-stores' />
    {promos.length > 0 &&
      <View>
        <TitleText numberOfLines={1} style={{ marginBottom: 10 }}>Penawaran Saat Ini</TitleText>
        {grid2()}
      </View>
    }
  </ScrollView>
}

export default NearestStores

const TitleText = styled.Text`
  color: #757886;
  font-family: Quicksand-Bold;
  font-size: 20;
  textAlign: center;
`
