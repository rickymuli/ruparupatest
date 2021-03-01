import React, { Component } from 'react'
import { Image, View } from 'react-native'
import config from '../../config.js'

export default class LogoNotFound extends Component {
  render () {
    return (
      <View>
        <Image source={{ uri: `${config.baseURL}static/images/noimage.webp` }} style={{ width: 20, height: 10 }} />
      </View>
    )
  }
}
