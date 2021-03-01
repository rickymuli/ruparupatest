import React, { Component } from 'react'
import { View } from 'react-native'

//  Components
import FooterMenu from './FooterMenu'
import FooterContact from './FooterContact'

export default class PageFooter extends Component {
  render () {
    return (
      <View>
        <FooterMenu />
        <FooterContact />
      </View>
    )
  }
}
