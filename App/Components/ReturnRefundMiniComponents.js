import React, { Component } from 'react'
import { ElevatedContainer } from '../Styles/StyledComponents'

// Import
import ProductReturnReason from './ProductReturnReason'
import UploadImageReturnRefund from './UploadImageReturnRefund'
import RefundTypeComponent from './RefundTypeComponent'
import SummaryReturnRefund from './SummaryReturnRefund'

export default class ReturnRefundMiniComponents extends Component {
  Components = {
    reasons: ProductReturnReason,
    uploadImage: UploadImageReturnRefund,
    refund: RefundTypeComponent,
    summary: SummaryReturnRefund
  }

  render () {
    const { progress, item, index } = this.props
    const listOfComponents = ['reasons', 'uploadImage', 'refund', 'summary']
    const Component = this.Components[listOfComponents[progress]]
    let loopComponent = []
    if (listOfComponents[progress] === 'uploadImage') {
      for (let i = 0; i < item.qty; i++) {
        loopComponent.push(
          <Component
            qtyIndex={i}
            index={index}
            item={item}
            navigation={this.props.navigation}
            key={`${i} upload image`}
          />
        )
      }
      return (
        <ElevatedContainer>
          {loopComponent}
        </ElevatedContainer>
      )
    } else {
      return (
        <ElevatedContainer>
          <Component
            index={index}
            item={item}
            navigation={this.props.navigation}
          />
        </ElevatedContainer>
      )
    }
  }
}
