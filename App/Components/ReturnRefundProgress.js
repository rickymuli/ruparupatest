import React, { Component } from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components'

export default class ReturnRefundProgress extends Component {
  render () {
    const { onProgress } = this.props
    let ProgressComponent = Negative
    if (onProgress) {
      ProgressComponent = Positive
    }
    return (
      <ProgressComponent />
    )
  }
}

const Positive = styled.View`
  width: ${Dimensions.get('screen').width * 0.18}px;
  height: 10px;
  background-color: #F26525;
  border-radius: 5px;
  margin-left: 5px;
`

const Negative = styled.View`
  width: ${Dimensions.get('screen').width * 0.18}px;
  height: 10px;
  background-color: #E0E6ED;
  border-radius: 5px;
  margin-left: 5px;
`
