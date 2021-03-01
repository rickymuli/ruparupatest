/* This is an Example of React Native Blinking Animation */
import React, { Component } from 'react'
// import react in our project
import { Text } from 'react-native'
// import all the components we needed
export default class CustomBlinkingTxt extends Component {
  constructor (props) {
    super(props)
    this.state = { showText: true }
  }

  componentDidMount () {
    // Change the state every second or the time given by User.
    this.interval = setInterval(() => {
      this.setState(previousState => {
        return { showText: !previousState.showText }
      })
    },
    // Define blinking time in milliseconds
    1000
    )
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  render () {
    let display = this.state.showText ? this.props.text : ' '
    return (
      <Text style={{ color: '#F26525', fontSize: 30 }}>{display}</Text>
    )
  }
}
