import React, { useState } from 'react'
import { Image, TouchableWithoutFeedback, Platform } from 'react-native'
import styled from 'styled-components'
import codePush from 'react-native-code-push'
import get from 'lodash/get'
import { fonts } from '../Styles'
import CodepushMandatoryModal from './CodepushMandatoryModal'
const codePushKey = {
  android: 'CnzSP7Qxo97INMTcPojnXJRc4Ib4jRXVha6rV',
  ios: 'UEeyTD0Zfo7ETxVLgUoC7XkMaaRpWIRSjEegt'
}

const DashboardWelcome = ({ user }) => {
  const [propsProgress, setPropsProgress] = useState(null)
  const checksync = () => {
    const { user } = this.props
    if (user?.user?.email === 'rickyfabian999@gmail.com') {
      codePush.sync({ deploymentKey: codePushKey[Platform.OS], updateDialog: true, installMode: codePush.InstallMode.IMMEDIATE }, null, ({ receivedBytes = 0, totalBytes = 0 }) => {
        setPropsProgress((receivedBytes / totalBytes))
      })
    }
  }
  return (
    <Container>
      <TouchableWithoutFeedback onPress={() => checksync()}>
        <Image source={require('../assets/images/ruparupa-mobile-app-bottom-menu/profile-active.webp')} style={{ width: 50, height: 50 }} />
      </TouchableWithoutFeedback>
      <WelcomeText numberOfLines={1}>Good to see you {get(user.user, 'first_name', '')}</WelcomeText>
      <CodepushMandatoryModal propsProgress={propsProgress} />
    </Container>
  )
}

export default DashboardWelcome

const Container = styled.View`
  padding: 14px;
  flex-direction: column;
  align-items: center;
`
const WelcomeText = styled.Text`
  color: #757886;
  font-family: ${fonts.bold};
  font-size: 20;
`
