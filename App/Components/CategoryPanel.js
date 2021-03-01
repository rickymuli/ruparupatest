import React, { Component } from 'react'
import { View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

// Styles
import styled from 'styled-components'
import { fonts } from '../Styles'

export default class CategoryPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      drawerOpen: false
    }
  }

  // Render children category
  renderChildrenCategory = () => {
    const { drawerOpen } = this.state
    const { category } = this.props
    if (drawerOpen) {
      return (
        <View style={{ marginLeft: 30 }}>
          <TouchableOpacity onPress={() => this.goToPCP('Tampilkan semua', category)}>
            <View style={{ marginBottom: 20, marginTop: 20 }} >
              <P>Tampilkan Semua</P>
            </View>
          </TouchableOpacity>
          {category.children.map((childCategory, index) => (
            <MarginBottomL key={`children category ${index}${childCategory.name}`}>
              <TouchableOpacity onPress={() => this.goToPCP(childCategory, '')}>
                <P>{childCategory.name}</P>
              </TouchableOpacity>
            </MarginBottomL>
          ))}
        </View>
      )
    } else {
      return null
    }
  }
  // Sending the data back to its parent CategoryPage
  goToPCP = (category, subCategory) => {
    this.props.goToCataloguePage(category, subCategory)
  }

  // Check if drawer is opened or closed
  checkDrawer = () => {
    let { drawerOpen } = this.state
    if (drawerOpen) {
      this.setState({ drawerOpen: false })
    } else {
      this.setState({ drawerOpen: true })
    }
  }

  // Render category
  render () {
    const { category } = this.props
    const { drawerOpen } = this.state
    return (
      <CardCategory>
        <TouchableOpacity onPress={() => this.checkDrawer()}>
          <Container>
            <DistributeSpaceBetween style={{ marginLeft: 10 }}>
              <FontSizeS><Bold>{category.name}</Bold></FontSizeS>
              {(drawerOpen)
                ? <Icon name='minus' size={16} />
                : <Icon name='plus' size={16} />
              }
            </DistributeSpaceBetween>
          </Container>
        </TouchableOpacity>
        {this.renderChildrenCategory()}
      </CardCategory>
    )
  }
}

const CardCategory = styled.View`
background-color: white;
padding-vertical:10px;
border-bottom-width:1;
border-bottom-color:#F0F2F7;
`

const Container = styled.View`
  padding: 10px;
`

const MarginBottomL = styled.View`
  margin-bottom: 25px;
`

const P = styled.Text`
  font-size: 14px;
  color: #555761;
  line-height: 18px;
`

const FontSizeS = styled.Text`
  font-size: 14px !important;
  color: #555761;
  line-height: 16px;
  font-family:${fonts.regular};
`

const Bold = styled.Text`
  font-family:${fonts.bold};
  color: #757886;
`

const DistributeSpaceBetween = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`
