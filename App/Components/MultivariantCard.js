import React, { Component } from 'react'
import { View } from 'react-native'
import isEmpty from 'lodash/isEmpty'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      multivariants: null,
      color: null
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!isEqual(nextProps.multivariants, prevState.multivariants)) {
      return {
        multivariants: nextProps.multivariants
      }
    }
    return null
  }

  componentDidUpdate () {
    const { color, multivariants } = this.state
    if (isEmpty(color) && !isEmpty(multivariants)) {
      let color = multivariants.attributes.possible_combinations.color[0]
      this.setState({ color: multivariants.attributes.extra_information[`color~${color}`] })
    }
  }

  render () {
    const { color } = this.state
    return (
      <View style={{ backgroundColor: color, borderRadius: 2, borderWidth: 1, borderColor: '#ddd', width: 20, height: 20 }} />
    )
  }
}
