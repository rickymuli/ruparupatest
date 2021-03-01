import React, { Component } from 'react'
import { View, TouchableOpacity } from 'react-native'
import styled from 'styled-components'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'

import styles from './Styles/PDPStyles'
import { fonts } from '../Styles'

export default class BreadCrumb extends Component {
  renderBreadText = (breadCrumb, index) => {
    return (
      <TouchableOpacity onPress={() => this.goToPCP(breadCrumb)}>
        {(index === 0)
          ? <BreadcrumbFont>{breadCrumb.name}</BreadcrumbFont>
          : <BreadcrumbFont>/ {breadCrumb.name}</BreadcrumbFont>
        }
      </TouchableOpacity>
    )
  }

  goToPCP = (breadCrumb) => {
    let itmData = {
      itm_source: 'product-detail-page',
      itm_campaign: 'breadcrumb'
    }
    this.props.navigation.replace('ProductCataloguePage', {
      itemDetail: {
        data: {
          url_key: breadCrumb.url_key
        },
        search: ''
      },
      itmData
    }, `breadcrumb-PCP-${breadCrumb.url_key}`)
  }

  render () {
    const { breadcrumb } = this.props
    return (
      <View style={styles.bread}>
        {map(breadcrumb, (breadC, index) => (
          <View key={`bread${breadC.url_key}${index}`}>
            {!isEmpty(breadC.name) && this.renderBreadText(breadC, index)}
          </View>
        ))}
      </View>
    )
  }
}

const BreadcrumbFont = styled.Text`
  color:#757885;
  font-size:12px;
  opacity:0.7;
  font-family:${fonts.regular};
`
