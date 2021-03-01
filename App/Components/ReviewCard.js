import React, { PureComponent } from 'react'
import styled from 'styled-components'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import dayjs from 'dayjs'

// components
import RatingStars from './RatingStars'
import ReviewImagesComponent from './ReviewImagesComponent'
import ReviewLikeButton from './ReviewLikeButton'

export default class ReviewCard extends PureComponent {
  renderReviewHeader = (data, date) => {
    return (
      <ReviewHeader>
        {(data.review_as === 'editor')
          ? <EditorReviewContainer>
            <Icon name='emoticon-happy' size={12} />
            <EditorReviewText>Editor Review</EditorReviewText>
          </EditorReviewContainer>
          : <ReviewCustomerName>{data.customer_name}</ReviewCustomerName>
        }
        <ReviewDate>{dayjs(date).format('DD MMMM')}</ReviewDate>
      </ReviewHeader>
    )
  }

  render () {
    const { data } = this.props
    return (
      <ReviewCardContainer>
        <RatingStars rating={data.rating} />
        {this.renderReviewHeader(data, data.posted_at)}
        <TextDescription>{data.description}</TextDescription>
        <ReviewImagesComponent images={data.review_images} />
        <ReviewLikeButton data={data} />
      </ReviewCardContainer>
    )
  }
}

const ReviewCardContainer = styled.View`
  padding-vertical: 5px;
  border-bottom-width: 1px;
  border-bottom-color: #E0E6ED;
  margin-bottom: 5px
`

const ReviewHeader = styled.View`
  flex-direction: row;
  margin-bottom: 5px;
  justify-content: space-between;
`

const ReviewCustomerName = styled.Text`
  font-family: Quicksand-Bold;
  font-size: 14;
`

const EditorReviewContainer = styled.View`
  padding: 5px;
  padding-horizontal: 10px
  flex-direction: row;
  justify-content: space-around;
  background-color: #F3E21D;
  border-radius: 4;
`

const EditorReviewText = styled.Text`
  font-family: Quicksand-Regular;
  font-size: 12px;
  margin-left: 10px;
`

const ReviewDate = styled.Text`
  font-family: Quicksand-Bold;
  font-size: 14;
  color: #D4DCE6;
`

const TextDescription = styled.Text`
  font-family: Quicksand-Regular;
  font-size: 14px;
  margin-bottom: 5px;
`
