import React, { Component } from 'react'
import styled from 'styled-components'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import isEmpty from 'lodash/isEmpty'
import analytics from '@react-native-firebase/analytics'
import { fonts, colors } from '../Styles'

export default class IndexMiniCategory extends Component {
  handleBackToParent = (additionalChildrendata) => {
    this.props.changeLevel('minus')
    this.props.handleBackToParent(additionalChildrendata)
  }

  _handleAnalytic = (type, data) => {
    if (type === 'search') {
      analytics().logSearch({ search_term: data.url_key })
      return
    }
    if (type === 'select_content') {
      analytics().logSelectContent({ content_type: 'category', item_id: !data.url_key ? '' : data.url_key })
    }
  }

  handleOnPress = (data) => {
    if (isEmpty(data.children) || this.props.level > 1) {
      // analytics().logEvent('searchFromCategories', { searchFromCategories: data })
      this._handleAnalytic('search', data)
      this._handleAnalytic('select_content', data)
      this.props.closeModal()
      let itmData = {
        itm_source: 'category',
        itm_campaign: data.url_key
      }
      this.props.navigation.navigate('ProductCataloguePage', {
        itemDetail: {
          search: '',
          data: {
            url_key: data.url_key
          }
        },
        itmData
      })
    } else {
      this._handleAnalytic('select_content', data)
      this.props.reRenderChildren(data.children, data)
      this.props.changeLevel('plus')
    }
  }

  render() {
    const { data, level } = this.props
    if (isEmpty(data.name)) {
      return null
    } else {
      return (
        <MiniCategoryTouch
          onPress={() => this.handleOnPress(data)}
        >
          <TextCategory style={[(data.name.length > 40) ? { fontSize: 12, paddingVertical: 5 } : { fontSize: 16 }, { fontFamily: fonts.bold, color: colors.primary }]}>
            {data.name}
          </TextCategory>
          {(isEmpty(data.children) || level > 1)
            ? null
            : <Icon name='arrow-right' size={16} color='#555761' />
          }
        </MiniCategoryTouch>
      )
    }
  }
}

const MiniCategoryTouch = styled.TouchableOpacity`
  justify-content: space-between;
  flex-direction: row;
  background-color: #FFFFFF;
  padding-vertical: 15;
  padding-horizontal: 15;
  border-radius: 30;
  margin-top: 5;
  margin-left: 10;
  margin-right: 8;
  align-items: center;
  border-width: 1;
  border-color: #E5E9F2;
`

const TextCategory = styled.Text`
  font-size: 16;
  font-family: ${fonts.bold};
  color: #555761;
  padding-left: 10px;
`
