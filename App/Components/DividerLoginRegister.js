import React, { Component } from 'react'
import { View } from 'react-native'
import { PrimaryText, dimensions } from '../Styles'
export default class DividerLoginRegister extends Component {
  render () {
    return (
      <View style={{ flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ borderWidth: 0.5, borderColor: '#E0E6ED', width: dimensions.width * 0.4 }} />
        <PrimaryText>atau</PrimaryText>
        <View style={{ borderWidth: 0.5, borderColor: '#E0E6ED', width: dimensions.width * 0.4 }} />
      </View>
    )
  }
}
