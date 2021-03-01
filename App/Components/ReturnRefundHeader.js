import React, { Component } from 'react'
import { Image, Dimensions } from 'react-native'
import { Container, Header, TextModal } from '../Styles/StyledComponents'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

export default class ReturnRefundHeader extends Component {
  constructor () {
    super()
    this.state = {
      isfetched: false
    }
  }
  render () {
    const { isfetched } = this.state
    const { orderNo, shipmentSummary } = this.props
    const win = Dimensions.get('screen')
    const ratio = (win.width) / 640
    return (
      <>
        <Container>
          <Header style={{ textAlign: 'center' }}>{orderNo}</Header>
          <TextModal>{shipmentSummary}</TextModal>
        </Container>
        <ShimmerPlaceHolder
          autoRun
          width={win.width}
          height={ratio * 320}
          visible={isfetched}
        >
          <Image
            source={{ uri: 'https://res.cloudinary.com/ruparupa-com/image/upload/w_640,h_320,f_auto,q_auto/v1585305935/2.1/refund-assets/asset-mobile-instruksi-refund.png' }}
            style={{ width: win.width, height: ratio * 320, alignSelf: 'center', marginTop: 10 }}
            onLoad={() => { this.setState({ isfetched: true }) }}
          />
        </ShimmerPlaceHolder>
      </>
    )
  }
}
