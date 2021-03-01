import React, { Component } from 'react'
import { View, FlatList, Platform, Text } from 'react-native'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'

// Redux
import ReviewRatingActions from '../Redux/ReviewRatingRedux'

// Components
import ReviewGroupContainer from './ReviewGroupContainer'
import Loading from './LottieComponent'

class ServiceReviewComponent extends Component {
  constructor () {
    super()
    this.state = {
      refresh: false,
      reviews: [],
      total: 0
    }
  }

  componentDidMount () {
    this.props.fetchServiceReviewRequest(0, 10, 0)
  }

  refreshItem = () => {
    this.props.fetchServiceReviewRequest(0, 10, 0)
    this.setState({ refresh: true, reviews: [] })
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {}
    if (!isEmpty(props.reviewRating.dataReviewPage)) {
      if (props.reviewRating.dataReviewPage.for === 'service') {
        if (props.reviewRating.dataReviewPage.total !== state.total) {
          returnObj = {
            ...returnObj,
            total: props.reviewRating.dataReviewPage.total
          }
        }
        if (state.reviews.length < props.reviewRating.dataReviewPage.total) {
          returnObj = {
            ...returnObj,
            reviews: [...state.reviews, ...props.reviewRating.dataReviewPage.reviews]
          }
          if (state.refresh) {
            returnObj = {
              ...returnObj,
              reviews: [...props.reviewRating.dataReviewPage.reviews],
              refresh: false
            }
          }
        }
      }
    }
    if (props.reviewRating.successInsert) {
      returnObj = {
        ...returnObj,
        reviews: []
      }
    }
    return returnObj
  }

  componentWillUnmount () {
    this.props.initReviewData()
  }

  renderMoreItems = () => {
    if (this.state.reviews.length < this.state.total) {
      this.props.fetchServiceReviewRequest(0, 10, this.state.reviews.length)
    }
  }

  render () {
    const { reviewRating } = this.props
    let removeClippedSubviews = Platform.OS === 'android' !== false
    return (
      <View style={{ flex: 1 }}>
        {((reviewRating.fetching && isEmpty(this.state.reviews)) || this.state.refresh)
          ? <Loading />
          : <FlatList
            onEndReached={() => this.renderMoreItems()}
            ListEmptyComponent={() => (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', fontSize: 14, fontFamily: 'Quicksand-Regular' }}>Review service kosong</Text>
              </View>
            )}
            initialNumToRender={6}
            maxToRenderPerBatch={10}
            onEndReachedThreshold={0.3}
            refreshing={this.state.refresh}
            onRefresh={() => this.refreshItem()}
            removeClippedSubviews={removeClippedSubviews}
            data={this.state.reviews}
            renderItem={({ item }) => (
              <ReviewGroupContainer
                forServiceReview
                hideReviewButton
                data={item}
              />
            )}
            keyExtractor={(item, index) => `review service ${index}`}
          />
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  reviewRating: state.reviewRating
})

const mapDispatchToProps = (dispatch) => ({
  fetchServiceReviewRequest: (reviewed, limit, offset) => dispatch(ReviewRatingActions.fetchServiceReviewRequest(reviewed, limit, offset)),
  initReviewData: () => dispatch(ReviewRatingActions.initReviewData())
})

export default connect(mapStateToProps, mapDispatchToProps)(ServiceReviewComponent)
