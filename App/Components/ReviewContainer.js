import React, { Component } from 'react'
import { View, Image, Dimensions, TouchableWithoutFeedback, ScrollView } from 'react-native'
import {
  DistributeSpaceBetween,
  ProductName,
  FontSizeS,
  Container,
  ButtonPrimaryOutlineM,
  ButtonPrimaryOutlineText,
  Row,
  FontSizeXS } from '../Styles/StyledComponents'
import { UpperCase } from '../Utils/Misc'
import { isEmpty } from 'lodash'
import dayjs from 'dayjs'

// Context
import { ContextConsumer } from '../Context/CustomContext'

// Components
import RatingStars from './RatingStars'
import ReviewRenderImage from './ReviewRenderImage'

export default class ReviewContainer extends Component {
  navigateToPdp = (contextValue) => {
    const { data } = this.props
    contextValue.navigation.navigate('ProductDetailPage', { itemData: data })
  }

  render () {
    const { data, hideReviewButton, showRating, showDescription, showReviewImage, showTags } = this.props
    return (
      <ContextConsumer>
        {(value => (
          <Container>
            <DistributeSpaceBetween>
              <Image style={{ width: 60, height: 60 }} source={{ uri: data.image_url }} />
              <View style={{ width: Dimensions.get('screen').width * 0.7 }}>
                <TouchableWithoutFeedback onPress={() => this.navigateToPdp(value)}>
                  <ProductName>{UpperCase(data.product_name.toLowerCase())}</ProductName>
                </TouchableWithoutFeedback>
                <FontSizeS>qty: {data.qty_ordered}</FontSizeS>
              </View>
            </DistributeSpaceBetween>
            {(showRating) &&
            <Row>
              <RatingStars rating={data.rating} total={dayjs(data.posted_at).format('D MMMM YYYY HH:mm')} />
            </Row>
            }
            {(showDescription) &&
              <Container>
                <FontSizeS>{data.description}</FontSizeS>
              </Container>
            }
            {(showTags) &&
            <Row style={{ flexWrap: 'wrap' }}>
              {(!isEmpty(data.review_tags)) && data.review_tags.map((tagData, index) => (
                <View key={`tags ${index}`} style={{ backgroundColor: '#E0E6ED', borderRadius: 30, padding: 7, justifyContent: 'center', margin: 3 }}>
                  <FontSizeXS>{tagData.tag_description}</FontSizeXS>
                </View>
              ))}
            </Row>
            }
            {(showReviewImage && !isEmpty(data.review_images)) &&
              <ScrollView horizontal>
                {data.review_images.map((imageData, index) => (
                  <ReviewRenderImage imageData={imageData} key={'preview image ' + index} />
                ))}
              </ScrollView>
            }
            {(!hideReviewButton) &&
            <ButtonPrimaryOutlineM onPress={() => value.navigation.navigate('ReviewDetailPage', { data: { ...data, type: 'product' } })}>
              <ButtonPrimaryOutlineText>Review</ButtonPrimaryOutlineText>
            </ButtonPrimaryOutlineM>
            }
          </Container>
        ))}
      </ContextConsumer>
    )
  }
}
