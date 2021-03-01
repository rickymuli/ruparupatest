import React, { Component, useEffect, useState } from 'react'
import { View, Text, Dimensions, Image, Modal, TouchableWithoutFeedback, FlatList } from 'react-native'
import styled from 'styled-components'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import analytics from '@react-native-firebase/analytics'

// Containers
import IndexCategoryModal from './IndexCategoryModal'
import useEzFetch from '../Hooks/useEzFetch'

const { width } = Dimensions.get('screen')

const IndexCategoryChildMenu = (props) => {
  const {get, fetching, data, error}= useEzFetch()
  const [state, setState] = useState({
    chosenCategory: undefined,
    openModal: false,
  })

  useEffect(() => {
    get('/category/tree/')
  }, [])

  const goToPCP = (data) => {
    let itemDetail = {
      data: {
        url_key: data.url_key,
        category_id: data.category_id
      },
      search: ''
    }
    let itmData = {
      itm_source: 'category',
      itm_campaign: data.url_key
    }
    props.navigation.navigate('ProductCataloguePage', {
      itemDetail, itmData
    })
  }

  const categoryFeedBack = (data) => {
    if (['new-arrivals.html', 'best-deals.html'].includes(data.url_key)) goToPCP(data)
    else {
      analytics().logSelectContent({ content_type: 'category', item_id: !data.url_key ? '' : data.url_key })
      setState({ ...state, chosenCategory: data, openModal: true })
    }
  }

  const _renderCategoryMenu = (data, index) => {
    let urlImage = getImage(data.url_key.slice(0, -5))
    return (
      <View key={index} style={{ overflow: 'hidden', padding: 1, margin: 3, width: width * 0.23 }}>
        <NavigationTouch onPress={() => categoryFeedBack(data)}>
          <IconView>
            <Image style={{ width: 42, height: 42, resizeMode: 'contain' }} source={urlImage} />
          </IconView>
          <Text textBreakStrategy={'simple'} style={{ fontSize: 11, fontFamily: 'Quicksand-Medium', flex: 1, textAlign: 'center' }}>{data.name}</Text>
        </NavigationTouch>
      </View>
    )
  }

  const getImage = (urlKey) => {
    let urlImage = ''
    switch (urlKey) {
      case 'rumah-tangga':
        urlImage = require('../assets/images/Kategori/rumah-tangga.webp')
        break
      case 'dapur-minimalis':
        urlImage = require('../assets/images/Kategori/dapur-minimalis.webp')
        break
      case 'furniture':
        urlImage = require('../assets/images/Kategori/furnitur.webp')
        break
      case 'bed-dan-bath':
        urlImage = require('../assets/images/Kategori/bed-and-bath.webp')
        break
      case 'rak-dan-penyimpanan':
        urlImage = require('../assets/images/Kategori/rak-dan-penyimpanan.webp')
        break
      case 'home-improvement':
        urlImage = require('../assets/images/Kategori/home-improvement.webp')
        break
      case 'otomotif':
        urlImage = require('../assets/images/Kategori/otomotif.webp')
        break
      case 'hobi-dan-gaya-hidup':
        urlImage = require('../assets/images/Kategori/hobi-dan-gayahidup.webp')
        break
      case 'elektronik-dan-gadget':
        urlImage = require('../assets/images/Kategori/elektronik-dan-gadget.webp')
        break
      case 'kesehatan-dan-olahraga':
        urlImage = require('../assets/images/Kategori/kesehatan-dan-olahraga.webp')
        break
      case 'mainan-dan-bayi':
        urlImage = require('../assets/images/Kategori/mainan-dan-bayi.webp')
        break
      case 'new-arrivals':
        urlImage = require('../assets/images/Kategori/new-arrivals.webp')
        break
      case 'best-deals':
        urlImage = require('../assets/images/Kategori/best-deals.webp')
        break
      default:
        urlImage = require('../assets/images/noimage.webp')
        break
    }
    return urlImage
  }

  const closeModal = () => {
    setState({ ...state, chosenCategory: undefined, openModal: false })
  }

  return (
    <View>
      <CategoryBackgroundView>
        <ShimmerPlaceHolder autoRun visible={data} style={{ padding: 3, margin: 3, width: width, height: 50, borderRadius: 10 }} />
        <ShimmerPlaceHolder autoRun visible={data} style={{ padding: 3, margin: 3, width: width, height: 50, borderRadius: 10 }} />
        <ShimmerPlaceHolder autoRun visible={data} style={{ padding: 3, margin: 3, width: width, height: 50, borderRadius: 10 }} />
        <FlatList
          data={data}
          renderItem={({ item, index }) => _renderCategoryMenu(item, index)}
          numColumns={4}
          keyExtractor={(item, index) => `${index}`}
          contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
        />
      </CategoryBackgroundView>
      <Modal
        animationType='fade'
        transparent
        visible={state.openModal}
        onRequestClose={() => {
          closeModal()
        }}>
        <View style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }}>
          <View style={{ height: Dimensions.get('window').height / 4 }}>
            <TouchableWithoutFeedback onPress={() => closeModal()}>
              <View style={{ height: Dimensions.get('window').height / 3 }} />
            </TouchableWithoutFeedback>
          </View>
          <View style={{ height: Dimensions.get('window').height * (2 / 3), backgroundColor: 'white', flex: 1 }}>
            <IndexCategoryModal
              navigation={props.navigation}
              category={state.chosenCategory}
              parentData={state.chosenCategory}
              closeModal={closeModal} />
          </View>
        </View>
      </Modal>
    </View>
  )
}

const CategoryBackgroundView = styled.View`
  border-radius: 5px;
  background-color: white;
  margin-bottom: 6px;
`
const NavigationTouch = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  background-color: #FFFFFF;
`

const IconView = styled.View`
  border-radius: 15;
  padding: 5px;
  border-color: #E5E9F2;
`


export default IndexCategoryChildMenu
