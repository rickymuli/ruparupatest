import React, { Component } from 'react'
import { TouchableOpacity, Image } from 'react-native'
import styled from 'styled-components'
import Icon from 'react-native-vector-icons/AntDesign'
import { connect } from 'react-redux'
import has from 'lodash/has'
import { fonts } from '../Styles'

class MiddleSearchBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      popularSearch: null
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.log.popularSearch !== prevState.popularSearch && !nextProps.log.fetchingPopularSearch) {
      return {
        popularSearch: nextProps.log.popularSearch
      }
    } else {
      return null
    }
  }

  openSearch () {
    this.props.navigation.navigate('SearchPage')
  }

  scanPage () {
    this.props.navigation.navigate('ScanPage')
  }

  render () {
    const { popularSearch } = this.state
    return (
      <Container>
        <TouchableOpacity onPress={() => this.openSearch()} style={{ flexDirection: 'row' }}>
          <IconContainer>
            <Image style={{ width: 25, height: 25 }} source={require('../assets/images/search-bar-index/search-home.webp')} />
          </IconContainer>
          {(!has(popularSearch, 'data[0].key'))
            ? <SearchPlaceholderText>Cari di ruparupa</SearchPlaceholderText>
            : <SearchPlaceholderText>Coba "{popularSearch.data[0].key}"</SearchPlaceholderText>
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.scanPage()} style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Icon name={'scan1'} size={24} />
        </TouchableOpacity>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  log: state.log
})

export default connect(mapStateToProps)(MiddleSearchBar)

const Container = styled.View`
  padding-horizontal: 5%;
  padding-vertical: 5;
  flex-direction: row;
  justify-content: space-between;
  border-width: 2;
  border-color: #E5E9F2;
  border-radius: 30;
`

const IconContainer = styled.View`
  align-self: center;
  margin-right: 10px;
`

const SearchPlaceholderText = styled.Text`
  width: 70%;
  font-family: ${fonts.regular};
  font-size: 18;
  opacity: 0.7;
  align-self: center;
  color: #757886;
`

// const B = styled.Text`
//   font-family: ${fonts.bold};
//   font-size: 18;
// `
// const OrangeText = styled.Text`
//   color: #F26525;
// `

// const BlueText = styled.Text`
//   color: #008CCF;
// `
