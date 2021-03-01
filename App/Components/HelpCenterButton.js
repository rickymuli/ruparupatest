import React, { Component } from 'react'
import { Linking } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {
  ButtonContainer,
  ButtonGreyOutline,
  ButtonGreyText } from '../Styles/StyledComponents'

export default class HelpCenterButton extends Component {
  render () {
    return (
      <ButtonContainer>
        <ButtonGreyOutline onPress={() => Linking.openURL('https://m.ruparupa.com/help-center')}>
          <ButtonGreyText><Icon name='information-outline' size={20} style={{ color: '#555761', marginRight: 15 }} /> Pusat Bantuan</ButtonGreyText>
        </ButtonGreyOutline>
      </ButtonContainer>
    )
  }
}
