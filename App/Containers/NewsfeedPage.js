import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import dayjs from 'dayjs'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import styled from 'styled-components'
import { fonts } from '../Styles'

// Components
// import Loading from '../Components/LoadingComponent'
import LottieComponent from '../Components/LottieComponent'
import NewsItems from '../Components/NewsItems'

class NewsfeedPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      news: null,
      prepData: false,
      notifData: []
    }
  }

  componentDidMount () {
    if (!isEmpty(this.state.news)) {
      this.classifyData()
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.newsFeed.allData !== prevState.news) {
      return {
        news: nextProps.newsFeed.allData,
        prepData: true
      }
    }
    return null
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.news !== this.state.news) {
      this.classifyData()
    }
  }

  classifyData = () => {
    const { news } = this.state
    let groupedData
    if (news.data) {
      groupedData = groupBy(news.data, function (data) {
        return dayjs(new Date(data ? data.createdDate : ''), 'LLL', false).format('MMMM DD, YYYY')
      })
    } else {
      groupedData = groupBy(news, function (data) {
        return dayjs(new Date(data.createdDate), 'LLL', false).format('MMMM DD, YYYY')
      })
    }
    let newsDate = Object.keys(groupedData)
    let finalData = []
    newsDate.forEach((data, index) => {
      let objData = {}
      objData.createdDate = newsDate[index]
      objData.value = groupedData[newsDate[index]]
      finalData.push(objData)
    })
    this.setState({ notifData: finalData, prepData: false })
  }

  render () {
    const { notifData, prepData } = this.state
    return (
      <Container>
        <HeaderContainer>
          <View />
          <Text style={{ fontSize: 20, fontFamily: fonts.bold }}>My Notifications</Text>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name='close-circle' size={24} color='#D4DCE6' />
          </TouchableOpacity>
        </HeaderContainer>
        {(prepData)
          ? <LottieComponent />
          : (isEmpty(notifData))
            ? <View style={{ padding: 20 }}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 14, textAlign: 'center' }}>Belum ada notifikasi</Text>
            </View>
            : <ScrollView>
              {(notifData.map((data, index) => (
                <ItemContainer key={'notif per day ' + index}>
                  <HeaderText>{
                    (dayjs(data.createdDate).isSame(dayjs(), 'day'))
                      ? 'Today'
                      : (dayjs(data.createdDate).isSame(dayjs().subtract(1, 'days'), 'day'))
                        ? 'Yesterday'
                        : `${dayjs(data.createdDate, 'LLL', false).format('DD MMMM YYYY')}`
                  }</HeaderText>
                  {(data.value.map((val, index) => (
                    <NewsItems val={val} key={'notification items ' + index} navigation={this.props.navigation} />
                  )))}
                </ItemContainer>
              )))}
            </ScrollView>
        }
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  newsFeed: state.newsFeed
})

export default connect(mapStateToProps)(NewsfeedPage)

const Container = styled.View`
  flex-direction: column;
  flex: 1;
  backgroundColor: #FFFFFF;
`
const HeaderContainer = styled.View`
  justify-content: space-between;
  flex-direction: row;
  padding-vertical: 15;
  padding-horizontal: 15;
`
const ItemContainer = styled.View`
  padding-vertical: 5;
  padding-left: 10;
`
const HeaderText = styled.Text`
  font-family: ${fonts.medium};
  font-size: 16;
`

// pending color: #F5A623
