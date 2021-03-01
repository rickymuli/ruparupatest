import React, { Component } from 'react'
import { View, Clipboard, Dimensions, TouchableOpacity, Image } from 'react-native'
import styled from 'styled-components'
import config from '../../config'
import { UpperCase, NumberWithCommas } from '../Utils/Misc'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

// Components
import ButtonWishlist from './ButtonWishlist'

// Placeholder
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

const { width } = Dimensions.get('screen')
export default class PromoProducts extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isfetched: false,
      imageIsFetched: false
    }
  }

  renderVoucherBar = (voucher) => {
    let usedVoucher = voucher.limit_used - voucher.remaining
    if (usedVoucher < voucher.manipulate_value) {
      usedVoucher = voucher.manipulate_value
    }
    let width = Math.round((usedVoucher / voucher.limit_used) * 100)
    let color = '#f0f2f7'
    if (width < 50) {
      color = '#049372'
    } else if (width < 80) {
      color = '#F3E21D'
    } else if (width <= 100) {
      color = '#F3251D'
    }
    return (
      <VoucherBarContainer>
        <View style={{ width: `${width}%`, backgroundColor: color, height: 7, borderRadius: 50 }} />
      </VoucherBarContainer>
    )
  }

  copyCode (voucherCode) {
    Clipboard.setString(voucherCode)
    this.props.callSnackbar('Berhasil menyalin voucher')
  }

  renderVoucherButton = (voucher) => {
    const { isfetched } = this.state
    return (
      <View style={{ paddingVertical: 5 }}>
        {(voucher.remaining > 0)
          ? <VoucherContainer>
            <ShimmerPlaceHolder
              autoRun
              width={20}
              height={9}
              visible={isfetched}
            >
              <VoucherText>
                {voucher.voucher_code}
              </VoucherText>
            </ShimmerPlaceHolder>
            <ShimmerPlaceHolder
              autoRun
              width={20}
              height={9}
              visible={isfetched}
            >
              <TouchableOpacity onPress={() => this.copyCode(voucher.voucher_code)}>
                <ButtonCopy style={{ paddingHorizontal: 20, paddingVertical: 3 }}>
                  <ButtonText>Salin</ButtonText>
                </ButtonCopy>
              </TouchableOpacity>
            </ShimmerPlaceHolder>
          </VoucherContainer>
          : <OutOfVouchers>VOUCHER DISCOUNT HABIS</OutOfVouchers>
        }
      </View>
    )
  }

  goToPDP = () => {
    const { product, navigation } = this.props
    let itmData = this.props?.route?.params?.itmData ?? {}
    let itmParameter = {
      itm_source: itmData.itm_source,
      itm_campaign: itmData.promo,
      itm_term: get(product, 'product.variants[0].sku')
    }
    navigation.navigate('ProductDetailPage', {
      itemData: {
        url_key: product.url_key
      },
      itmParameter
    })
  }

  renderOnGoing () {
    const { product, voucher } = this.props
    let data = get(product, 'variants[0]', {})
    let price = data.prices[0].price
    let specialPrice = data.prices[0].special_price
    let discount = Math.round(((price - specialPrice) / price) * 100)
    return (
      <>
        <ShimmerPlaceHolder
          autoRun
          width={100}
          height={9}
          visible={this.state.isfetched}
        >
          {(specialPrice > 0)
            ? <PriceContainer onLoad={() => { this.setState({ isfetched: true }) }}>
              <PriceProduct>
                <Priceold>Rp { NumberWithCommas(price) }</Priceold>
                <Price>Rp { NumberWithCommas(specialPrice) }</Price>
              </PriceProduct>
              <DiscountContainer>
                <TextDiscount>Hemat {discount}%</TextDiscount>
                <TextDescPrice>setelah voucher</TextDescPrice>
              </DiscountContainer>
            </PriceContainer>
            : <PriceContainer onLoad={() => { this.setState({ isfetched: true }) }}>
              <PriceProduct>
                <Price>Rp { NumberWithCommas(price) }</Price>
              </PriceProduct>
            </PriceContainer>
          }
        </ShimmerPlaceHolder>
        {!this.props.noVoucher
          ? <>
            {this.renderVoucherBar(voucher)}
            {this.renderVoucherButton(voucher)}
        </>
          : null
        }
      </>
    )
  }

  render () {
    const { product, voucher, active, toggleWishlist, navigation } = this.props
    const { isfetched } = this.state
    let data = null
    if (!isEmpty(product)) {
      data = get(product, 'variants[0]', {})
    }
    if (data === null) {
      return null
    } else {
      return (
        <ProductContainer>
          {(active === -1 || voucher.remaining <= 0 || voucher.limit_used - voucher.manipulate_value === 0) &&
            <Image source={require('../assets/images/promo/overlay-voucher-habis.webp')}
              style={{ height: width * 0.34, width: '100%', position: 'absolute', alignSelf: 'center', zIndex: 1 }}
            />
          }
          <ShimmerPlaceHolder
            autoRun
            width={width * 0.3}
            height={width * 0.3}
            visible={isfetched}
          >
            <ImageRightBorder onPress={() => this.goToPDP()} disabled={active === -1 || voucher.remaining <= 0}>
              <Image
                source={{ uri: `${config.imageURL}w_170,h_170,f_auto${data.images[0].image_url}` }}
                style={{ height: width * 0.3, width: width * 0.3 }}
                onLoad={() => { this.setState({ isfetched: true }) }}
              />
              <Wishlist>
                <ButtonWishlist wishlistButtonPressed={toggleWishlist} navigation={navigation} sku={data.sku} name={product.name} />
              </Wishlist>
            </ImageRightBorder>
          </ShimmerPlaceHolder>
          <Center>
            <ItemDescriptionContainer>
              <ShimmerPlaceHolder
                autoRun
                width={120}
                height={9}
                visible={isfetched}
              >
                <ProductName onLoad={() => { this.setState({ isfetched: true }) }}>
                  {UpperCase(product.name.toLowerCase())}
                </ProductName>
              </ShimmerPlaceHolder>
              {(active === 10) && this.renderOnGoing()}
            </ItemDescriptionContainer>
          </Center>
        </ProductContainer>
      )
    }
  }
}

const ProductContainer = styled.View`
  flex-direction: row;
  border-width: 1;
  border-color: #E5E9F2;
  border-radius: 4;
  margin-bottom: 10px;
`
const ImageRightBorder = styled.TouchableOpacity`
  border-right-width: 1;
  border-color: #E5E9F2;
  padding-vertical: 10px;
`
const ItemDescriptionContainer = styled.View`
  padding-horizontal: 10px;
  flex-direction: column;
  width: ${Dimensions.get('window').width * 0.63};
`
const Center = styled.View`
  justify-content: center;
  align-items: center;
`
const ProductName = styled.Text`
  font-size: 13;
  color: #757886;
  font-family: Quicksand-Medium;
  margin-bottom: 10px;
  flex-wrap: wrap;
`
const Price = styled.Text`
  font-size: 20;
  line-height: 20px;
  color: #757886;
  font-family:Quicksand-Bold;
`
const Priceold = styled.Text`
  color: #555761;
  opacity: 0.7;
  font-size:14;
  margin-bottom: 5px;
  font-family:Quicksand-Regular;
  text-decoration-line: line-through;
`
const PriceContainer = styled.View`
  flex-direction: row;
  margin-bottom: 5px;
  justify-content: space-between;
`
const PriceProduct = styled.View`
  flex-direction: column;
`
const DiscountContainer = styled.View`
  flex-direction: column;
  margin-left: 10px;
`
const TextDiscount = styled.Text`
  font-family: Quicksand-Bold;
  color: #F3251D;
  font-size: 12;
`
const TextDescPrice = styled.Text`
  font-family: Quicksand-Bold;
  font-size: 12;
  color: #555761;
  opacity: 0.7;
`
const VoucherBarContainer = styled.View`
  width: 100%;
  background-color: #f0f2f7;
  border-radius: 50;
  height: 7px;
`
const VoucherContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`
const VoucherText = styled.Text`
  font-family: Quicksand-Bold;
  color: #F26525;
  font-size: 16;
`
const ButtonCopy = styled.View`
  border-radius: 5;
  background-color: #F26525;
  justify-content: center;
  align-items: center;
`
const ButtonText = styled.Text`
  font-family: Quicksand-Regular;
  color: #FFFFFF;
  font-size: 14;  
`
const OutOfVouchers = styled.Text`
  font-family: Quicksand-Bold;
  color: #757886;
  font-size: 16;  
`
const Wishlist = styled.View`
  right: 0;
  position:absolute;
  z-index:1;
`
