import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
// import {
//   Freshchat,
//   FreshchatConfig,
//   ConversationOptions,
//   FreshchatUser,
//   FreshchatNotificationConfig
// } from 'react-native-freshchat-sdk'
// import config from '../../config'
// import firebase from '@react-native-firebase/app'

class ChatPage extends Component {
  static navigationOptions = {
    header: null
  }

  constructor (props) {
    super(props)
    this.state = {
      auth: props.auth || null
    }
  }

  // componentWillReceiveProps (newProps) {
  //   const { auth } = newProps
  //   this.setState({ auth })
  // }

  // async componentDidMount () {
  //   const freshchatConfig = new FreshchatConfig(config.freshChatAppId, config.freshChatAppKey)
  //   Freshchat.init(freshchatConfig)
  //   Freshchat.setPushRegistrationToken('')
  //   this.setUser()
  //   this.setNotif()
  //   this.openChat()
  // }

  // // When the page is closed, add push notification
  // async componentWillUnmount () {
  //   const token = await firebase.messaging().getToken()
  //   Freshchat.setPushRegistrationToken(token)
  // }

  // showFaqs = () => {
  //   Freshchat.showFAQs()
  // }

  // setNotif = () => {
  //   let freshchatNotificationConfig = new FreshchatNotificationConfig()
  //   freshchatNotificationConfig.priority = FreshchatNotificationConfig.NotificationPriority.PRIORITY_HIGH
  //   freshchatNotificationConfig.notificationSoundEnabled = false
  //   Freshchat.setNotificationConfig(freshchatNotificationConfig)
  // }

  // openChat = () => {
  //   let conversationOption = new ConversationOptions()
  //   Freshchat.showConversations(conversationOption)
  //   // Remove push notification
  // }

  // setUser = () => {
  //   const { auth } = this.props
  //   let freshchatUser = new FreshchatUser()
  //   let userPropertiesJson = {
  //     'user_type': 'guest'
  //   }

  //   freshchatUser.firstName = 'Guest'

  //   // If user has logged in then set freshchat user to the current user
  //   // Else set to a default user
  //   if (auth.user !== null) {
  //     freshchatUser.firstName = auth.user.first_name
  //     freshchatUser.lastName = auth.user.last_name
  //     freshchatUser.email = auth.user.email
  //     freshchatUser.phone = auth.user.phone
  //     userPropertiesJson = {
  //       'user_type': 'member'
  //     }
  //     Freshchat.identifyUser(auth.user.email, null)
  //   }
  //   Freshchat.setUser(freshchatUser)
  //   Freshchat.setUserProperties(userPropertiesJson)
  // }

  render () {
    return (
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }} />
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(ChatPage)
