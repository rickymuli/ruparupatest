import React, { Component } from 'react'
import { TouchableOpacity, Linking, Image, Dimensions } from 'react-native'
import config from '../../config.js'

export default class CustomerServicePDP extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sku: props.sku
    }
  }

  render () {
    const { sku } = this.state
    let subject = `Pertanyaan mengenai produk SKU ${sku}`
    return (
      <TouchableOpacity onPress={() => Linking.openURL(`mailto:${config.defaultMailto}?subject=${subject}`)} style={{ alignItems: 'center', backgroundColor: '#E5F7FF' }}>
        <Image source={require('../assets/images/mobile-app-help-pdp.webp')} style={{ width: Dimensions.get('screen').width, height: (Dimensions.get('screen').width / 972) * 487 }} />
      </TouchableOpacity>
    )
  }
}
