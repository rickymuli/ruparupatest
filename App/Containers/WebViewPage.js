import React, { Component } from 'react'
import { WebView, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import isEmpty from 'lodash/isEmpty'
import { PrimaryTextBold } from '../Styles'

// Components
import Loading from '../Components/LoadingComponent'

export default class WebViewPage extends Component {
  static navigationOptions = {
    header: null
  }

  constructor (props) {
    super(props)
    this.state = {
      formURL: '',
      pageData: props.navigation.getParam('pageData', 'nothing found'),
      title: ''
    }
  }

  componentDidMount () {
    const { pageData } = this.state
    this.setState({
      formURL: pageData.formURL,
      title: pageData.title
    })
  }

  render () {
    const { formURL, title } = this.state
    if (isEmpty(formURL)) {
      return (
        <Loading />
      )
    } else {
      return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View style={{ flexDirection: 'row', padding: 20, justifyContent: 'space-between' }}>
            <Icon name='arrow-left' size={20} color='#757885' style={{ alignSelf: 'flex-start' }} onPress={() => this.props.navigation.goBack()} />
            <View>
              <PrimaryTextBold style={{ fontSize: 18 }}>{title}</PrimaryTextBold>
            </View>
            <View />
          </View>
          <WebView
            androidHardwareAccelerationDisabled
            source={{ uri: formURL }}
            style={{ flex: 1 }}
            startInLoadingState
            renderLoading={() => {
              return (
                <Loading />
              )
            }}
          />
        </View>
      )
    }
  }
}
