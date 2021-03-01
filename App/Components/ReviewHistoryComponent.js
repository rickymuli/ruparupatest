import React, { Component } from 'react'
import { View, FlatList, Text } from 'react-native'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'

// Redux
import ReviewRatingActions from '../Redux/ReviewRatingRedux'
import ReviewGroupContainer from './ReviewGroupContainer'
import Loading from './LottieComponent'

class ReviewHistoryComponent extends Component {
  constructor () {
    super()
    this.state = {
      refresh: false,
      total: 0,
      reviews: []
    }
  }

  componentDidMount () {
    this.props.fetchProductReviewRequest(1, 10, 0)
  }

  refreshItem = () => {
    this.props.fetchProductReviewRequest(1, 10, 0)
    this.setState({ refresh: true, reviews: [] })
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {}
    if (!isEmpty(props.reviewRating.dataReviewPage)) {
      if (props.reviewRating.dataReviewPage.for === 'history') {
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
      this.props.fetchProductReviewRequest(1, 10, this.state.reviews.length)
    }
  }

  render () {
    const { reviewRating } = this.props
    return (
      <View style={{ flex: 1 }}>
        {((reviewRating.fetching && isEmpty(this.state.reviews)) || this.state.refresh)
          ? <Loading />
          : <FlatList
            ListEmptyComponent={() => (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', fontSize: 14, fontFamily: 'Quicksand-Regular' }}>Anda belum ada produk yang selesai direview saat ini</Text>
              </View>
            )}
            onEndReached={() => this.renderMoreItems()}
            initialNumToRender={6}
            maxToRenderPerBatch={10}
            onEndReachedThreshold={0.3}
            refreshing={this.state.refresh}
            onRefresh={() => this.refreshItem()}
            data={this.state.reviews}
            renderItem={({ item }) => (
              <ReviewGroupContainer
                data={item}
                showReviewImage
                showTags
                hideReviewButton
                showRating
                showDescription />
            )}
            keyExtractor={(data, index) => `review history ${index}`}
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
  fetchProductReviewRequest: (reviewed, limit, offset) => dispatch(ReviewRatingActions.fetchProductReviewRequest(reviewed, limit, offset)),
  initReviewData: () => dispatch(ReviewRatingActions.initReviewData())
})

export default connect(mapStateToProps, mapDispatchToProps)(ReviewHistoryComponent)
