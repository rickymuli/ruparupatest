import React, { Component } from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components'

export default class SystemMaintenanceNews extends Component {
  render () {
    const { description } = this.props
    return (
      <ItemContainer>
        <CircleView>
          <SystemText>SYSTEM</SystemText>
        </CircleView>
        <NotifDescription>
          <DescText>{description}</DescText>
        </NotifDescription>
      </ItemContainer>
    )
  }
}

const ItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal: 5;
  padding-vertical: 15;
`
const CircleView = styled.View`
  background-color: #FFF043;
  border-radius: 100;
  justify-content: center;
  align-items: center;
  height: 48;
  width: 48;
`
const SystemText = styled.Text`
  font-family: Quicksand-Bold;
  font-size: 10;
  color: #555761;
`
const NotifDescription = styled.View`
  flex-wrap: wrap;
  width: ${Dimensions.get('window').width * 0.75}
  margin-right: 20px;
`
const DescText = styled.Text`
  font-size: 11;
  font-family: Quicksand-Regular;
`
