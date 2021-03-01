import React, { Component } from 'react'
import CountDown from 'react-native-countdown-component'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)
export default class CountDownFlashSale extends Component {
  render () {
    const { event, fromPdp } = this.props
    let time = 0
    const startDate = dayjs(event.start_date)
    const endDate = dayjs(event.end_date)
    const dateTimeNow = dayjs()

    // Getting time in seconds for countdown
    if (dateTimeNow > startDate && dateTimeNow < endDate) {
      time = dayjs.duration(Math.floor(endDate - dateTimeNow)).asSeconds()
    } else {
      time = dayjs.duration(Math.floor(startDate - dateTimeNow)).asSeconds()
    }

    return (
      <CountDown
        until={time}
        size={fromPdp ? 16 : 18}
        timeToShow={['H', 'M', 'S']}
        digitStyle={{ backgroundColor: '#555761' }}
        digitTxtStyle={{ color: 'white' }}
        timeLabels={{ h: null, m: null, s: null }}
      />
    )
  }
}
