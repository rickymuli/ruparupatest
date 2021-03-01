import React, { Component } from 'react'
import { View, ActivityIndicator } from 'react-native'
import isEmpty from 'lodash/isEmpty'

export default class LoadingComponent extends Component {
  render () {
    const { size, color, style = {} } = this.props
    let colorLoading = '#F26525'
    if (!isEmpty(color)) {
      colorLoading = color
    }
    return (
      <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, style]}>
        {(this.props.fromCartDelete || size === 'small')
          ? <ActivityIndicator size='small' color={colorLoading} />
          : <ActivityIndicator size='large' color={colorLoading} />
        }
      </View>
    )
  }
}
