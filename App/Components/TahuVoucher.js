import React, { Component } from 'react'
import { FlatList, ScrollView, View, Dimensions } from 'react-native'

import styled from 'styled-components'
import { ButtonSecondaryOutlineM, ButtonSecondaryOutlineText, Container } from '../Styles/StyledComponents'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import map from 'lodash/map'

import PromoProducts from '../Components/PromoProducts'
import ItemCard from './ItemCard'

export default class TahuVoucher extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedTab: 0,
      voucherData: get(props, 'data[0].vouchers', []),
      active: get(props, 'data[0].status', 0),
      products: get(props, 'data[0].products', []),
      showAll: false
    }
  }

  componentDidMount () {
    let selectedIndex = 0
    let active = -1
    let data = this.props.data[0].vouchers
    let products = this.props.data[0].products
    this.props.data.forEach((product, index) => {
      if (Number(product.status) === 10) {
        selectedIndex = index
        active = 10
        data = product.vouchers
        products = product.products
      }
    })
    if (selectedIndex !== 0) {
      this.setState({ selectedTab: selectedIndex, active, voucherData: data, products })
    }
  }

  renderBody () {
    const { voucherData, active, products } = this.state
    const { callSnackbar, navigation, toggleWishlist, noVoucher, orientation, hideShowMore } = this.props
    return (
      <View style={{ padding: (this.props.noVoucher) ? 0 : 10, backgroundColor: 'white' }}>
        {(!noVoucher)
          ? (!isEmpty(orientation) && orientation.toLowerCase() === 'swiper' && voucherData.length > 1)
            ? <FlatList
              ref='voucherFlatlist'
              horizontal
              data={voucherData}
              keyExtractor={(item, index) => `tahu product voucher ${index} ${products[index].name}`}
              renderItem={({ item, index }) => (
                <View style={{ paddingRight: 5 }}>
                  <PromoProducts
                    noVoucher={noVoucher}
                    active={active}
                    product={products[index]}
                    voucher={item}
                    navigation={navigation}
                    callSnackbar={callSnackbar}
                    toggleWishlist={toggleWishlist}
                  />
                </View>
              )}
            />
            : map(voucherData, (data, index) => (
              <PromoProducts
                noVoucher={noVoucher}
                active={active}
                product={products[index]}
                voucher={data}
                key={`promo products ${index}`}
                navigation={navigation}
                callSnackbar={callSnackbar}
                toggleWishlist={toggleWishlist}
              />
            ))
          : (!isEmpty(orientation) && orientation.toLowerCase() === 'swiper')
            ? <FlatList
              ref='productFlatlist'
              horizontal
              data={products}
              keyExtractor={(item, index) => `tahu product ${index} ${item.name}`}
              renderItem={({ item }) => {
                return (
                  <ItemCard
                    disabled={(Number(active) !== 10)}
                    itmData={{}}
                    itemData={item}
                    wishlistRequest={toggleWishlist}
                    navigation={this.props.navigation}
                  />
                )
              }}
            />
            : <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', backgroundColor: 'white', width: Dimensions.get('screen').width }}>
              {map(products, (productData, index) => {
                if (!this.state.showAll && !hideShowMore) {
                  if (index < 6) {
                    return (
                      <ItemCard
                        fromProductList
                        key={`tahu product ${index} ${productData.name}`}
                        itmData={{}}
                        disabled={(Number(active) !== 10)}
                        wishlistRequest={toggleWishlist}
                        itemData={productData}
                        navigation={this.props.navigation}
                      />
                    )
                  }
                } else {
                  return (
                    <ItemCard
                      fromProductList
                      key={`tahu product ${index}`}
                      itmData={{}}
                      disabled={(Number(active) !== 10)}
                      wishlistRequest={toggleWishlist}
                      itemData={productData}
                      navigation={this.props.navigation}
                    />
                  )
                }
              }
              )
              }
            </View>
        }
      </View>
    )
  }

  selectBody (val, key) {
    if (this.props.orientation.toLowerCase() === 'swiper') {
      if (!this.props.noVoucher) {
        this.refs.voucherFlatlist.scrollToIndex({ animated: false, index: 0, viewPosition: 0 })
      } else {
        this.refs.productFlatlist.scrollToIndex({ animated: false, index: 0, viewPosition: 0 })
      }
    }
    this.setState({ selectedTab: key, voucherData: val.vouchers, products: val.products, active: val.status })
  }

  getStatus (status) {
    let text = {
      '-1': 'Telah berakhir',
      '10': 'Sedang berjalan',
      '0': 'Akan Datang'
    }
    return text[status] || ''
  }

  renderTab = () => {
    const { data } = this.props
    const { selectedTab } = this.state
    if (data.length > 1) {
      return (
        <ProductTab>
          {(data.length <= 3)
            ? map(data, (val, key) =>
              <ButtonTab onPress={() => this.selectBody(val, key)} style={{ borderBottomWidth: selectedTab === key ? 2 : 0, width: Dimensions.get('screen').width / data.length }} key={key}>
                <TimeTabSelected >{`${val.start_time.substring(0, 5)}-${val.end_time.substring(0, 5)}`}</TimeTabSelected>
                <StatusTabSelected>{this.getStatus(val.status)}</StatusTabSelected>
              </ButtonTab>
            )
            : <ScrollView horizontal>
              {map(data, (val, key) =>
                <ButtonTabScroll onPress={() => this.selectBody(val, key)} style={{ borderBottomWidth: (selectedTab === key) ? 2 : 0 }} key={key}>
                  <TimeTabSelected >{`${val.start_time.substring(0, 5)}-${val.end_time.substring(0, 5)}`}</TimeTabSelected>
                  <StatusTabSelected>{this.getStatus(val.status)}</StatusTabSelected>
                </ButtonTabScroll>
              )}
            </ScrollView>
          }
        </ProductTab>
      )
    } else {
      return null
    }
  }

  render () {
    const { voucherData, products, showAll } = this.state
    const { hideShowMore } = this.props
    let productData = (this.props.noVoucher) ? products : voucherData
    return (
      <View>
        {this.renderTab()}
        {(this.props.noVoucher)
          ? !isEmpty(products) && this.renderBody()
          : !isEmpty(voucherData) && this.renderBody()
        }
        {!hideShowMore
          ? <View>
            {productData.length > 6
              ? <Container>
                <ButtonSecondaryOutlineM onPress={() => this.setState({ showAll: !showAll })}>
                  <ButtonSecondaryOutlineText>{(!showAll) ? `Lihat Semua` : `Tutup`}</ButtonSecondaryOutlineText>
                </ButtonSecondaryOutlineM>
              </Container>
              : null
            }
          </View>
          : null
        }
      </View>
    )
  }
}

const ProductTab = styled.View`
    flexDirection: row;
    justifyContent: space-around;
    alignItems: center;
    paddingTop: 10;
    backgroundColor: white;
`

const ButtonTab = styled.TouchableOpacity`
    padding-horizontal:12;
    flex-shrink:1;
    border-bottom-color: #F26525;
`

const ButtonTabScroll = styled.TouchableOpacity`
    padding-horizontal:12;
    flex-shrink:1;
    border-bottom-color: #F26525;
    width: ${Dimensions.get('screen').width * 0.3}
`

const TimeTabSelected = styled.Text`
    color: #F26525;
    text-align: center;
    font-family:Quicksand-Bold;
    font-size: 15;
`

const StatusTabSelected = styled.Text`
    color: #F26525;
    font-family:Quicksand-Regular;
    font-size: 12;
    text-align: center;
    padding-bottom:5;
`
