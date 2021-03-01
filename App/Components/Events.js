import React, { Component } from 'react'
import { View } from 'react-native'

// Components
import DailyDeals from './DailyDeals'
import FlashSale from './FlashSale'

export default class Events extends Component {
  toggleWishlist = (message) => {
    this.props.toggleWishlist(message)
  }

  render () {
    return (
      <View>
        <FlashSale toggleWishlist={this.toggleWishlist.bind(this)} navigation={this.props.navigation} />
        <DailyDeals toggleWishlist={this.toggleWishlist.bind(this)} navigation={this.props.navigation} />
      </View>
    )
  }
}
