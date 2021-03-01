import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import {
  Freshchat,
  FaqOptions
  // FreshchatConfig
} from 'react-native-freshchat-sdk'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import uniqBy from 'lodash/uniqBy'
import styled from 'styled-components'
import { fonts } from '../Styles'
// import firebase from '@react-native-firebase/app'
// import config from '../../config'
// import { Navigate } from '../Services/NavigationService'

class ChatButton extends Component {
  constructor (props) {
    super(props)
    this.state = {
      auth: props.auth || null,
      unreadMessages: null,
      freshchatRestoreId: []
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!isEqual(prevState.auth, nextProps.auth)) {
      return {
        auth: nextProps.auth
      }
    }
    return null
  }

  async componentDidMount () {
    const { freshchatRestoreId } = this.state
    // console.log('freshchatRestoreId', freshchatRestoreId, isEmpty(freshchatRestoreId))
    if (isEmpty(freshchatRestoreId)) {
      let restore = await AsyncStorage.getItem('freshchatRestoreId')
      // console.log('restore', restore, !isEmpty(restore))
      if (!isEmpty(restore)) this.setState({ freshchatRestoreId: JSON.parse(restore) })
    }
    this.unReadEvent = Freshchat.addEventListener(
      Freshchat.EVENT_UNREAD_MESSAGE_COUNT_CHANGED,
      () => {
        Freshchat.getUnreadCountAsync((data) => {
          var count = data.count
          var status = data.status
          if (status) {
            this.setState({ unreadMessages: count })
          } else {
          }
        })
      }
    )
    // console.log('freshchatRestoreId', freshchatRestoreId)
    this.restoreIdEvent = Freshchat.addEventListener(
      Freshchat.EVENT_USER_RESTORE_ID_GENERATED,
      () => {
        // console.log("onRestoreIdUpdated triggered", this.state, freshchatRestoreId, this.state.freshchatRestoreId);
        Freshchat.getUser(({ externalId, restoreId }) => {
          // console.log('externalId restoreId', !isEmpty(user), !_.includes([user], freshchatRestoreId))
          if (externalId) {
            let freshchatState = this.state.freshchatRestoreId
            // console.log('freshchatState', freshchatState)
            let newUser = [...freshchatState, { externalId, restoreId }]
            // console.log('newUser', newUser)
            let newRestoreId = uniqBy(newUser, 'externalId')
            // console.log('newRestoreId', newRestoreId)
            if (newRestoreId.length > 5) newRestoreId.pop()
            AsyncStorage.setItem('freshchatRestoreId', JSON.stringify(newRestoreId))
            this.setState({ freshchatRestoreId: newRestoreId })
          }
        })
      }
    )
  }

  componentWillUnmount () {
    this.restoreIdEvent = null
    this.unReadEvent = null
  }

  componentDidUpdate = () => {
    // console.log('askdaksdb', this.state)
    // Freshchat.getUnreadCountAsync((data) => {
    //   this.setState({ unreadMessages: data.count })
    // })
  }

  openChat = () => {
    var faqOptions = new FaqOptions()
    faqOptions.showContactUsOnFaqScreens = true
    faqOptions.showContactUsOnFaqNotHelpful = true
    Freshchat.showFAQs(faqOptions)
  }

  render () {
    const { unreadMessages } = this.state
    // let height = 20
    // if (this.props.positionHigh) {
    //   height = 80
    // }
    // if (this.props.superHigh) {
    //   height = 100
    // }

    // if (this.props.fromIndexPage) {
    //   return (
    //     <Message onPress={() => this.openChat()}>
    //       <Icon name='message-text-outline' size={25} style={{ color: '#757885' }} />
    //       {(unreadMessages)
    //         ? <Badge >
    //           <BadgeText >{unreadMessages}</BadgeText>
    //         </Badge>
    //         : null
    //       }
    //     </Message>
    //   )
    // } else {
    return (
      <TouchPointIcon style={{ bottom: 20 }}
        onPress={() => this.openChat()}
      >
        <Icon name='message1' color='#FFFFFF' size={25} />
        {(unreadMessages)
          ? <Badge >
            <BadgeText >{unreadMessages}</BadgeText>
          </Badge>
          : null
        }
      </TouchPointIcon>
    )
    // }
  }
}

const stateToProps = (state) => ({
  auth: state.auth
})

export default connect(stateToProps, null)(ChatButton)

// const Message = styled.TouchableOpacity`
// align-self:center;
// margin-top:10px;
// padding-left:10px;
// margin-bottom:20px;
// flex-direction: row;
// justify-content: center;
// align-items: center;
// `
const Badge = styled.View`
border-radius: 30px;
background-color: #008CCF;
justify-content: center;
align-items: center;
width: 15px;
height: 15px;
margin-left: -10;
margin-top: -10;
`
const BadgeText = styled.Text`
font-family: ${fonts.medium};
color: #ffffff;
textAlign: center;
fontSize: 9;
marginBottom: 2;
`
const TouchPointIcon = styled.TouchableOpacity`
position: absolute;
right: 15;
backgroundColor: #45a4ec;
borderRadius: 100;
height: 60;
width: 60;
justifyContent: center;
alignItems: center;
`
