import React, { Component } from 'react'
import { View, TouchableOpacity, Text, Dimensions, ImageBackground, Platform } from 'react-native'
import styled from 'styled-components'
import Icon from 'react-native-vector-icons/FontAwesome'

// Component
import LottieComponent from '../Components/LottieComponent'

export default class PointComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: props.selectedTab || '',
      memberId: props.memberId,
      memberPin: '',
      err: props.err || null,
      fetchingPoint: props.fetchingPoint || false
    }
  }

  componentWillReceiveProps (newProps) {
    this.setState({
      selected: newProps.selectedTab,
      err: newProps.err,
      fetchingPoint: newProps.fetchingPoint
    })
  }

  onSubmitPressed = () => {
    const { memberPin, memberId } = this.state
    this.props.handleSubmit(memberPin, memberId)
  }

  renderTextInput = () => {
    const { memberId, memberPin } = this.props
    return (
      <PositionInputPoint>
        <Innericon>
          <IconInner>
            <Icon name='address-card-o' size={16} />
          </IconInner>
          <TextInputInnerIcon editable={false} autoCapitalize='none' underlineColorAndroid='transparent' value={memberId} onChangeText={(memberId) => this.setState({ memberId })} placeholder='No Kartu Member' placeholderTextColor='#b2bec3' maxLength={10} />
        </Innericon>
        <Innericon>
          <IconInner>
            <Icon name='lock' size={16} />
          </IconInner>
          <TextInputInnerIcon autoCapitalize='none' underlineColorAndroid='transparent' value={memberPin} onChangeText={(memberPin) => this.setState({ memberPin })} placeholder='Passkey' placeholderTextColor='#b2bec3' secureTextEntry maxLength={6} />
        </Innericon>
      </PositionInputPoint>
    )
  }

  render () {
    const { width } = Dimensions.get('screen')
    const ratio = (width * 0.95) / 462
    const { selected, err, fetchingPoint } = this.state
    return (
      <View>
        <View style={{ marginTop: 20, alignItems: 'center', marginBottom: 20 }}>
          {(selected === 'ace') ? <ImageBackground source={require('../assets/images/point/ace-card-membership-2.webp')} style={{ width: width * 0.95, height: ratio * 262 }}>{this.renderTextInput()}</ImageBackground>
            : (selected === 'informa') ? <ImageBackground source={require('../assets/images/point/informa-card-membership.webp')} style={{ width: width * 0.95, height: ratio * 262 }}>{this.renderTextInput()}</ImageBackground>
              : (selected === 'toyskingdom') ? <ImageBackground source={require('../assets/images/point/toys-kingdom-card-membership-2.webp')} style={{ width: width * 0.95, height: ratio * 262 }}>{this.renderTextInput()}</ImageBackground>
                : null }
        </View>
        <View style={{ paddingHorizontal: 15 }}>
          {(fetchingPoint)
            ? <View style={{ paddingVertical: 20, borderRadius: 3, backgroundColor: '#F26525', justifyContent: 'center', alignItems: 'center' }}>
              <LottieComponent buttonBlueLoading style={{ height: 25, width: 30 }} />
            </View>
            : <TouchableOpacity onPress={() => this.onSubmitPressed()} style={{ paddingVertical: 10, borderRadius: 3, backgroundColor: '#F26525' }}>
              <Text style={{ color: 'white', textAlign: 'center', fontFamily: 'Quicksand-Medium' }}>Cek Poin</Text>
            </TouchableOpacity>
          }
          {(err !== null)
            ? <View>
              <Text style={{ color: '#F3251D', textAlign: 'center', fontFamily: 'Quicksand-Regular' }}>{err}</Text>
            </View>
            : null
          }
        </View>
      </View>
    )
  }
}

const Innericon = styled.View`
  borderColor: #E0E6ED;
  borderWidth: 1;
  borderRadius: 3;
  marginBottom: 10;
  backgroundColor: white;
`
const IconInner = styled.View`
  position: absolute;
  top:${Platform.OS === 'ios' ? '3' : '9'};
  left:10;
`

const TextInputInnerIcon = styled.TextInput`
  paddingLeft: 40;
  paddingVertical: 3;
  color: #555761;
  height: 30;
`

const PositionInputPoint = styled.View`
  padding-horizontal: 40;
  padding-bottom: 10;
  display:flex;
  justifyContent: flex-end;
  flex-direction: column;
  width: ${Dimensions.get('screen').width * 0.95};
  height: ${(Dimensions.get('screen').width * 0.95) / 462 * 262};
`
