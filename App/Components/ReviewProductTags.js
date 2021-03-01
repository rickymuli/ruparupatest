import React, { Component } from 'react'
import { View } from 'react-native'
import { Container, FontSizeS, Bold, CapsuleContainer, Row, CapsuleContainerSelectedPrimary } from '../Styles/StyledComponents'
import { connect } from 'react-redux'

// Components
import Loading from './LottieComponent'

// Redux
import ReviewRatingActions from '../Redux/ReviewRatingRedux'

class ReviewProductTags extends Component {
  constructor () {
    super()
    this.state = {
      type: 1
    }
  }
  componentDidMount () {
    let type = (this.props.rating < 3) ? 1 : (this.props.rating > 3) ? 2 : null
    if (type !== null) {
      this.props.fetchReviewTagsRequest(type)
      this.setState({ type })
    }
  }

  static getDerivedStateFromProps (props, state) {
    return {
      type: (props.rating < 3) ? 1 : 2
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.rating !== prevProps.rating) {
      if (prevState.type !== this.state.type) {
        this.props.fetchReviewTagsRequest(this.state.type)
      }
    }
  }

  render () {
    const { rating, reviewRating, tags } = this.props
    if (rating !== 3) {
      return (
        <Container>
          <FontSizeS><Bold>{(rating < 3) ? 'Apa keluhan Anda?' : 'Apa saja yang baik?'}</Bold></FontSizeS>
          {(reviewRating.fetchTags)
            ? <Loading />
            : (reviewRating.tags && rating !== 3) &&
            <Row style={{ flexWrap: 'wrap' }}>
              {reviewRating.tags.map((tagData, index) => {
                const CapsuleComponent = (tags.includes(tagData)) ? CapsuleContainerSelectedPrimary : CapsuleContainer
                return (
                  <View style={{ marginRight: 10, marginTop: 10 }}>
                    <CapsuleComponent onPress={() => this.props.onChangeTags(tagData)} key={`review tags ${index}`}>
                      <FontSizeS style={{ color: (tags.includes(tagData)) && '#FFFFFF' }}><Bold style={[(tags.includes(tagData)) && { color: '#FFFFFF' }]}>{tagData.tag_description}</Bold></FontSizeS>
                    </CapsuleComponent>
                  </View>
                )
              })}
            </Row>
          }
        </Container>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = (state) => ({
  reviewRating: state.reviewRating
})

const mapDispatchToProps = (dispatch) => ({
  fetchReviewTagsRequest: (reviewType) => dispatch(ReviewRatingActions.fetchReviewTagsRequest(reviewType))
})

export default connect(mapStateToProps, mapDispatchToProps)(ReviewProductTags)
