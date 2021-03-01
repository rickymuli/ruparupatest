import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { HeaderReviewSmall, HeaderReviewLarge } from '../Styles/StyledComponents'

// Components
import ReviewCard from './ReviewCard'

class ReviewBody extends Component {
  render () {
    const { reviewRating, fromModal } = this.props
    const HeaderReview = (!fromModal) ? HeaderReviewLarge : HeaderReviewSmall
    return (
      <View>
        <HeaderReview>Reviews</HeaderReview>
        {reviewRating.data.reviews.map((data, index) => {
          if (index < 3 || fromModal) {
            return (
              <ReviewCard data={data} key={`review card ${index}`} />
            )
          } else {
            return null
          }
        })}
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  reviewRating: state.reviewRating
})

export default connect(mapStateToProps)(ReviewBody)
