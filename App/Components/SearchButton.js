import React, { Component } from 'react'
import { View } from 'react-native'

// Components
import MiddleSearchBar from './MiddleSearchBar'
// import PopularSearch from './PopularSearch'

export default class SearchButton extends Component {
  render () {
    return (
      <View style={{ flexDirection: 'column', backgroundColor: '#ffffff', padding: 10 }}>
        <MiddleSearchBar navigation={this.props.navigation} />
        {/* <PopularSearch navigation={this.props.navigation} /> */}
      </View>
    )
  }
}
