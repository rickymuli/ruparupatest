import React, { Component } from 'react'
import { Text, TouchableWithoutFeedback, ScrollView, Dimensions, Linking, ImageBackground } from 'react-native'
import config from '../../config.js'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import { NumberWithCommas } from '../Utils/Misc'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import { WithContext } from '../Context/CustomContext'
// import { trackWithProperties } from '../Services/MixPanel'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

// Redux
import CategoryDetailActions from '../Redux/CategoryDetailRedux'

// Components
import ItemCard from './ItemCard'

// Styles
import styled from 'styled-components'
import styles from './Styles/AppStyles'

const { width } = Dimensions.get('screen')
class InspirationComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      categoryDetail: null,
      inspirationData: props.inspirationData,
      fetching: false,
      isfetched: false
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!isEqual(nextProps.categoryDetail, prevState.categoryDetail)) {
      return {
        categoryDetail: nextProps.categoryDetail
      }
    } else {
      return null
    }
  }

  componentDidUpdate () {
    const { categoryDetail, inspirationData, fetching } = this.state
    if (!isEmpty(categoryDetail) && fetching) {
      let itemDetail = {
        data: {
          url_key: inspirationData.url_key,
          category_id: categoryDetail.category_id
        },
        search: ''
      }
      let regex = /(\w.*).html$/
      let tagging = inspirationData.url_key.split('/')[1].match(regex)
      let itmData = {
        itm_source: `inspiration-homepage-${tagging[1]}`,
        itm_campaign: tagging[1],
        promo: inspirationData.url_key
      }
      this.setState({ categoryDetail: null, fetching: false }, () => {
        // trackWithProperties('Data inspiration', itemDetail.data)
        this.props.navigation.navigate('ProductCataloguePage', { itemDetail, itmData })
      })
    }
  }

  wishlistRequest = (message) => {
    this.props.toggleWishlist(message)
  }

  getCategoryId = (inspirationData) => {
    if (!isEmpty(this.props.companyCode) && this.props.companyCode !== 'ODI') {
      Linking.openURL(`https://m.ruparupa.com/${(this.props.companyCode === 'AHI') ? 'ace' : 'informa'}/${inspirationData.url_key}`)
    } else {
      this.setState({
        inspirationData,
        fetching: true
      }, () => {
        this.props.fetchCategoryDetail(inspirationData.url_key)
      })
    }
  }

  render () {
    const { inspirationData } = this.state
    if (inspirationData.status === '0') {
      return null
    } else {
      let additionalImageData = ''
      let imageHostUrl = (this.props.companyCode === 'AHI') ? config.imageAceURL : (this.props.companyCode === 'HCI') ? config.imageInformaURL : config.imageURL
      if (inspirationData.small_banner_mobile.includes('fl_lossy')) {
        additionalImageData = `f_auto,q_auto/w_375,h_200`
      } else {
        additionalImageData = 'f_auto,fl_lossy,q_auto/w_375,h_200'
      }
      let regex = /(\w.*).html$/
      let tagging = inspirationData.url_key.split('/')[1].match(regex)
      let itmData = {
        itm_source: `inspiration-homepage-${tagging[1]}`,
        itm_campaign: tagging[1]
      }
      return (
        <CardInspiration>
          <ShimmerPlaceHolder
            autoRun
            style={{ marginTop: 7, backgroundColor: 'black' }}
            width={width}
            height={(width / 400) * 200}
            visible={this.state.isfetched}
          >
            <TouchableWithoutFeedback onPress={() => this.getCategoryId(inspirationData)}>
              <ImageBackground onLoad={() => { this.setState({ isfetched: true }) }} source={{ uri: `${imageHostUrl}${additionalImageData}${inspirationData.small_banner_mobile}` }} style={styles.thumbnailStyle} imageStyle={{ width, height: ((width / 400) * 220) }} resizeMode='contain'>
                <Text style={styles.thumbnailTitleStyle}>{inspirationData.name}</Text>
              </ImageBackground>
            </TouchableWithoutFeedback>
          </ShimmerPlaceHolder>
          <ScrollView horizontal>
            {inspirationData.products.slice(0, 4).map((item, index) => (
              <ItemCard
                itmData={itmData}
                wishlistRequest={this.wishlistRequest.bind(this)}
                itemData={item}
                navigation={this.props.navigation}
                key={`Inspiration itemData${inspirationData.name}${inspirationData.small_banner_mobile}${index}`}
              />
            ))}
          </ScrollView>
          <ContainerInspiration>
            <ButtonSecondaryInverseM onPress={() => this.getCategoryId(inspirationData)}>
              <ButtonSecondaryInverseMText>Lihat Semua ({NumberWithCommas(Math.floor(inspirationData.total / 10) * 10)}+ items)</ButtonSecondaryInverseMText>
              <Icon name='arrow-right' size={24} color={'#008ccf'} />
            </ButtonSecondaryInverseM>
          </ContainerInspiration>
        </CardInspiration>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  categoryDetail: state.categoryDetail
})

const mapDispatchToProps = (dispatch) => ({
  fetchCategoryDetail: (urlKey) => dispatch(CategoryDetailActions.categoryDetailRequest(urlKey))
})

export default WithContext(connect(mapStateToProps, mapDispatchToProps)(InspirationComponent))

// const InspirationThumbnail = styled.ImageBackground`
//   borderWidth: 1;
//   width: ${width};
//   height: ${(width / 400) * 200};
// `

const ButtonSecondaryInverseM = styled.TouchableOpacity`
  justifyContent: space-between;
  flexDirection: row;
  background-color: white;
  ${''}
  padding: 10px;
  border-radius: 3px;
`
const ButtonSecondaryInverseMText = styled.Text`
  font-size: 16px;
  color: #008ccf;
  font-family:Quicksand-Bold;
`

const ContainerInspiration = styled.View`
  padding-top:5px;
  padding-left:10px;
  padding-right:10px;
`

const CardInspiration = styled.View`
  background-color: white;
  margin-bottom:20px;
`
