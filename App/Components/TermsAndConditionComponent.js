import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Linking } from 'react-native'
import config from '../../config'
import styled from 'styled-components'

export default class TermsAndConditionComponent extends Component {
  render () {
    const { useButton } = this.props
    const ButtonToucable = (useButton) ? ButtonContainer : TouchableOpacity
    const TextComponent = (useButton) ? TextButtonTnc : TextNormalTnc
    return (
      <View style={[{ flexDirection: 'row' }, (useButton) ? { paddingBottom: 15, paddingHorizontal: 15, justifyContent: 'space-between' } : { marginTop: 10, justifyContent: 'center' }]}>
        <ButtonToucable onPress={() => Linking.openURL(config.urlTnc)}>
          <TextComponent>Syarat & Ketentuan</TextComponent>
        </ButtonToucable>
        {(!useButton) &&
        <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 14 }}> dan </Text>
        }
        <ButtonToucable onPress={() => Linking.openURL(config.urlPrivacyPolicy)}>
          <TextComponent>Kebijakan Privasi</TextComponent>
        </ButtonToucable>
      </View>
    )
  }
}

const TextButtonTnc = styled.Text`
  text-align: center;
  font-family: Quicksand-Medium;
  color: #757886;
  font-size: 16;
`

const TextNormalTnc = styled.Text`
  text-decoration-line: underline;
  font-family: Quicksand-Bold;
  font-size: 14;
`

const ButtonContainer = styled.TouchableOpacity`
  justify-content: center;
  border-width: 1px;
  width: 48%;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 4px;
  border-color: #D4DCE6;
  align-items: center;
`
