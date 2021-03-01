import React, { PureComponent } from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { Navigate } from '../Services/NavigationService'
import config from '../../config.js'
import get from 'lodash/get'

// Styles
import styled from 'styled-components'

export default class ItemLastSeen extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isfetched: false
    }
  }

  goToPDP = () => {
    const { itemData, itmData } = this.props
    const sku = get(itemData, 'variants[0].sku', '')
    let itmParameter = { ...itmData, itm_term: sku }
    // trackWithProperties('Data ItemLastSeen', itemData)
    Navigate('ProductDetailPage', {
      itemData,
      itmParameter,
      images: get(itemData, 'variants[0].images', [])
    })
  }

  render () {
    const { itemData } = this.props
    const imageUrl = get(itemData, 'variants[0].images[0].image_url', '')
    return (
      <ProductContainerFixed>
        <TouchableOpacity onPress={() => this.goToPDP()}>
          <Image
            source={{ uri: `${config.imageURL}w_170,h_170,f_auto${imageUrl}` }}
            style={{ flex: 1, height: 80 }}
          />
        </TouchableOpacity>
      </ProductContainerFixed>
    )
  }
}
const ProductContainerFixed = styled.View`
  flex-direction:column;
  background-color: #ffffff;
  border-radius: 3px;
  margin-left:4;
  margin-right:4;
  width: 80;
`
