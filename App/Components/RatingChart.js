import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { RowItem, RatingText, HeaderReviewSmall, Row, ReviewContainer } from '../Styles/StyledComponents'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import RatingStars from './RatingStars'

class RatingChart extends Component {
  renderRating = (rating) => {

  }
  render () {
    const { reviewRating } = this.props
    return (
      <ReviewContainer>
        <Row>
          <HeaderReviewSmall>Customer Rating</HeaderReviewSmall>
          <RatingText marginLeft={5}>{reviewRating.data.product_rating.average_rating} / 5</RatingText>
        </Row>
        <Row>
          <RatingStars rating={reviewRating.data.product_rating.average_star} total={`(${reviewRating.data.product_rating.total})`} />
        </Row>
        {Object.keys(reviewRating.data.product_rating.rating).map((key, index) => (
          <RowItem key={`rating chart ${index}`}>
            <NumberContainer>
              <RatingText textAlign='center'>{5 - Number(index)}</RatingText>
            </NumberContainer>
            <NumberContainer>
              <Icon name={'star'} size={20} color='#F3E21D' />
            </NumberContainer>
            <RatingContainerEmpty>
              <RatingContainerFilled total={(reviewRating.data.product_rating.total > 0) ? reviewRating.data.product_rating.total : 1} rate={reviewRating.data.product_rating.rating[key]} />
            </RatingContainerEmpty>
            <NumberContainer>
              <RatingText textAlign='center'>{reviewRating.data.product_rating.rating[key]}</RatingText>
            </NumberContainer>
          </RowItem>
        ))}
      </ReviewContainer>
    )
  }
}

const mapStateToProps = (state) => ({
  reviewRating: state.reviewRating
})

export default connect(mapStateToProps)(RatingChart)

const RatingContainerEmpty = styled.View`
  width: 80%;
  background-color: #D4DCE6;
  height: 20px;
  z-index:1;
  border-radius: 30;
`

const RatingContainerFilled = styled.View`
  width: ${props => (props.rate * 100 / props.total)}%;
  background-color: #008CCF;
  height: 20px;
  border-radius: 30;
`

const NumberContainer = styled.View`
  flex: 1;
`
