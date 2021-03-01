import React, { Component } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'

export default class SideHeader extends Component {
  checkState = (categoryDetail) => {
    this.props.parentReference(categoryDetail)
  }

  render () {
    return (
      <View style={{ flexDirection: 'column' }}>
        <ScrollView>
          {this.props.categoryTitle.payload.map((category, index) => (
            <View key={`sideHeaderCategory${category.name}${index}`}>
              <TouchableOpacity onPress={() => this.checkState(category)}>
                <Text style={{ fontFamily: 'Quicksand-Regular' }}>{category.name}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    )
  }
}
