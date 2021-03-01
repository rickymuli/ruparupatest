import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'

// Components
import LogoNotFound from './LogoNotFound'
import { fonts, dimensions } from '../Styles'
export default class DeliveryLogo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      shipment: props.shipment
    }
  }

  componentWillReceiveProps (newProps) {
    const { shipment } = newProps
    this.setState({ shipment })
  }
  render () {
    const { shipment } = this.state
    let logo
    let altName
    switch (shipment.carrier.carrier_id) {
      case '1':
        logo = require('../assets/images/delivery-logo/sap.webp')
        altName = 'sap_express_logo'
        break
      case '3':
      case '11':
        logo = require('../assets/images/delivery-logo/own-fleet.webp')
        altName = 'own_fleet'
        break
      case '2':
      case '6':
        logo = require('../assets/images/delivery-logo/jne.webp')
        altName = 'JNE_logo'
        break
      case '5':
        logo = require('../assets/images/delivery-logo/ninja.webp')
        altName = 'ninjavan'
        break
      case '9':
        logo = require('../assets/images/delivery-logo/ncs.webp')
        altName = 'NCS'
        break
      case '10':
        logo = require('../assets/images/delivery-logo/mr-speedy.webp')
        altName = 'MrSpeedy'
        break
      case '7':
      case '8':
        logo = require('../assets/images/delivery-logo/gosend.webp')
        altName = 'gosend'
        break
      default:
        logo = require('../assets/images/noimage.webp')
        altName = 'not_found'
        break
    }

    if (shipment.track_number && !shipment.track_number.includes('ODI-') && !shipment.track_number.includes('BC-')) {
      return (
        <View>
          {(altName === 'not_found')
            ? <LogoNotFound />
            : <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.regular }}>No Resi </Text>
              <Image source={logo} style={{ width: dimensions.width * 0.2, height: ((dimensions.width * 0.2) / 600) * 300 }} />
              <Text style={{ fontFamily: fonts.regular }}> {shipment.track_number}</Text>
            </View>
          }
        </View>
      )
    } else {
      return null
    }
  }
}
