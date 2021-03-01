import React, { Component } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native'
import { Picker } from '@react-native-community/picker'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import dayjs from 'dayjs'
import Toast from 'react-native-easy-toast'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

// component
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import EasyModal from '../Components/EasyModal'

// Redux
import UserActions from '../Redux/UserRedux'
import AuthActions from '../Redux/AuthRedux'

// Styles
import styled from 'styled-components'

class EditProfile extends Component {
  static navigationOptions = {
    header: null
  }

  constructor (props) {
    super(props)
    let day = '1'
    let month = '1'
    let year = dayjs().format('YYYY') - 25

    if (props.user.user && !isEmpty(props.user.user.birth_date) && dayjs(props.user.user.birth_date).format('D') !== 'Invalid date') {
      day = dayjs(props.user.user.birth_date, 'YYYY-M-D', false).format('D')
      console.log(day, '<<<')
      month = dayjs(props.user.user.birth_date, 'YYYY-M-D', false).format('M')
      year = dayjs(props.user.user.birth_date, 'YYYY-M-D', false).format('YYYY')
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
      submitAction: false,
      password: '',
      confirmPassword: '',
      groupAhi: (props.user.user && props.user.user.group && props.user.user.group.AHI) ? props.user.user.group.AHI : '',
      groupHci: (props.user.user && props.user.user.group && props.user.user.group.HCI) ? props.user.user.group.HCI : '',
      groupTgi: (props.user.user && props.user.user.group && props.user.user.group.TGI) ? props.user.user.group.TGI : '',
      changePassword: false
    }
  }

  componentWillReceiveProps (newProps) {
    const { auth } = newProps
    const user = newProps.user.user

    if (!newProps.user.fetching && newProps.user.err === null && auth.err === null) {
      let day = '1'
      let month = '1'
      let year = dayjs().format('YYYY') - 25
      if (user && user.birth_date !== null && dayjs(user.birth_date).format('D') !== 'Invalid date') {
        day = dayjs(user.birth_date, 'YYYY-M-D', false).format('D')
        month = dayjs(user.birth_date, 'YYYY-M-D', false).format('M')
        year = dayjs(user.birth_date, 'YYYY-M-D', false).format('YYYY')
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
          year: year,
          groupAhi: (user.group && user.group.AHI) ? user.group.AHI : '',
          groupHci: (user.group && user.group.HCI) ? user.group.HCI : '',
          groupTgi: (user.group && user.group.TGI) ? user.group.TGI : ''
        })
      }
      this.handleProfileFormClose()
    }
  }

  handleProfileFormClose = () => {
    this.setState({ password: '', confirmPassword: '', submitAction: false }, () => {
      this.props.authInit()
      this.props.userInit()
    })
    // this.props.navigation.goBack()
    this.props.navigation.navigate('Homepage', {
      screen: 'Profil'
    })
  }

  handleSubmit = () => {
    const { user, name, email, phone, day, month, year, gender, password, confirmPassword, groupAhi, groupHci, groupTgi } = this.state
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
    let newUser = { ...user, group, oldGroup }
    newUser['first_name'] = firstName
    newUser['last_name'] = lastName
    newUser['birth_date'] = birthDate
    newUser['gender'] = gender
    newUser['email'] = email
    newUser['phone'] = phone

    this.props.updateUserData({ user: newUser })

    if (password !== '' || confirmPassword !== '') {
      this.props.changePassword({
        password,
        confirmPassword
      })
    } else {
      this.props.authInit()
    }
    this.setState({ submitAction: true })
  }

  toggleChangePassword = () => {
    const { changePassword } = this.state
    if (changePassword) {
      this.setState({ changePassword: false })
    } else {
      this.setState({ changePassword: true })
    }
  }

  changePhoneNumber = (phone) => {
    let newPhone = phone.replace('+', '')
    newPhone.replace(/^62/, '0')
    this.setState({ phone: newPhone })
  }

  renderPickDate () {
    const { day, month, year } = this.state
    let days = []
    let i
    let daysInMonth = dayjs(`${year}-${month}`, 'YYYY-M').daysInMonth()
    for (i = 1; i <= daysInMonth; i++) {
      days.push(String(i))
    }

    var months = []
    for (i = 0; i < 12; i++) {
      let monthText = dayjs().month(i).format('MMMM')
      months.push({ value: String(i + 1), text: monthText })
    }

    var years = []
    for (i = dayjs().subtract(100, 'years').format('YYYY'); i <= dayjs().subtract(5, 'years').format('YYYY'); i++) {
      years.push(String(i))
    }
    return (
      <ItemContainerRow>
        <DayNumber>
          <Picker
            selectedValue={day}
            onValueChange={(dayValue) => this.setState({ day: dayValue })}
          >
            {days.map((dayInDays, index) => (
              <Picker.Item label={dayInDays} value={dayInDays} key={`days${dayInDays}${index}`} />
            ))}
          </Picker>
        </DayNumber>
        <MonthNumber>
          <Picker
            selectedValue={month}
            onValueChange={(monthValue) => this.setState({ month: monthValue })}
          >
            {months.map((monthInMonths, index) => (
              <Picker.Item label={monthInMonths.text} value={monthInMonths.value} key={`month${monthInMonths.value}${index}`} />
            ))}
          </Picker>
        </MonthNumber>
        <YearNumber>
          <Picker
            selectedValue={year}
            onValueChange={(yearValue) => this.setState({ year: yearValue })}
          >
            {years.map((yearInYears, index) => (
              <Picker.Item label={yearInYears} value={yearInYears} key={`year${yearInYears}${index}`} />
            ))}
          </Picker>
        </YearNumber>
      </ItemContainerRow>
    )
  }

  render () {
    const { user, auth } = this.props
    const { name, email, day, month, year, gender, changePassword, password, confirmPassword } = this.state
    if (user.user === null) {
      return null
    }
    return (
      <Container>
        <HeaderSearchComponent back pageName={'Profil Saya'} leftAction={this.handleProfileFormClose.bind(this)} navigation={this.props.navigation} />
        <ScrollView keyboardShouldPersistTaps='always'>
          <ContentContainer>
            {(user.err !== null)
              ? (
                <ErrorMessageBox>
                  <Text style={{ color: '#a94442', fontFamily: 'Quicksand-Regular' }}>{user.err}</Text>
                </ErrorMessageBox>
              )
              : null
            }
            {(auth.err !== null)
              ? (
                <ErrorMessageBox>
                  <Text style={{ color: '#a94442' }}>{auth.err}</Text>
                </ErrorMessageBox>
              )
              : null
            }
            <FormS style={{ flexDirection: 'row' }}>
              <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} color={'#D4DCE6'} name='account' size={18} />
              <Input value={name} maxLength={50} underlineColorAndroid='transparent' onChangeText={(name) => this.setState({ name })} placeholderTextColor='#b2bec3' placeholder='Name Penerima' />
            </FormS>
            <FormS style={{ flexDirection: 'row', backgroundColor: '#F9FAFC' }}>
              <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} color={'#D4DCE6'} name='email' size={18} />
              <Input value={email} underlineColorAndroid='transparent' editable={false} />
            </FormS>
            {/* <FormS style={{ flexDirection: 'row' }}>
              <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} color={'#D4DCE6'} name='phone' size={18} />
              <Input value={phone} underlineColorAndroid='transparent' onChangeText={(phone) => this.changePhoneNumber(phone)} placeholder='No Telepon' maxLength={15} keyboardType='numeric' returnKeyType='done' />
            </FormS> */}
            {Platform.OS === 'ios'
              ? <ItemContainer>
                <TouchableOpacity style={{ height: 40, justifyContent: 'center' }} onPress={() => this.refs.pick.setModal()}>
                  <Text style={{ color: '#757885' }}> {day}/{month}/{year} </Text>
                </TouchableOpacity>
              </ItemContainer>
              : this.renderPickDate()
            }
            {(gender === 'male')
              ? (
                <ItemContainerRow>
                  <RadioButton >
                    <SelectedOuterView >
                      <SelectedInnerView />
                    </SelectedOuterView>
                    <Text style={{ fontFamily: 'Quicksand-Regular' }}>Laki-laki</Text>
                  </RadioButton>
                  <RadioButton onPress={() => this.setState({ gender: 'female' })} >
                    <NotSelected />
                    <Text style={{ fontFamily: 'Quicksand-Regular' }}>Perempuan</Text>
                  </RadioButton>
                </ItemContainerRow>
              )
              : (
                <ItemContainerRow >
                  <RadioButton onPress={() => this.setState({ gender: 'male' })} >
                    <NotSelected />
                    <Text style={{ fontFamily: 'Quicksand-Regular' }}>Laki-laki</Text>
                  </RadioButton>
                  <RadioButton >
                    <SelectedOuterView >
                      <SelectedInnerView />
                    </SelectedOuterView>
                    <Text style={{ fontFamily: 'Quicksand-Regular' }}>Perempuan</Text>
                  </RadioButton>
                </ItemContainerRow>
              )
            }
            {/* <View style={{ marginBottom: 20, marginTop: 20 }}>
              <TouchableOpacity onPress={() => this.toggleChangePassword()} disabled={user.user.is_email_verified !== '10'}>
                <Text style={{ color: '#F26525', fontSize: 14, fontFamily: 'Quicksand-Regular' }}>Ubah kata sandi?</Text>
              </TouchableOpacity>
            </View> */}
            {/* {(user.user.is_email_verified !== '10') &&
              <Error>Lakukan verifikasi email terlebih dahulu, untuk mengubah No Handphone</Error>
            } */}
            {(changePassword)
              ? (
                <View style={{ flexDirection: 'column' }}>
                  <FormS style={{ flexDirection: 'row' }}>
                    <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} color={'#D4DCE6'} name='lock' size={18} />
                    <Input value={password} onChangeText={(password) => this.setState({ password })} placeholder='Kata sandi baru' secureTextEntry underlineColorAndroid='transparent' />
                  </FormS>
                  <FormS style={{ flexDirection: 'row' }}>
                    <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} color={'#D4DCE6'} name='lock' size={18} />
                    <Input value={confirmPassword} onChangeText={(confirmPassword) => this.setState({ confirmPassword })} placeholderTextColor='#b2bec3' placeholder='Ulangi kata sandi baru' secureTextEntry underlineColorAndroid='transparent' />
                  </FormS>
                </View>
              )
              : null
            }
            <PaddingVerticalXS>
              <ButtonPrimary onPress={() => this.handleSubmit()}>
                <ButtonPrimaryText>Simpan</ButtonPrimaryText>
              </ButtonPrimary>
            </PaddingVerticalXS>
          </ContentContainer>
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
        <EasyModal ref='pick' size={45}>
          <View style={{ paddingHorizontal: 20, paddingTop: 20, justifyContent: 'space-between', flexDirection: 'column' }}>
            {this.renderPickDate()}
            <TouchableOpacity onPress={() => this.refs.pick.setModal()} style={{ marginBottom: 0, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#F26525', borderRadius: 3 }}>
              <Text style={{ color: 'white', fontSize: 16, textAlign: 'center', fontFamily: 'Quicksand-Medium' }}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </EasyModal>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  auth: state.auth
})

const dispatchToProps = (dispatch) => ({
  updateUserData: (user) => dispatch(UserActions.userUpdate(user)),
  changePassword: (data) => dispatch(AuthActions.authChangePasswordRequest(data)),
  userInit: () => dispatch(UserActions.userInit()),
  authInit: () => dispatch(AuthActions.authInit())
})

export default connect(mapStateToProps, dispatchToProps)(EditProfile)

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
const ItemContainerRow = styled.View`
  paddingTop: 10;
  paddingBottom: 10;
  flexDirection: row;
`
const ItemContainer = styled.View`
  borderColor: #E0E6ED;
  borderWidth: 1;
  borderRadius: 3;
  marginBottom: 10;
  padding-left: 10px;
`

const DayNumber = styled.View`
  borderColor:#E0E6ED;
  borderWidth:1;
  flexGrow:13;
  borderRadius:3;
  marginRight:3;
`
const MonthNumber = styled(DayNumber)`
  flexGrow:20;
`
const YearNumber = styled(DayNumber)`
  flexGrow:15;
`
const RadioButton = styled.TouchableOpacity`
  flexDirection: row;
  flexGrow: 1;
`
const SelectedOuterView = styled.View`
  width: 24;
  height: 24;
  borderRadius: 25;
  borderWidth: 1;
  borderColor: #008CCF;
  backgroundColor: white;
  justifyContent: center;
  alignItems: center;
  marginRight: 10;
`

const SelectedInnerView = styled.View`
  width: 15;
  height: 15;
  borderRadius: 25;
  backgroundColor: #008CCF;
`

const NotSelected = styled.View`
  width: 24;
  height: 24;
  borderRadius: 25;
  borderWidth: 2;
  borderColor: #E0E6ED;
  backgroundColor: white;
  marginRight: 10;
`

// const Error = styled.Text`
//   fontFamily: Quicksand-Regular;
//   fontSize: 12;
//   color: red;
//   marginTop: 10;
// `

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
