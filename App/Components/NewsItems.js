import React, { Component } from 'react'
import { View } from 'react-native'

// Components
import SystemMaintenanceNews from './SystemMaintenanceNews'
import OrderNews from './OrderNews'

export default class NewsItems extends Component {
  render () {
    const { val } = this.props
    return (
      <View>
        {(val.pageType === 'maintenance')
          ? <SystemMaintenanceNews description={val.description} />
          : <OrderNews newsData={val} navigation={this.props.navigation} />
        }
      </View>
    )
  }
}
