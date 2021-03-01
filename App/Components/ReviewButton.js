import React, { Component } from 'react'
import {
  ButtonPrimaryOutlineM,
  ButtonPrimaryOutlineText
} from '../Styles/StyledComponents'
import { connect } from 'react-redux'

// Redux
import ReviewRatingActions from '../Redux/ReviewRatingRedux'
import ReviewHandlerActions from '../Redux/ReviewHandlerRedux'

class ReviewButton extends Component {
  checkProduct = () => {
    const { invoiceNumber, sku, productName, imageUrl } = this.props
    this.props.reviewProductByInvoiceRequest(invoiceNumber, sku)
    this.props.saveSelectedProduct({ invoiceNumber, sku, productName, imageUrl })
  }

  render () {
    return (
      <ButtonPrimaryOutlineM onPress={() => { this.checkProduct() }}>
        <ButtonPrimaryOutlineText>Review</ButtonPrimaryOutlineText>
      </ButtonPrimaryOutlineM>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  reviewProductByInvoiceRequest: (invoiceNo, sku) => dispatch(ReviewRatingActions.reviewProductByInvoiceRequest(invoiceNo, sku)),
  saveSelectedProduct: (data) => dispatch(ReviewHandlerActions.saveSelectedProduct(data))
})

export default connect(null, mapDispatchToProps)(ReviewButton)
