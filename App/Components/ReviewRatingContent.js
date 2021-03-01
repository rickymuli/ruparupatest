import React, { Component } from 'react'
import { ScrollView, View, TouchableOpacity, Text, Dimensions } from 'react-native'
import { ContainerNoPadding } from '../Styles/StyledComponents'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'

// Redux
import ReviewRatingActions from '../Redux/ReviewRatingRedux'

// Components
import ProductReviewComponent from './ProductReviewComponent'
import ReviewHistoryComponent from './ReviewHistoryComponent'
import ServiceReviewComponent from './ServiceReviewComponent'

class ReviewRatingContent extends Component {
  constructor () {
    super()
    this.state = {
      selectedTab: 'Product'
    }
  }

  components = {
    'Product': ProductReviewComponent,
    'Service': ServiceReviewComponent,
    'History': ReviewHistoryComponent
  }

  componentDidMount () {
    this.props.fetchReviewRatingCountRequest()
  }

  render () {
    const tabs = [
      { title: 'Beri Review', component: 'Product' },
      { title: 'Review Pelayanan', component: 'Service' },
      { title: 'Sudah Direview', component: 'History' }
    ]
    const { reviewRating } = this.props
    const ReviewComponent = this.components[this.state.selectedTab]
    return (
      <ContainerNoPadding>
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabs.map((tabData, index) => (
              <TouchableOpacity key={`review rating tabs ${index}`} onPress={() => this.setState({ selectedTab: tabData.component })} style={{ padding: 15, paddingHorizontal: 10, width: Dimensions.get('screen').width * 0.4, borderBottomWidth: (tabData.component === this.state.selectedTab) ? 2 : 0, borderBottomColor: '#F26525', backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{
                  fontFamily: (tabData.component === this.state.selectedTab) ? 'Quicksand-Bold' : 'Quicksand-Regular',
                  color: (tabData.component === this.state.selectedTab) ? '#F26525' : '#757885',
                  textAlign: 'center'
                }}>{tabData.title}</Text>
                {(!isEmpty(reviewRating.countData))
                  ? (tabData.component === 'Product')
                    ? (reviewRating.countData.review_product_not_reviewed > 0) &&
                    <View style={{ backgroundColor: '#F26525', borderRadius: 50, width: 20, height: 20, marginLeft: 5, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 14, color: '#fff', textAlign: 'center' }}>{reviewRating.countData.review_product_not_reviewed}</Text>
                    </View>
                    : (tabData.component === 'Service')
                      ? (reviewRating.countData.review_service > 0) &&
                      <View style={{ backgroundColor: '#F26525', borderRadius: 50, width: 20, height: 20, marginLeft: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 14, color: '#fff', textAlign: 'center' }}>{reviewRating.countData.review_service}</Text>
                      </View>
                      : null
                  : null
                }
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <ReviewComponent />
      </ContainerNoPadding>
    )
  }
}

const mapStateToProps = (state) => ({
  reviewRating: state.reviewRating
})

const mapDispatchToProps = (dispatch) => ({
  fetchReviewRatingCountRequest: () => dispatch(ReviewRatingActions.fetchReviewRatingCountRequest())
})

export default connect(mapStateToProps, mapDispatchToProps)(ReviewRatingContent)
