import React, { Component } from 'react'
import { ContainerNoPadding } from '../Styles/StyledComponents'

// Components
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import ReviewRatingContent from '../Components/ReviewRatingContent'

// Context
import ContextProvider from '../Context/CustomContext'

export default class ReviewRatingPage extends Component {
  render () {
    return (
      <ContextProvider value={{
        navigation: this.props.navigation
      }}>
        <ContainerNoPadding>
          <HeaderSearchComponent back search='' cartIcon pageType={'category'} validatepdp={this.validatepdp} navigation={this.props.navigation} />
          <ReviewRatingContent />
        </ContainerNoPadding>
      </ContextProvider>
    )
  }
}
