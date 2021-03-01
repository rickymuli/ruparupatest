import React, { Component } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import dayjs from 'dayjs'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

// component
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import LottieComponent from '../Components/LottieComponent'

// Redux
import UserActions from '../Redux/UserRedux'
import AuthActions from '../Redux/AuthRedux'
import MembershipActions from '../Redux/MembershipRedux'
import LoginMemberActions from '../Redux/LoginMembershipRedux'

// Styles
import styled from 'styled-components'

class PasskeyVerification extends Component {
  static navigationOptions = {
    header: null
  }

  constructor (props) {
    super(props)
    let day = '1'
    let month = '1'
    let year = dayjs().format('YYYY') - 25
    let route = props?.route?.params?.route ?? ('route')
    if (props.user.user && !isEmpty(props.user.user.birth_date) && dayjs(props.user.birth_date).format('D') !== 'Invalid date') {
      day = dayjs(props.user.user.birth_date, 'YYYY-MM-DD', false).format('D')
      month = dayjs(props.user.user.birth_date, 'YYYY-MM-DD', false).format('M')
      year = dayjs(props.user.user.birth_date, 'YYYY-MM-DD', false).format('YYYY')
    }
    this.state = {
      user: (props.user.user) ? props.user.user : '',
      name: `${get(props.user, 'user.first_name', '')} ${get(props.user, 'user.last_name', '')}`,
      phone: (props.user.user) ? props.user.user.phone : '',
      email: (props.user.user) ? props.user.user.email : '',
      gender: (props.user.user && props.user.user.gender) ? props.user.user.gender : 'male',
      day: day || '1',
      month: month || '1',
      year: year || '1970',
      groupAhi: (props.register.aceSuccess && props.register.aceSuccess.groups && props.register.aceSuccess.groups.AHI) ? props.register.aceSuccess.groups.AHI : '',
      groupHci: (props.register.aceSuccess && props.register.aceSuccess.groups && props.register.aceSuccess.groups.HCI) ? props.register.aceSuccess.groups.HCI : '',
      groupTgi: (props.register.aceSuccess && props.register.aceSuccess.groups && props.register.aceSuccess.groups.TGI) ? props.register.aceSuccess.groups.TGI : '',
      passAhi: '',
      passHci: '',
      route: route
    }
  }

  componentDidUpdate () {
    const { route } = this.state
    if (this.props.loginMember.navigation === 'MemberUpgrade') {
      this.props.navigation.navigate('MemberUpgrade', { newMember: 'Pendaftaran Member Ace berhasil', route })
      this.props.loginReset()
    }
  }

  componentWillUnmount () {
    this.props.membershipInit()
    this.props.authInit()
    this.props.userInit()
  }

  componentWillReceiveProps (newProps) {
    const { user: users, auth, membership } = newProps
    const { user } = users
    if (!users.fetching && !membership.fetching && users.err === null && auth.err === null && membership.err === null) {
      let day = '1'
      let month = '1'
      let year = dayjs().format('YYYY') - 25
      if (user && user.birth_date !== null && dayjs(user.birth_date).format('D') !== 'Invalid date') {
        day = dayjs(newProps.user.user.birth_date, 'YYYY-MM-DD', false).format('D')
        month = dayjs(newProps.user.user.birth_date, 'YYYY-MM-DD', false).format('M')
        year = dayjs(newProps.user.user.birth_date, 'YYYY-MM-DD', false).format('YYYY')
      }
      let gender = 'male'
      if (user && user.gender !== null) {
        gender = user.gender
      }

      if (user) {
        this.setState({
          user,
          name: user.first_name + ' ' + user.last_name,
          phone: user.phone,
          email: user.email,
          gender: gender,
          day: day,
          month: month,
          year: year
        })
      }
    }
  }

  handleSubmit = () => {
    const { user, name, email, phone, day, month, year, gender, groupAhi, groupHci, groupTgi, passAhi, passHci, route } = this.state
    let companyID = ''
    let memberID = ''
    let memberPass = ''
    let firstName = name.trim()
    let lastName = ''
    let birthDate = year + '-' + month + '-' + day
    let splitName = name.trim().split(/ (.+)/, 2)
    if (splitName.length > 1) {
      firstName = splitName[0]
      lastName = splitName[1]
    }
    let group = {}
    let oldGroup = {}
    if (user && user.group) {
      group = { ...user.group }
      oldGroup = { ...user.group }
      if (!oldGroup['AHI']) oldGroup['AHI'] = ''
      if (!oldGroup['HCI']) oldGroup['HCI'] = ''
      if (!oldGroup['TGI']) oldGroup['TGI'] = ''
    }
    group['AHI'] = groupAhi
    group['HCI'] = groupHci
    group['TGI'] = groupTgi
    if (route === 'AHI') {
      companyID = 'AHI'
      memberID = groupAhi
      memberPass = passAhi
    } else if (route === 'HCI') {
      companyID = 'HCI'
      memberID = groupHci
      memberPass = passHci
    }
    let newUser = { ...user, group, oldGroup }
    let newMembership = { company_id: companyID, member_id: memberID, member_pass: memberPass }
    newUser['first_name'] = firstName
    newUser['last_name'] = lastName
    newUser['birth_date'] = birthDate
    newUser['gender'] = gender
    newUser['email'] = email
    newUser['phone'] = phone

    if (route === 'TGI') {
      this.props.updateUserData({ user: newUser })
    } else {
      this.props.retrieveMembership(newMembership, newUser)
      this.props.loginAce('requestToMemberUpgrade')
    }
  }

  render () {
    const { user, membership, auth, loginMember } = this.props
    const { groupAhi, groupHci, groupTgi, passAhi, passHci, route } = this.state
    let pageName = 'Verifikasi Passkey'
    return (
      <Container>
        <HeaderSearchComponent back pageName={pageName} navigation={this.props.navigation} />
        <ScrollView keyboardShouldPersistTaps='always'>
          <ContentContainer>
            {(user.fetching || membership.fetching)
              ? <LottieComponent />
              : (user.err !== null)
                ? (
                  <ErrorMessageBox>
                    <Text style={{ color: '#a94442', fontFamily: 'Quicksand-Regular' }}>{user.err}</Text>
                  </ErrorMessageBox>
                )
                : (auth.err !== null)
                  ? (
                    <ErrorMessageBox>
                      <Text style={{ color: '#a94442' }}>{auth.err}</Text>
                    </ErrorMessageBox>
                  )
                  : (membership.err !== null)
                    ? (
                      <ErrorMessageBox>
                        <Text style={{ color: '#a94442' }}>{membership.err}</Text>
                      </ErrorMessageBox>
                    )
                    : null
            }
            {(route === 'AHI')
              ? (
                <View>
                  <FormS style={{ flexDirection: 'row' }}>
                    <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} color={'#D4DCE6'} name='credit-card' size={18} />
                    <Input autoCapitalize='characters' editable={false} maxLength={10} value={groupAhi} placeholderTextColor='#b2bec3' placeholder='ID Ace' />
                  </FormS>
                  <FormS style={{ flexDirection: 'row' }}>
                    <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} color={'#D4DCE6'} name='lock' size={18} />
                    <Input autoCapitalize='none'
                      selectionColor='rgba(242, 101, 37, 1)'
                      keyboardType='numeric'
                      style={{ flexGrow: 95, height: 40 }} maxLength={6} value={passAhi} onChangeText={(passAhi) => this.setState({ passAhi })} placeholder='Passkey' placeholderTextColor='#b2bec3' secureTextEntry />
                  </FormS>
                  <Text style={{ fontFamily: 'Quicksand-Bold', color: '#8f919c', marginLeft: 10, marginVertical: 10 }}>
                    Masukkan Passkey yang telah diberikan melalui SMS
                  </Text>
                </View>
              )
              : null
            }
            {(route === 'HCI')
              ? (
                <View>
                  <FormS style={{ flexDirection: 'row' }}>
                    <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} color={'#D4DCE6'} name='credit-card' size={18} />
                    <Input autoCapitalize='characters' maxLength={10} value={groupHci} onChangeText={(groupHci) => this.setState({ groupHci })} placeholderTextColor='#b2bec3' placeholder='ID Informa' />
                  </FormS>
                  <FormS style={{ flexDirection: 'row' }}>
                    <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} color={'#D4DCE6'} name='lock' size={18} />
                    <Input autoCapitalize='none'
                      selectionColor='rgba(242, 101, 37, 1)'
                      keyboardType='numeric'
                      style={{ flexGrow: 95, height: 40 }} maxLength={6} value={passHci} onChangeText={(passHci) => this.setState({ passHci })} placeholder='Passkey' placeholderTextColor='#b2bec3' secureTextEntry />
                  </FormS>
                </View>
              )
              : null
            }
            {(route === 'TGI')
              ? (
                <View>
                  <FormS style={{ flexDirection: 'row' }}>
                    <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} color={'#D4DCE6'} name='credit-card' size={18} />
                    <Input autoCapitalize='characters' maxLength={10} value={groupTgi} onChangeText={(groupTgi) => this.setState({ groupTgi })} placeholderTextColor='#b2bec3' placeholder='ID Smile Club' />
                  </FormS>
                </View>
              )
              : null
            }
            <PaddingVerticalXS>
              <ButtonPrimary onPress={() => this.handleSubmit(this.props)} disable={loginMember.fetching}>
                {loginMember.fetching ? (
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <LottieComponent buttonBlueLoading style={{ height: 25, width: 30 }} />
                  </View>
                ) : (
                  <ButtonPrimaryText>Simpan</ButtonPrimaryText>
                )}
              </ButtonPrimary>
            </PaddingVerticalXS>
          </ContentContainer>
        </ScrollView>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  auth: state.auth,
  membership: state.membership,
  register: state.register,
  loginMember: state.loginMember
})

const dispatchToProps = (dispatch) => ({
  updateUserData: (user) => dispatch(UserActions.userUpdate(user)),
  userInit: () => dispatch(UserActions.userInit()),
  authInit: () => dispatch(AuthActions.authInit()),
  retrieveMembership: (membership, user) => dispatch(MembershipActions.retrieveMembership(membership, user)),
  membershipInit: () => dispatch(MembershipActions.membershipInit()),
  loginAce: (params) => dispatch(LoginMemberActions.loginMemberRequest(params)),
  loginReset: () => dispatch(LoginMemberActions.loginReset())
})

export default connect(mapStateToProps, dispatchToProps)(PasskeyVerification)

const Container = styled.View`
  flex: 1;
  backgroundColor: white;
`
const ContentContainer = styled.View`
  flexDirection: column;
  padding: 10px;
`
const ErrorMessageBox = styled.View`
  borderWidth: 1; 
  borderColor: #ebccd1;
  backgroundColor: #f2dede;
  padding: 15px;
  borderRadius: 4px;
  marginBottom: 20px;
`
const FormS = styled.View`
  border: 1px #e5e9f2 solid;
  padding: 0px;
  border-radius: 3px;
  margin-top: 5px;
  margin-bottom: 10px;
`
const PaddingVerticalXS = styled.View`
  paddingVertical : 10
`
const ButtonPrimary = styled.TouchableOpacity`
  paddingTop: 10;
  paddingBottom: 10;
  paddingRight: 20;
  paddingLeft: 20;
  backgroundColor: #F26525;
  borderRadius: 3;
`
const ButtonPrimaryText = styled.Text`
  color: white;
  fontSize: 16;
  textAlign: center;
  font-family:Quicksand-Bold;
`
const Input = styled.TextInput`
  text-decoration-color: white;
  color: #757885; 
  flex: 1;
  height: 40;
`
