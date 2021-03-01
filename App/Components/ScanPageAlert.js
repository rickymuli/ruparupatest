import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class ScanPageAlert extends Component {
  componentWillUnmount () {
    this.props.closeModal()
  }

  render () {
    const { error } = this.props
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
        <View>
          <Icon name='alert' size={60} color='#F3251D' style={{ alignSelf: 'center' }} />
          <Text style={{ color: '#F3251D', fontFamily: 'Quicksand-Bold', textAlign: 'center', fontSize: 14 }}>{error}</Text>
        </View>
        <TouchableOpacity onPress={() => this.props.closeModal()} style={{ backgroundColor: '#F26525', borderRadius: 4, padding: 10, marginTop: 20, marginHorizontal: 10 }}>
          <Text style={{ fontFamily: 'Quicksand-Regular', color: '#ffffff', textAlign: 'center' }}>Ok</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
