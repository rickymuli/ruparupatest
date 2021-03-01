import React, { Component } from 'react'
import { View } from 'react-native'

// Component
import FlashSale from './FlashSale'
import DailyDeals from './DailyDeals'

// Components by type
const Components = {
  flashsale: FlashSale,
  dailydeals: DailyDeals
}
class TahuEvent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      EventComponent: Components[props.type]
    }
  }

  render () {
    const { EventComponent } = this.state
    return (
      <View>
        <EventComponent
          toggleWishlist={this.props.toggleWishlist}
          navigation={this.props.navigation}
        />
      </View>
    )
  }
}

export default TahuEvent
