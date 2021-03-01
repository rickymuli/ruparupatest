import React, { Component } from 'react'
import { View } from 'react-native'

// Components
import ItemCard from './ItemCard'

import styles from './Styles/DailyDealsStyles'

export default class ScrollProducts extends Component {
  render () {
    return (
      <View style={styles.contentView}>
        {this.props.groupedProducts.map((itemData, index) => (
          <ItemCard itemData={itemData} key={`dailyDealsItems${index}${itemData.url_key}`} />
        ))}
      </View>
    )
  }
}
