import React, { Component } from 'react'
import { View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import Tooltip from 'react-native-walkthrough-tooltip'

class TooltipWalkthrough extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tooltipVisible: false,
      xPos: 0,
      yPos: 0
    }
  }

  visible (tooltipVisible = true) {
    this.setState({ tooltipVisible })
  }

  onLayout = (event) => {
    const layout = event.nativeEvent.layout
    if (layout) {
      if (layout.x !== this.state.xPos || layout.y !== this.state.yPos) {
        this.setState({ xPos: layout.x, yPos: layout.y })
      }
    }
  }

  getAndSetTooltipVisible (setStateTo) {
    if (setStateTo) {
      this.setState(setStateTo)
    }
    return this.state.tooltipVisible
  }

  getXPos () {
    return this.state.xPos
  }

  getYPos () {
    return this.state.yPos
  }

  startTooltip = async (storageKey) => {
    try {
      const value = await AsyncStorage.getItem(storageKey)
      if (value === null) {
        // this.props.goToComponent()
        this.visible()
      }
    } catch (e) {
      // error reading value
    }
  }
  storeData = async (storageKey) => {
    try {
      await AsyncStorage.setItem(storageKey, storageKey)
    } catch (e) {
      // saving error
    }
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key')
      if (value !== null) {
        // value previously stored
      }
    } catch (e) {
      // error reading value
    }
  }

  closeTooltip () {
    const { nextAction, done } = this.props
    try {
      this.setState({ tooltipVisible: false }, () => {
        if (nextAction) {
          nextAction()
        } else if (done) {
          this.storeData(done)
        }
      })
    } catch (error) {
      if (nextAction) {
        nextAction()
      }
    }
  }

  render () {
    const { position = 'top' } = this.props
    return (
      <View onLayout={this.onLayout}>
        <Tooltip
          ref={ref => { this.tooltip = ref }}
          isVisible={this.state.tooltipVisible}
          content={this.props.content}
          placement={position}
          onClose={() => this.closeTooltip()}>
          {this.props.children}
        </Tooltip>
      </View>
    )
  }
}
export default TooltipWalkthrough
