import React from 'react'
import { View } from 'react-native'

import styled from 'styled-components'

const ButtonPrimary = (props) => {
  return (
    <View>
      {props.oneButton ? (
        <Button onPress={props.onPressBtn}
          disabled={props.disabledBtn}
          style={props.btnStyle}>
          <ButtonText style={props.textStyle}>{props.text}</ButtonText>
        </Button>
      ) : (
        <View style={{ padding: 15 }}>
          <Button onPress={props.onPressTopBtn}
            disabled={props.disabledTopBtn}
            style={props.topBtnStyle}>
            <ButtonText style={props.topTextStyle}>{props.topText}</ButtonText>
          </Button>
          <Button onPress={props.onPressBotBtn}
            disabled={props.disabledBotBtn}
            style={props.botBtnStyle}>
            <ButtonText style={props.botTextStyle}>{props.botText}</ButtonText>
          </Button>
        </View>
      )}
    </View>
  )
}

export default ButtonPrimary

const Button = styled.TouchableOpacity`
  paddingTop: 10;
  paddingBottom: 10;
  paddingRight: 20;
  paddingLeft: 20;
  backgroundColor: #F26525;
  borderRadius: 3;
  margin-top: 5px;
  margin-bottom: 10px;
`
const ButtonText = styled.Text`
  color: white;
  fontSize: 14;
  textAlign: center;
  font-family:Quicksand-Bold;
`
