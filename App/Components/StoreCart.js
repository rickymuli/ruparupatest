import React, { Component } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { connect } from 'react-redux'

import { ItemCart } from '../Components'

import Fontisto from 'react-native-vector-icons/Fontisto'

export class StoreCart extends Component {
  render () {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', padding: 6, marginVertical: 8, alignItems: 'center' }}>
            <Fontisto name='shopping-store' size={20} />
            <Text style={{ fontFamily: 'Quicksand-Medium', fontSize: 18 }} numberOfLines={2}> (Jambi - Informa) Jambi Town Square </Text>
          </View>
          <ItemCart navigation={this.props.navigation} />
          <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#ee6e73', position: 'absolute', bottom: 10, right: 10 }} />
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(StoreCart)
