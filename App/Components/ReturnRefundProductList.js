import React, { Component } from 'react'
import { Image, View } from 'react-native'
import { Header, Container, Row, ProductContainer, Bold, ButtonFilledSecondarySmall, FontSizeS, BR } from '../Styles/StyledComponents'
import config from '../../config'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { UpperCase } from '../Utils/Misc'
import isEmpty from 'lodash/isEmpty'

export default class ReturnRefundProductList extends Component {
  goToPdp = (urlKey) => {
    let itemData = {
      url_key: (urlKey.includes('.html')) ? urlKey : urlKey + '.html'
    }
    this.props.navigation.navigate('ProductDetailPage', { itemData })
  }

  render () {
    const { products } = this.props
    return (
      <Container>
        <Header style={{ textAlign: 'center', marginBottom: 10 }}>Produk yang dikembalikan</Header>
        <Row style={{ flexWrap: 'wrap' }}>
          {products.map((product, index) => (
            <ProductContainer key={`return product ${index}`}>
              <Image
                style={{ width: 100, height: 100, alignSelf: 'center' }}
                source={{ uri: `${config.imageURL}/w_100,h_100,q_auto/${product.image_url}` }}
              />
              <Bold style={{ fontSize: 16 }}>{UpperCase((product.name.length > 20) ? `${product.name.slice(0, 20).toLowerCase()}...` : product.name.toLowerCase())}</Bold>
              {!isEmpty(product.promo_items)
                ? <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                  <FontSizeS>Produk Promo </FontSizeS>
                  <Icon name='information' color='#F26525' />
                  <Bold style={{ fontSize: 14, color: '#F26525' }}>{`Buy ${(product.discount_item_qty === 0) ? 1 : product.discount_item_qty} Get ${(product.discount_step === 0) ? 1 : product.discount_step}`}</Bold>
                </View>
                : <BR />
              }
              <ButtonFilledSecondarySmall onPress={() => this.goToPdp(product.url_key)}>
                <Bold style={{ color: 'white' }}>Lihat Detil</Bold>
              </ButtonFilledSecondarySmall>
            </ProductContainer>
          ))}
        </Row>
      </Container>
    )
  }
}
