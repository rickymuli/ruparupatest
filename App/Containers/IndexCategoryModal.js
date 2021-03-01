import React, { Component, Fragment } from 'react'
import { View, Text, Dimensions } from 'react-native'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import styled from 'styled-components'
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
// Containers
import IndexMiniCategory from './IndexMiniCategory'

const SCREEN_WIDTH = Math.round(Dimensions.get('window').width * 1000) / 1000 - 6 // Adjustment for margin given to RLV;
const SCREEN_HEIGHT = 70

class IndexCategoryModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      category: undefined,
      fetching: undefined,
      currentCategoryChildren: undefined,
      parentData: [],
      level: 0
    }

    this.layoutProvider = new LayoutProvider((i) => {
      return 'NORMAL'
    }, (type, dim) => {
      switch (type) {
        case 'NORMAL':
          dim.width = SCREEN_WIDTH
          dim.height = SCREEN_HEIGHT
          break
        default:
          dim.width = 0
          dim.height = 0
      }
    })
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const tempState = {}
    if (!isEqual(prevState.category, nextProps.category)) {
      if (nextProps.category) {
        if (!isEmpty(nextProps.category.children)) {
          if (!isEmpty(nextProps.parentData.name)) {
            Object.assign(tempState, { level: 1,
              category: nextProps.category,
              currentCategoryChildren: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(
                nextProps.category.children
              ) })
          } else {
            let sortByanalytic = (nextProps.category.children).slice(4, 5)
            sortByanalytic = sortByanalytic.concat((nextProps.category.children).slice(6, 7))
            sortByanalytic = sortByanalytic.concat((nextProps.category.children).slice(7, 8))
            sortByanalytic = sortByanalytic.concat((nextProps.category.children).slice(0, 4))
            sortByanalytic = sortByanalytic.concat((nextProps.category.children).slice(5, 6))
            sortByanalytic = sortByanalytic.concat((nextProps.category.children).slice(8, 12))
            Object.assign(tempState, { category: nextProps.category,
              currentCategoryChildren: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(
                sortByanalytic
              ) })
          }
        }
      }
    }

    if (!isEqual(prevState.parentData, nextProps.parentData)) {
      if (nextProps.parentData && !prevState.parentData.includes(nextProps.parentData)) {
        Object.assign(tempState, { parentData: prevState.parentData.concat(nextProps.parentData) })
      }
    }

    return tempState
  }

  componentWillUnmount () {
    this.setState({
      category: undefined,
      fetching: undefined,
      currentCategoryChildren: undefined,
      parentData: []
    })
    this.props.closeModal()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.currentCategoryChildren !== this.state.currentCategoryChildren) {
      this._listRef.scrollToOffset(0, 0, false)
    }
  }

  reRenderChildren = (children, parentData) => {
    const newParentData = [parentData].concat(this.state.parentData)
    this.setState({
      currentCategoryChildren: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(
        children
      ),
      parentData: newParentData
    })
  }

  handleBackToParent = (parentData) => {
    const shiftedParentData = parentData.filter((val, index) => index > 0 ? val : null)
    if (!isEmpty(shiftedParentData) && !isEmpty(shiftedParentData[0].name)) {
      this.changeLevel('minus')
      this.setState({
        currentCategoryChildren: !isEmpty(shiftedParentData) ? new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(
          shiftedParentData[0].children
        ) : undefined,
        parentData: shiftedParentData
      })
    } else {
      this.props.closeModal()
    }
  }

  changeLevel = (method) => {
    const { level } = this.state
    if (method === 'plus') {
      this.setState({ level: level + 1 })
    } else if (method === 'minus' && level !== 0) {
      this.setState({ level: level - 1 })
    }
  }

  _rowRenderer = (type, data) => {
    const { currentCategoryChildren, parentData, level } = this.state
    const isChildren = (typeof currentCategoryChildren !== 'undefined')

    return (
      <IndexMiniCategory
        recycleListRef={this._listRef}
        level={level}
        changeLevel={this.changeLevel}
        data={data}
        reRenderChildren={this.reRenderChildren}
        handleBackToParent={this.handleBackToParent}
        additionalChildrendata={isChildren ? parentData : []}
        navigation={this.props.navigation}
        closeModal={this.props.closeModal}
      />
    )
  }

  _navigateToScreen = (screen) => {
    const { parentData } = this.state
    this.props.closeModal()
    let itmData = {
      itm_source: 'category',
      itm_campaign: parentData[0].url_key
    }
    this.props.navigation.navigate(screen, {
      itemDetail: {
        search: '',
        data: {
          url_key: parentData[0].url_key
        }
      },
      itmData
    })
  }

  render () {
    const { currentCategoryChildren, parentData } = this.state
    let fontsize = 18
    if (parentData[0].hasOwnProperty('name') && parentData[0].name.length > 20) {
      fontsize = 14
    }
    let breadCrumb = []
    parentData.forEach((data, index) => {
      if (!isEmpty(data.name)) {
        breadCrumb.push(data.name)
      }
    })
    breadCrumb.reverse()
    // const { showAllCategories } = this.props
    const payload = currentCategoryChildren
    if (payload) {
      return (
        <RowView>
          <Text style={{ paddingHorizontal: 15, paddingTop: 15, fontFamily: 'Quicksand-Regular', fontSize: 12, color: '#555761' }}>Kategori{(!isEmpty(parentData))
            ? breadCrumb.map((data, index) => (
              <Text key={`${index} bread crumb category`} style={[(index === breadCrumb.length - 1) ? { fontFamily: 'Quicksand-Bold', color: '#757886', opacity: 0.7 } : { fontFamily: 'Quicksand-Regular' }, { paddingHorizontal: 15, paddingTop: 15, fontSize: 12, color: '#555761' }]}> / {data}</Text>
            ))
            : null
          }</Text>
          {
            !isEmpty(parentData)
              ? <Fragment>
                <NavigationTouch
                  k={0}
                  onPress={() => this.handleBackToParent(parentData)}
                >
                  <Text style={{ fontSize: 16, fontFamily: 'Quicksand-Bold', color: '#555761' }}>
                    <Icon name='arrow-left' size={16} color='#555761' /> Kembali
                  </Text>
                </NavigationTouch>
                {/* {
                  (showAllCategories && parentData[0].children[0] && parentData[0].children[0].hasOwnProperty('category_id') && parseInt(parentData[0].children[0].category_id) !== -1) || !showAllCategories // temp hack
                    ? <NavigationTouch
                      k={1}
                      additionalChildrendata={parentData}
                      onPress={() => this._navigateToScreen('ProductCataloguePage')}
                    >
                      <Text style={{ fontSize: 16, fontWeight: '500' }}>
                        Tampilkan semua {parentData[0].name}
                      </Text>
                      <Icon name='arrow-right' size={16} color='black' />
                    </NavigationTouch>
                    : null
                } */}
              </Fragment>
              : null
          }
          <RecyclerListView
            ref={ref => { this._listRef = ref }}
            style={{ flexDirection: 'column' }}
            layoutProvider={this.layoutProvider}
            dataProvider={payload}
            rowRenderer={this._rowRenderer} />
          {(!isEmpty(parentData[0].name))
            ? <Button onPress={() => this._navigateToScreen('ProductCataloguePage')}>
              <Text style={{ fontSize: fontsize, fontFamily: 'Quicksand-Bold', color: 'white' }}>Lihat Semua {parentData[0].name}</Text>
            </Button>
            : null
          }
        </RowView>
      )
    } else {
      return (
        <View>
          <Text>
            Mohon maaf, kategori tidak ditemukan
          </Text>
        </View>
      )
    }
  }
}

const RowView = styled.View`
  flex: 1;
  background-color: #F9FAFC;
`
const NavigationTouch = styled.TouchableOpacity`
  justify-content: space-between;
  flex-direction: row;
  background-color: #F9FAFC;
  padding-horizontal: 10;
  padding-vertical: 15;
  border-radius: 30;
  margin-vertical: 5;
  margin-right: 8;
  margin-left: 8;
`
const Button = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  background-color: #F26525;
  padding-vertical: 15
`

export default IndexCategoryModal
