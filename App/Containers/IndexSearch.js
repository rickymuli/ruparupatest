import React, { Component } from 'react'
import { View } from 'react-native'

// Components
import SearchComponent from '../Components/SearchComponent'

export default class IndexSearch extends Component {
  render () {
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }} >
        <SearchComponent fromIndex navigation={this.props.navigation} />
      </View>
    )
  }
}
