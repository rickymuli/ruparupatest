import React, { Component } from 'react'
import { View, ScrollView, Image, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Toast from 'react-native-easy-toast'

// Components
// import EditMemberWrapper from '../Components/EditMemberWrapper'
import ProfileInfoWrapper from '../Components/ProfileInfoWrapper'
import HeaderSearchComponent from '../Components/HeaderSearchComponent'

// Styles
import styled from 'styled-components'

export default class ProfilePage extends Component {
  toggleToast = () => {
    this.refs.toast.show('Berhasil mengupdate profile anda', 500)
  }

  render () {
    const win = Dimensions.get('screen')
    const ratio = win.width / 1334
    return (
      <Container>
        <ScrollView keyboardShouldPersistTaps='always'>
          <HeaderSearchComponent pageName={'Profil Saya'} close navigation={this.props.navigation} />
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={require('../assets/images/profile-background-mobile.webp')}
              style={{ width: win.width, height: ratio * 438 }}
            />
          </View>
          <ContentContainer>
            <ProfileInfoWrapper />
            {/* <EditMemberWrapper toggleToast={this.toggleToast} /> */}
          </ContentContainer>
          <MarginTopS>
            <MarginHorizontalM>
              <ButtonBorder onPress={() => this.props.navigation.navigate('EditProfile')}>
                <ButtonBorderText ><Icon name='pencil' /> Edit Profil</ButtonBorderText>
              </ButtonBorder>
            </MarginHorizontalM>
          </MarginTopS>
        </ScrollView>
        <Toast
          ref='toast'
          style={{ width: '100%', backgroundColor: '#049372', borderRadius: 0 }}
          position='top'
          positionValue={0}
          fadeInDuration={750}
          fadeOutDuration={1500}
          opacity={1}
          textStyle={{ color: '#FFFFFF', textAlign: 'center' }}
        />
      </Container>
    )
  }
}

const Container = styled.View`
  flex: 1;
  backgroundColor: white;
`

// const HeaderContainer = styled.View`
//   flexDirection: row;
//   padding: 15px;
//   width: 100%;
//   borderBottomColor: #E0E6ED;
//   borderBottomWidth: 1px;
// `
// const FlexStart = styled.View`
//   alignSelf : flex-start;
// `
// const TitleContainer = styled.Text`
//   textAlign: center;
//   flexGrow: 90;
//   fontSize: 16;
//   color: #757886;
//   font-family:Quicksand-Bold;
// `
const ContentContainer = styled.View`
  flexDirection: column;
  padding: 10px;
`

const MarginTopS = styled.View`
  margin-top: 15px;
`

const MarginHorizontalM = styled.View`
  marginHorizontal : 20;
`

const ButtonBorder = styled.TouchableOpacity`
  paddingTop: 10;
  paddingLeft: 15;
  paddingBottom: 10;
  paddingRight: 15;
  borderWidth: 1;
  borderColor: #E0E6ED;
`

const ButtonBorderText = styled.Text`
  fontSize: 16;
  textAlign: center;
  font-family:Quicksand-Bold;
`
