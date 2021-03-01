import React, { Component } from 'react'
import { Text, View, Animated, TouchableOpacity, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
// import { Item } from 'native-base';

// const { width } = Dimensions.get('screen')
// let windowHeight = Dimensions.get('window').height

export default class SnackbarComponent extends Component {
  constructor (props) {
    super(props)
    this.animatedValue = new Animated.Value(0)
    this.actionHandler = null
    this.timeout = 0
    this.state = {
      message: '',
      actionName: '',
      visible: false
    }
  }

  callWithAction (message, actionName, type, pDuration, pCallback) {
    let duration, callback
    for (let a = 2; a < arguments.length; a++) {
      if (typeof arguments[a] === 'function') {
        callback = arguments[a]
      } else if (typeof arguments[a] === 'number') {
        duration = arguments[a]
      }
    }
    this.actionHandler = callback
    this.start(duration)
    this.setType(message, type, actionName)
  }

  call (message, type, duration, callback) {
    for (let a = 1; a < arguments.length; a++) {
      if (typeof arguments[a] === 'function') {
        callback = arguments[a]
      } else if (typeof arguments[a] === 'number') {
        duration = arguments[a]
      }
    }
    this.setType(message, type)
    this.start(duration, callback)
  }

  setType (message, type, actionName) {
    let color = '#555761'
    switch (type) {
      case 'error': color = '#D32F2F'; break
      case 'warning': color = '#FBC02D'; break
      case 'success': color = '#388E3C'; break
    }
    this.setState({ snackbarColor: color, message: message, actionName: actionName, visible: true })
  }

  start (duration, callback = null) {
    this.animatedValue = new Animated.Value(0)
    clearTimeout(this.timeout)
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 400
      }).start(this.close(duration, callback))
  }

  close (duration, callback) {
    let forever = duration === 0
    this.timeout = setTimeout(() => {
      if (!forever) {
        Animated.timing(
          this.animatedValue,
          {
            toValue: 0,
            duration: 300
          }).start(() => {
          this.setState({ visible: false })
          callback && callback()
          this.forceUpdate()
        })
      }
    }, duration || 4000)
  }

  forceClose () {
    this.setState({ visible: false })
    this.forceUpdate()
  }

  shouldComponentUpdate () {
    if (this.animatedValue._animation) {
      return true
    }
    return false
  }

  getIcon () {
    const { snackbarColor } = this.state
    let icon
    switch (snackbarColor) {
      case '#D32F2F': icon = 'alert-circle-outline'
    }
    return icon
  }

  callActionHandler () {
    if (this.actionHandler) {
      return this.actionHandler()
    }
    this.props.actionHandler()
  }

  render () {
    const { snackbarColor, actionName, visible } = this.state
    const { style } = this.props
    let animation = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -40]
    })
    if (visible) {
      let isError = snackbarColor !== '#555761'
      return (
        <View>
          <Animated.View style={[{ transform: [{ translateY: animation }], minHeight: 40, width: Dimensions.get('window').width, backgroundColor: snackbarColor, position: 'absolute', left: 0, bottom: -40, right: 0, justifyContent: 'center', flexDirection: 'row', elevation: 99, padding: 12 }, style]}>
            { isError &&
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name={this.getIcon()} color='white' size={20} style={{ textAlign: 'center', paddingLeft: 15 }} />
              </View>
            }
            <Text style={{ fontFamily: 'Quicksand-Regular', padding: 5, color: 'white', fontSize: 16, paddingHorizontal: 15 }}>
              { this.state.message }
            </Text>
            {actionName
              ? <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.callActionHandler()}>
                <View>
                  <Text style={{ fontFamily: 'Quicksand-Regular', padding: 5, color: isError ? 'white' : '#FF7F45', fontSize: 16, textDecorationLine: 'underline' }}>
                    { this.state.actionName }
                  </Text>
                </View>
              </TouchableOpacity>
              : null
            }
          </Animated.View>
        </View>
      )
    } else {
      return null
    }
  }
}
