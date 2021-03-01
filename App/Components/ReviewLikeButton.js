import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {
  ButtonSecondaryOutlineTextSmall,
  ButtonSecondaryOutlineSmall,
  RowItem,
  ButtonFilledSecondarySmall,
  ButtonFilledTextSmall,
  Row } from '../Styles/StyledComponents'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'

// Redux
import ReviewRatingActions from '../Redux/ReviewRatingRedux'

// Context
import { WithContext } from '../Context/CustomContext'

class ReviewLikeButton extends Component {
  constructor () {
    super()
    this.state = {
      reviewProductId: null
    }
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {}
    if (props.data.review_product_id !== state.reviewProductId) {
      returnObj = {
        ...returnObj,
        reviewProductId: props.data.review_product_id
      }
    }
    return returnObj
  }

  likeReview = () => {
    const { user, data } = this.props
    const { reviewProductId } = this.state
    if (isEmpty(user.user)) {
      this.props.navigation.navigate('LoginRegisterPage')
    } else if (!this.props.reviewRating.fetchingLike) {
      let dataLike = {
        review_product_id: reviewProductId,
        action: (data.is_customer_liked) ? 'unlike' : 'like'
        // action: 'like'
      }
      this.props.likeReviewRequest(dataLike)
    }
  }

  render () {
    const { data } = this.props
    let ButtonComponent = ButtonSecondaryOutlineSmall
    let ButtonTextComponent = ButtonSecondaryOutlineTextSmall
    if (data.is_customer_liked) {
      ButtonComponent = ButtonFilledSecondarySmall
      ButtonTextComponent = ButtonFilledTextSmall
    }
    return (
      <Row>
        <ButtonComponent onPress={() => this.likeReview()}>
          <RowItem>
            {(data.is_customer_liked)
              ? <Icon style={{ marginRight: 5, alignSelf: 'center' }} name='thumb-down-outline' color='#FFFFFF' />
              : <Icon style={{ marginRight: 5, alignSelf: 'center' }} name='thumb-up-outline' color='#008CCF' />
            }
            <ButtonTextComponent>Membantu ({data.like_count})</ButtonTextComponent>
          </RowItem>
        </ButtonComponent>
      </Row>
    )
  }
}

const mapStateToProps = (state) => ({
  reviewRating: state.reviewRating,
  user: state.user
})

const mapDispatchToProps = (dispatch) => ({
  likeReviewRequest: (data) => dispatch(ReviewRatingActions.likeReviewRequest(data))
})

export default WithContext(connect(mapStateToProps, mapDispatchToProps)(ReviewLikeButton))
