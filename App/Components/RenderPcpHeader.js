import React, { PureComponent } from 'react'
import { View } from 'react-native'
import isEmpty from 'lodash/isEmpty'

// Components
import CMSBlock from './CMSBlock'
import ProductCatalogueInformation from './ProductCatalogueInformation'

export default class RenderPcpHeader extends PureComponent {
  render () {
    const { urlKey, productInformation } = this.props
    return (
      <View style={{ justifyContent: 'center' }}>
        {(!isEmpty(urlKey)) &&
        <CMSBlock navigation={this.props.navigation} urlKey={urlKey} />
        }
        <View>
          <ProductCatalogueInformation productInfo={productInformation} />
        </View>
      </View>
    )
  }
}
