import React, { Component } from 'react'
import { View, Image, Dimensions, FlatList, TouchableWithoutFeedback, Linking } from 'react-native'
import config from '../../config'
import styled from 'styled-components'
import { NumberWithCommas } from '../Utils/Misc'
import { WithContext } from '../Context/CustomContext'
import isEmpty from 'lodash/isEmpty'
import analytics from '@react-native-firebase/analytics'

// Components
import ItemCard from './ItemCard'

class StoreCategory extends Component {
  constructor () {
    super()
    this.state = {
      width: 640,
      height: 200
    }
  }

  componentDidMount () {
    let additionalImageData = ''
    let imageHostUrl = (this.props.companyCode === 'AHI') ? config.imageAceURL : (this.props.companyCode === 'HCI') ? config.imageInformaURL : config.imageURL
    this.props.data.promo_detail.map((data) => {
      if (data.small_banner_mobile.includes('fl_lossy')) {
        additionalImageData = `f_auto,q_auto/`
      } else {
        additionalImageData = 'f_auto,fl_lossy,q_auto/'
      }
      Image.getSize(`${imageHostUrl}${additionalImageData}${data.small_banner_mobile}`, (width, height) => {
        this.setState({ width, height })
      })
    })
  }

  handleAnalytic = (data) => {
    // Firebase Analytic view_promotion
    let analyticData = {
      items: [{
        location_id: data.url_key
      }],
      location_id: data.url_key
    }
    analytics().logEvent('view_promotion', analyticData)
  }

  goToPCP = (promoData) => {
    this.handleAnalytic(promoData)
    if (!isEmpty(this.props.companyCode) && this.props.companyCode !== 'ODI') {
      Linking.openURL(`https://m.ruparupa.com/${(this.props.companyCode === 'AHI') ? 'ace' : 'informa'}/${promoData.url_key}`)
    } else {
      let itemDetail = {
        data: {
          url_key: promoData.url_key,
          category_id: ''
        },
        search: ''
      }
      let itmData = {
        itm_source: 'PromoPage',
        itm_campaign: promoData.url_key
      }
      this.props.navigation.navigate('ProductCataloguePage', { itemDetail, itmData })
    }
  }

  renderImage = (promoData) => {
    const { width } = Dimensions.get('screen')
    let additionalImageData = ''
    let imageHostUrl = (this.props.companyCode === 'AHI') ? config.imageAceURL : (this.props.companyCode === 'HCI') ? config.imageInformaURL : config.imageURL
    if (promoData.small_banner_mobile.includes('fl_lossy')) {
      additionalImageData = `f_auto,q_auto/`
    } else {
      additionalImageData = 'f_auto,fl_lossy,q_auto/'
    }
    let imageSizeQuery = ''
    if (!promoData.small_banner_mobile.includes('w_') || !promoData.small_banner_mobile.includes('h_')) {
      imageSizeQuery = `w_${this.state.width}/h_${this.state.height}`
    }
    // Find a better solution to get the image size for showing the image
    return (
      <TouchableWithoutFeedback onPress={() => this.goToPCP(promoData)}>
        <Image source={{ uri: `${imageHostUrl}${additionalImageData}${imageSizeQuery}${promoData.small_banner_mobile}` }} style={{ width, height: (width / this.state.width) * this.state.height, alignSelf: 'center' }} />
      </TouchableWithoutFeedback>
    )
  }

  render () {
    const { data } = this.props
    return (
      <View>
        {data.promo_detail.map((promoData, index) => (
          <View style={{ marginTop: 10 }} key={`promo brand ${index}`}>
            {this.renderImage(promoData)}
            <View style={{ backgroundColor: 'white' }}>
              <FlatList
                data={promoData.products}
                horizontal
                renderItem={({ item }) => (
                  <ItemCard itmData={{ itm_source: 'PromoPage', itm_campaign: item.url_key }} wishlistRequest={this.props.toggleWishlist.bind(this)} itemData={item} navigation={this.props.navigation} />
                )}
                keyExtractor={(item, index) => `promo brand items${index}${item.url_key}`}
              />
              <ContainerInspiration>
                <ButtonSecondaryInverseM onPress={() => this.goToPCP(promoData)}>
                  <ButtonSecondaryInverseMText>Lihat Semua ({NumberWithCommas(Math.floor(promoData.total / 10) * 10)}+ items)</ButtonSecondaryInverseMText>
                </ButtonSecondaryInverseM>
              </ContainerInspiration>
            </View>
          </View>
        ))}
      </View>
    )
  }
}

export default WithContext(StoreCategory)

const ButtonSecondaryInverseM = styled.TouchableOpacity`
  background-color: white;
  border: 1px #008ccf solid;
  padding: 10px;
  border-radius: 3px;
`
const ButtonSecondaryInverseMText = styled.Text`
  font-size: 16px;
  color: #008ccf;
  text-align: center;
  font-family:Quicksand-Bold;
`

const ContainerInspiration = styled.View`
  padding-bottom: 10px;
  padding-left:10px;
  padding-right:10px;
`
