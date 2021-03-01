import React, { Component } from 'react'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import styled from 'styled-components'

// Redux
import ReviewRatingActions from '../Redux/ReviewRatingRedux'

// Components
import PdpReviewModal from './PdpReviewModal'
import ReviewBody from './ReviewBody'

class ReviewRating extends Component {
  constructor () {
    super()
    this.state = {
      sku: ''
    }
  }

  componentDidMount () {
    const { sku } = this.state
    this.props.fetchReviewRatingBySkuRequest(sku)
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {}
    if (state.sku !== props.sku) {
      returnObj = {
        ...returnObj,
        sku: props.sku
      }
    }
    return returnObj
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.sku !== this.state.sku && !isEmpty(this.state.sku)) {
      this.props.fetchReviewRatingBySkuRequest(this.state.sku)
    }
  }

  componentWillUnmount () {
    this.props.initReviewProduct()
  }

  render () {
    const { reviewRating } = this.props
    if (isEmpty(reviewRating.data)) {
      return null
    } else {
      return (
        <ReviewContainer>
          {(reviewRating.data.total > 0) &&
            <ReviewBody sku={this.props.sku} />
          }
          <PdpReviewModal activeVariant={this.props.activeVariant} name={this.props.name} />
        </ReviewContainer>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  reviewRating: state.reviewRating
})

const mapDispatchToProps = (dispatch) => ({
  fetchReviewRatingBySkuRequest: (sku) => dispatch(ReviewRatingActions.fetchReviewRatingBySkuRequest(sku)),
  initReviewProduct: () => dispatch(ReviewRatingActions.initReviewProduct())
})

export default connect(mapStateToProps, mapDispatchToProps)(ReviewRating)

const ReviewContainer = styled.View`
  padding: 10px;
  margin-vertical: 20px;
  background-color: #fff;
`
