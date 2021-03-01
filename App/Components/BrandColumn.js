import React, { Component } from 'react'
import { View, Image } from 'react-native'

import styles from './Styles/BrandsStyles'

export default class BrandColumn extends Component {
  render () {
    return (
      <View style={styles.contentView}>
        {this.props.brandData.map((brand, index) => (
          <View style={styles.viewItems} key={`brand${brand}${index}`}>
            <Image source={{ uri: brand.banner_image }} style={styles.brandImage} />
          </View>
        ))}
      </View>
    )
  }
}
