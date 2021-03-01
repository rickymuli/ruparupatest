import React, { Component } from 'react'
import { View, Text } from 'react-native'
import SwipeableViews from 'react-swipeable-views-native'

// Component
import BrandsColumn from './BrandColumn'
import Loading from './LoadingComponent'

import styles from './Styles/BrandsStyles'

/**
 * NOTES:
 * Change brand JSON key from banner to brands
 */

export default class Brands extends Component {
  constructor (props) {
    super(props)
    this.state = {
      brands: props.brands
    }
  }

  componentWillReceiveProps (newProps) {
    this.setState({ brands: newProps.brands })
  }

  render () {
    if (this.state.brands.fetching || this.state.brands.brand === null) {
      return (
        <Loading />
      )
    } else if (!this.state.brands.fetching && this.state.brands.brand !== null) {
      return (
        <View style={styles.mainView}>
          <View style={styles.headerView}>
            <Text style={styles.header}>Temukan Brand Favorite Lainnya</Text>
          </View>
          <SwipeableViews style={styles.swipableViewStyle}>
            {this.state.brands.brand.map((brandData, index) => (
              <BrandsColumn brandData={brandData} key={`brands${index}${brandData.banner_image}`} />
            ))}
          </SwipeableViews>
        </View>
      )
    }
  }
}
