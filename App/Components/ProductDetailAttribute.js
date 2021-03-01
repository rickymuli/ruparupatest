import React, { PureComponent } from 'react'
import { View, TouchableOpacity, Linking } from 'react-native'
import HTML from 'react-native-render-html'
import styled from 'styled-components'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import startsWith from 'lodash/startsWith'

// Styles
import htmlStyles from '../Styles/RNHTMLStyles'

export default class ProductDetailAttribute extends PureComponent {
  constructor () {
    super()
    this.state = {
      showMore: false,
      specs: ''
    }
  }

  componentDidMount () {
    const { attributes } = this.props
    let specs = ''
    map(attributes, (data, index) => {
      if (data.attribute_id > 397 && data.attribute_value.trim() !== '-') {
        switch (data.attribute_type) {
          case 'option':
            if (data.attribute_option.hasOwnProperty('option_id') && data.attribute_option.option_value.trim() !== '-') {
              if (!data.attribute_unit_option.hasOwnProperty('unit_option_id')) {
                specs += (`<li>${data.attribute_label}: ${data.attribute_option.option_value.toLowerCase()}</li>`)
              } else {
                specs += (`<li>${data.attribute_label} : ${data.attribute_option.option_value} ${data.attribute_unit_option.unit_option_value}</li>`)
              }
            }
            break
          case 'boolean':
          case 'bolean':
            specs += (`<li>${data.attribute_label} : ${data.attribute_value === 'false' ? 'tidak' : 'ya'}</li>`)
            break
          case 'short_text':
            if (!isEmpty(data.attribute_value.trim()) && data.attribute_value.trim() !== '0') {
              specs += (`<li>${data.attribute_label}: ${data.attribute_value} ${data.attribute_unit_option.hasOwnProperty('unit_option_value') ? data.attribute_unit_option.unit_option_value : ''}</li>`)
            }
            break
          default:
            break
        }
      }
    })
    this.setState({ specs })
  }

  setupSpesification = () => {
    const { spesification } = this.props
    let newSpecification = spesification
    if (this.state.showMore) {
      newSpecification += this.state.specs
    }
    if (!startsWith(newSpecification, '<ul')) newSpecification = `<ul>${newSpecification}</ul>`
    return newSpecification
  }

  render () {
    return (
      <View style={{ marginBottom: 10 }}>
        <HTML html={`${this.setupSpesification()}`} onLinkPress={(evt, href) => { Linking.openURL(href.replace('https', 'http')) }} tagsStyles={htmlStyles.HTMLPDPTagStyles} allowedStyles={[]} />
        <TouchableOpacity onPress={() => this.setState({ showMore: !this.state.showMore })}>
          {(!isEmpty(this.state.specs)) && !this.state.showMore &&
          <ShowMoreButton>
            <PressableTextM>Selengkapnya</PressableTextM>
          </ShowMoreButton>
          }
        </TouchableOpacity>
      </View>
    )
  }
}

const ShowMoreButton = styled.View`
  padding-vertical: 5px;
  padding-horizontal: 10px;
  margin-bottom: 10px;
  margin-horizontal: 10px;
`

const PressableTextM = styled.Text`
  font-family: Quicksand-Regular;
  color: #008CCF;
`
