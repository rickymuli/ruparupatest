import React, { Component } from 'react'
import styled from 'styled-components'
import { Bold, FontSizeM, Container, ButtonPrimaryOutlineM, ButtonPrimaryOutlineText } from '../Styles/StyledComponents'
import { isEmpty } from 'lodash'

// Context
import { ContextConsumer } from '../Context/CustomContext'

// Components
import ReviewContainer from './ReviewContainer'

export default class ReviewGroupContainer extends Component {
  render () {
    const { data, forServiceReview } = this.props
    let productData = (forServiceReview) ? data.invoice_items : { ...data }
    return (
      <ContextConsumer>
        {(value) => (
          <GroupContainer>
            <Container>
              {(forServiceReview)
                ? (!isEmpty(data.dikirim_oleh) && data.dikirim_oleh.toLowerCase() === 'ruparupa')
                  ? <FontSizeM><Bold>rup</Bold><Bold style={{ color: '#F26525' }}>a</Bold><Bold>rup</Bold><Bold style={{ color: '#008CCF' }}>a</Bold><Bold> via {data.store_name}</Bold></FontSizeM>
                  : <FontSizeM><Bold>{data.dikirim_oleh}</Bold></FontSizeM>
                : null
              }
            </Container>
            {(forServiceReview)
              ? (!isEmpty(productData) && productData.map((productData, index) => (
                <ReviewContainer
                  showReviewImage={this.props.showReviewImage}
                  showTags={this.props.showTags}
                  showDescription={this.props.showDescription}
                  hideReviewButton={this.props.hideReviewButton}
                  showRating={this.props.showRating}
                  key={`review product ${index}`} data={productData} />
              )))
              : (!isEmpty(productData)) &&
              <ReviewContainer
                showReviewImage={this.props.showReviewImage}
                showTags={this.props.showTags}
                showDescription={this.props.showDescription}
                hideReviewButton={this.props.hideReviewButton}
                showRating={this.props.showRating}
                data={productData} />
            }
            {(forServiceReview) &&
            <Container>
              <ButtonPrimaryOutlineM onPress={() => value.navigation.navigate('ReviewDetailPage', { data: { ...data, type: 'service' } })}>
                <ButtonPrimaryOutlineText>Review</ButtonPrimaryOutlineText>
              </ButtonPrimaryOutlineM>
            </Container>
            }
          </GroupContainer>
        )}
      </ContextConsumer>
    )
  }
}

const GroupContainer = styled.View`
  background-color: #ffffff;
  padding: 10px;
  margin-bottom: 15px;
`
