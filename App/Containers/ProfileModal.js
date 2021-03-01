import React, { Component } from 'react'
import { View, TouchableOpacity, Text, ScrollView, Dimensions, Modal, TextInput, Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'
import dayjs from 'dayjs'
import styled from 'styled-components'
import isEmpty from 'lodash/isEmpty'
import has from 'lodash/has'
import get from 'lodash/get'
import Toast from 'react-native-easy-toast'
import HeaderSearchComponent from '../Components/HeaderSearchComponent'

// Redux
import UserActions from '../Redux/UserRedux'
import AuthActions from '../Redux/AuthRedux'

import Loading from '../Components/LoadingComponent'

class ProfileModal extends Component {
  static navigationOptions = {
    header: null
  }

  constructor (props) {
    super(props)
    this.state = {
      user: props.user,
      groupAhi: (props.user.user && props.user.user.group && props.user.user.group.AHI) ? props.user.user.group.AHI : '',
      groupHci: (props.user.user && props.user.user.group && props.user.user.group.HCI) ? props.user.user.group.HCI : '',
      groupTgi: (props.user.user && props.user.user.group && props.user.user.group.TGI) ? props.user.user.group.TGI : '',
      updateGroupAhi: (props.user.user && props.user.user.group && props.user.user.group.AHI) ? props.user.user.group.AHI : '',
      updateGroupHci: (props.user.user && props.user.user.group && props.user.user.group.HCI) ? props.user.user.group.HCI : '',
      updateGroupTgi: (props.user.user && props.user.user.group && props.user.user.group.TGI) ? props.user.user.group.TGI : '',
      selectedCard: null,
      modalVisible: false,
      submitAction: false
    }
  }

  componentWillReceiveProps (newProps) {
    const { user } = newProps
    if (!user.fetching) {
      this.setState({
        user,
        groupAhi: (user.user && user.user.group && user.user.group.AHI) ? user.user.group.AHI : '',
        groupHci: (user.user && user.user.group && user.user.group.HCI) ? user.user.group.HCI : '',
        groupTgi: (user.user && user.user.group && user.user.group.TGI) ? user.user.group.TGI : ''
      })
      if (user.err === null) {
        this.setState({
          updateGroupAhi: (user.user && user.user.group && user.user.group.AHI) ? user.user.group.AHI : '',
          updateGroupHci: (user.user && user.user.group && user.user.group.HCI) ? user.user.group.HCI : '',
          updateGroupTgi: (user.user && user.user.group && user.user.group.TGI) ? user.user.group.TGI : ''
        })
        if (this.state.submitAction) {
          this.setState({
            modalVisible: false
          }, () => {
            this.toggleToast()
            this.props.userInit()
          })
        }
      }
    }
  }

  toggleToast = () => {
    this.refs.toast.show('Berhasil mengubah member ID', 250, () => {
      // this.props.toggleWishlist('')
    })
  }

  setModalVisible (visible, selectedCard) {
    this.setState({ modalVisible: visible, selectedCard })
  }

  handleTextChange = (value, group) => {
    if (group === 'updateGroupAhi') {
      this.setState({ updateGroupAhi: value })
    } else if (group === 'updateGroupHci') {
      this.setState({ updateGroupHci: value })
    } else if (group === 'updateGroupTgi') {
      this.setState({ updateGroupTgi: value })
    }
  }

  handleUpdate = () => {
    const { user, updateGroupAhi, updateGroupHci, updateGroupTgi } = this.state
    let group = {}
    if (user && user.user && user.user.group) {
      group = { ...user.user.group }
    }
    group['AHI'] = updateGroupAhi
    group['HCI'] = updateGroupHci
    group['TGI'] = updateGroupTgi
    let newUser = { ...this.state.user.user, group }
    this.props.updateUserData({ user: newUser })
    this.props.authInit()
    this.setState({ submitAction: true })
  }

  closeModalContent = () => {
    let users = this.state.user
    users.err = ''
    this.setState({ user: users })
    this.props.userInit()
    this.setModalVisible(false, '')
  }

  renderModalContent = () => {
    const { user, updateGroupAhi, updateGroupHci, updateGroupTgi, selectedCard } = this.state
    let title
    let placeHolder
    let groupNumber
    let groupName
    if (selectedCard === 'AHI') {
      title = 'Ace Rewards'
      placeHolder = 'Member ID Ace Rewards'
      groupNumber = updateGroupAhi
      groupName = 'updateGroupAhi'
    } else if (selectedCard === 'HCI') {
      title = 'Informa Rewards'
      placeHolder = 'Member ID Informa Rewards'
      groupNumber = updateGroupHci
      groupName = 'updateGroupHci'
    } else {
      title = 'Toys Kingdom Smile Club'
      placeHolder = 'Toyskingdom Smile Club ID'
      groupNumber = updateGroupTgi
      groupName = 'updateGroupTgi'
    }
    return (
      <View style={{ flexDirection: 'column' }}>
        <HeaderContainer>
          <TitleContainer>{title}</TitleContainer>
          <TouchableOpacity onPress={() => this.closeModalContent()}>
            <FlexStart>
              <Icon name='close' size={20} />
            </FlexStart>
          </TouchableOpacity>
        </HeaderContainer>
        <View style={{ backgroundColor: 'white', flexDirection: 'column', padding: 20 }}>
          <FormS style={{ flexDirection: 'row' }}>
            <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} color={'#D4DCE6'} name='credit-card' size={16} />
            <TextInput underlineColorAndroid='transparent' maxLength={10} value={groupNumber} onChangeText={(value) => this.handleTextChange(value, groupName)} placeholder={placeHolder} style={{ textDecorationColor: 'white', color: '#F26525', flex: 1, height: 40 }} />
          </FormS>
          {(!isEmpty(user.err))
            ? <View>
              <Text style={{ fontFamily: 'Quicksand-Regular', color: '#F3251D' }}>{user.err}</Text>
            </View>
            : null
          }
        </View>
        <View style={{ padding: 10 }}>
          <TouchableOpacity onPress={() => this.handleUpdate()} style={{ paddingTop: 10, paddingBottom: 10, paddingRight: 20, paddingLeft: 20, backgroundColor: '#F26525', borderRadius: 3 }}>
            <Text style={{ fontFamily: 'Quicksand-Medium', color: 'white', fontSize: 16, textAlign: 'center' }}>Simpan</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render () {
    const { user, groupAhi, groupHci, groupTgi } = this.state
    // const { width } = Dimensions.get('screen')
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
          {this.props.user.fetching
            ? <Loading />
            : <ContentContainer>
              <DetailProfile >
                <FlexRow>
                  <IconList>
                    <Icon name='account' color='#757886' size={16} />
                  </IconList>
                  <SecondaryGray />
                </FlexRow>
                {has(user, 'user.first_name') &&
                  <ListProfile numberOfLines={1}>{user.user.first_name} {get(user, 'user.last_name', '')}</ListProfile>
                }
              </DetailProfile>
              <DetailProfile >
                <FlexRow >
                  <IconList>
                    <Icon name='email' color='#757886' size={16} />
                  </IconList>
                  <SecondaryGray>
                    Alamat email
                  </SecondaryGray>
                </FlexRow>
                <ListProfile>{user.user.email}</ListProfile>
              </DetailProfile>
              <DetailProfile >
                <FlexRow>
                  <IconList style={{ marginLeft: 1 }}>
                    <Icon name='phone' color='#757886' size={22} />
                  </IconList>
                  <SecondaryGray>
                    No Telepon
                  </SecondaryGray>
                </FlexRow>
                <ListProfile>{user.user.phone}</ListProfile>
              </DetailProfile>
              <DetailProfile >
                <FlexRow >
                  <IconList>
                    <Icon name='calendar-range' color='#757886' size={16} />
                  </IconList>
                  <SecondaryGray>
                    Tanggal lahir
                  </SecondaryGray>
                </FlexRow>
                <ListProfile>{(user.user.birth_date === null) ? '' : dayjs(user.user.birth_date, 'YYYY-MM-DD', false).format('DD MMM YYYY')}</ListProfile>
              </DetailProfile>
              <DetailProfile>
                <FlexRow >
                  <IconList >
                    <Icon name='gender-male-female' color='#757886' size={16} />
                  </IconList>
                  <SecondaryGray>
                    Jenis kelamin
                  </SecondaryGray>
                </FlexRow>
                <ListProfile >{(user.user.gender === null) ? '' : (user.user.gender === 'male') ? 'Laki-laki' : 'Perempuan'}</ListProfile>
              </DetailProfile>
              <DetailProfile >
                <TouchableOpacity onPress={() => this.setModalVisible(true, 'AHI')}>
                  <ListProfile>
                    <Underline>
                      {(groupAhi !== '') ? groupAhi : 'Masukkan Data'}
                    </Underline>
                  </ListProfile>
                </TouchableOpacity>
              </DetailProfile>
              <DetailProfile >
                <TouchableOpacity onPress={() => this.setModalVisible(true, 'HCI')}>
                  <ListProfile >
                    <Underline>
                      {(groupHci !== '') ? groupHci : 'Masukkan Data'}
                    </Underline>
                  </ListProfile>
                </TouchableOpacity>
              </DetailProfile>
              <DetailProfile>
                <TouchableOpacity onPress={() => this.setModalVisible(true, 'TGI')}>
                  <ListProfile>
                    <Underline>
                      {(groupTgi !== '') ? groupTgi : 'Masukkan Data'}
                    </Underline>
                  </ListProfile>
                </TouchableOpacity>
              </DetailProfile>
              <MarginTopS>
                <MarginHorizontalM>
                  <ButtonBorder onPress={() => this.props.navigation.navigate('EditProfile')}>
                    <ButtonBorderText ><Icon name='pencil' /> Edit Profil</ButtonBorderText>
                  </ButtonBorder>
                </MarginHorizontalM>
              </MarginTopS>
            </ContentContainer>
          }
        </ScrollView>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.closeModalContent()
          }}>
          {this.renderModalContent()}
        </Modal>
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

const stateToProps = (state) => ({
  user: state.user
})

const dispatchToProps = (dispatch) => ({
  updateUserData: (user) => dispatch(UserActions.userUpdate(user)),
  authInit: () => dispatch(AuthActions.authInit()),
  userInit: () => dispatch(UserActions.userInit())
})

export default connect(stateToProps, dispatchToProps)(ProfileModal)

const Container = styled.View`
  flex: 1;
  backgroundColor: white;
`

const HeaderContainer = styled.View`
  flexDirection: row;
  padding: 15px;
  width: 100%;
  borderBottomColor: #E0E6ED;
  borderBottomWidth: 1px;
`
const FlexStart = styled.View`
  alignSelf : flex-start;
`
const TitleContainer = styled.Text`
  textAlign: center;
  flexGrow: 90;
  fontSize: 16;
  color: #757886;
  font-family:Quicksand-Bold;
`
const ContentContainer = styled.View`
  flexDirection: column;
  padding: 10px;
`

const DetailProfile = styled.View`
  flex:1;
  flexDirection: row;
  justifyContent: space-between;
  paddingVertical: 15;
  borderBottomColor: #E0E6ED;
  borderBottomWidth: 1;
`

const ListProfile = styled.Text`
  color: #757886;
  fontSize: 14;
  textAlign: right;
  flex: 1;
  font-family:Quicksand-Bold;
`
const FlexRow = styled.View`
  flexDirection: row;
`

const IconList = styled.View`
  width: 30px;
`

const SecondaryGray = styled.Text`
  fontSize: 14;
  color: #757886;
  font-family:Quicksand-Regular;
`

const Underline = styled.Text`
  text-decoration: underline;
  font-family:Quicksand-Regular;
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
const MarginTopS = styled.View`
  margin-top: 15px;
`

const FormS = styled.View`
  border: 1px #e5e9f2 solid;
  padding: 0px;
  border-radius: 3px;
  margin-top: 5px;
  margin-bottom: 10px;
`
