import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Keyboard, Linking, Platform } from 'react-native'
import { Picker } from '@react-native-community/picker'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import CountDown from 'react-native-countdown-component'
import isEmpty from 'lodash/isEmpty'
import dayjs from 'dayjs'

// Component
import EasyModal from './EasyModal'

// Redux
import OtpActions from '../Redux/OtpRedux'
import RegisterActions from '../Redux/RegisterRedux'
import MemberRegActions from '../Redux/MemberRegistrationRedux'

import styled from 'styled-components'

class MemberRegistrationForm extends Component {
  constructor (props) {
    super(props)
    let route = props?.route?.params?.route ?? ('route')
    let day = '1'
    let month = '1'
    let year = '1996' // dayjs().format('YYYY') - 25
    if (props.user.user && !isEmpty(props.user.user.birth_date) && dayjs(props.user.birth_date).format('D') !== 'Invalid date') {
      day = dayjs(props.user.user.birth_date, 'YYYY-MM-DD', false).format('D')
      month = dayjs(props.user.user.birth_date, 'YYYY-MM-DD', false).format('M')
      year = dayjs(props.user.user.birth_date, 'YYYY-MM-DD', false).format('YYYY')
    }
    this.state = {
      route: route,
      phone: props.user.user.phone || '',
      isChecked: false,
      sendOtp: {
        timer: 0,
        active: false
      },
      day: day || '1',
      month: month || '1',
      year: year || '1996',
      otp: ''
    }
  }

  componentDidUpdate () {
    const { otp } = this.props
    if (otp.successVerify && !otp.errVerify) {
      this.props.resetStatus()
      this.kirimOTP()
    }
    if (otp.success) {
      this.props.resetStatus()
      this.setState({ sendOtp: { timer: 90, active: true } })
    }
  }

  changeDate () {
    const { day, month, year } = this.state
    this.props.onChangeDate(year + '-' + month + '-' + day)
  }

  changeOtp (otp) {
    this.setState({ otp: otp })
    this.props.onChangeOtp(otp)
  }

  validateFulfilled () {
    const { user } = this.props.user
    const { isChecked, otp } = this.state
    if (otp && isChecked) {
      this.props.fulfilledTrue()
    } else if (user.birth_date && otp && isChecked) {
      this.props.fulfilledTrue()
    } else {
      this.props.fulfilledFalse()
    }
  }

  verifyPhone = () => {
    this.props.resetStatus()
    this.props.registerReset()
    let params = {
      phone: this.state.phone,
      company_id: 'AHI'
    }
    this.props.verifyPhone(params)
  }

  kirimOTP = () => {
    // this.props.resetStatus()
    this.props.registerReset()
    let params = {
      phone: this.state.phone
    }
    this.props.getOtp(params)
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
            onValueChange={(dayValue) => {
              this.setState({ day: dayValue })
              this.changeDate()
            }}
            style={{ height: 40 }}
          >
            {days.map((dayInDays, index) => (
              <Picker.Item label={dayInDays} value={dayInDays} key={`days${dayInDays}${index}`} />
            ))}
          </Picker>
        </DayNumber>
        <MonthNumber>
          <Picker
            selectedValue={month}
            onValueChange={(monthValue) => {
              this.setState({ month: monthValue })
              this.changeDate()
            }}
            style={{ height: 40 }}
          >
            {months.map((monthInMonths, index) => (
              <Picker.Item label={monthInMonths.text} value={monthInMonths.value} key={`month${monthInMonths.value}${index}`} />
            ))}
          </Picker>
        </MonthNumber>
        <YearNumber>
          <Picker
            selectedValue={year}
            onValueChange={(yearValue) => {
              this.setState({ year: yearValue })
              this.changeDate()
            }}
            style={{ height: 40 }}
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
    const { otp } = this.props.memberRegistration
    const { sendOtp, isChecked, day, month, year, phone } = this.state
    const { user } = this.props.user

    // if (user.birth_date) {
    //   birthDateInput = (
    //     <Input value={user.birth_date} editable={false} placeholderTextColor='#b2bec3' placeholder='Tanggal Lahir' />
    //   )
    // } else {
    //   birthDateInput = (
    //     <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
    //       <Input ref={(input) => { this.dateInput = input }}
    //         onSubmitEditing={() => {
    //           if (month && year) {
    //             this.validateFulfilled()
    //           }
    //           this.monthInput.focus()
    //         }}
    //         value={date}
    //         onChangeText={(text) => {
    //           this.props.changeDate(text)
    //           if (text.length === 2) {
    //             if (month && year) {
    //               this.validateFulfilled()
    //             }
    //             this.monthInput.focus()
    //           }
    //         }}
    //         blurOnSubmit={false}
    //         maxLength={2}
    //         keyboardType='number-pad'
    //         placeholderTextColor='#b2bec3'
    //         placeholder='Tanggal Lahir DD' />
    //       <Text style={{ color: '#757885' }}>/</Text>
    //       <Input ref={(input) => { this.monthInput = input }}
    //         onSubmitEditing={() => {
    //           if (date && year) {
    //             this.validateFulfilled()
    //           }
    //           this.yearInput.focus()
    //         }}
    //         onChangeText={(text) => {
    //           this.props.changeMonth(text)
    //           if (text.length === 2) {
    //             if (date && year) {
    //               this.validateFulfilled()
    //             }
    //             this.yearInput.focus()
    //           }
    //         }}
    //         blurOnSubmit={false}
    //         value={month}
    //         maxLength={2}
    //         keyboardType='number-pad'
    //         placeholderTextColor='#b2bec3'
    //         placeholder='MM' />
    //       <Text style={{ color: '#757885' }}>/</Text>
    //       <Input ref={(input) => { this.yearInput = input }}
    //         blurOnSubmit={false}
    //         onSubmitEditing={() => {
    //           Keyboard.dismiss()
    //           this.validateFulfilled()
    //         }}
    //         onChangeText={async (text) => {
    //           await this.props.changeYear(text)
    //           if (text.length === 4) {
    //             Keyboard.dismiss()
    //             this.validateFulfilled()
    //           }
    //         }}
    //         value={year}
    //         maxLength={4}
    //         keyboardType='number-pad'
    //         placeholderTextColor='#b2bec3'
    //         placeholder='YYYY' />
    //     </View>
    //   )
    // }
    let kirimOtpBtn

    if (sendOtp.active && !this.props.otp.err) {
      kirimOtpBtn = (
        <CountDown
          until={sendOtp.timer}
          size={16}
          onFinish={() => this.setState({ sendOtp: { timer: 0, active: false } })}
          timeToShow={['M', 'S']}
          style={{ justifyContent: 'center', alignItems: 'center', height: 16 }}
          digitStyle={{ backgroundColor: 'transparent', marginHorizontal: -3, maxHeight: 16 }}
          digitTxtStyle={{ color: '#868890' }}
          timeLabels={{ m: null, s: null }}
          separatorStyle={{ color: '#868890' }}
          showSeparator
        />
      )
    } else {
      kirimOtpBtn = (
        <ButtonPrimaryText>Kirim OTP</ButtonPrimaryText>
      )
    }
    return (
      <View style={{ flex: 1 }}>
        {/* Name */}
        <FormS style={{ flexDirection: 'row' }}>
          <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} color={'#bdc0c8'} name='account-outline' size={18} />
          <Input value={`${user.first_name + ' ' + user.last_name}`} editable={false} autoCapitalize='words' placeholderTextColor='#b2bec3' placeholder='Nama' />
        </FormS>
        {/* Email */}
        <FormS style={{ flexDirection: 'row' }}>
          <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} color={'#bdc0c8'} name='email-outline' size={18} />
          <Input value={user.email} editable={false} autoCapitalize='none' style={{ flexGrow: 95, height: 40 }} placeholder='Email' placeholderTextColor='#b2bec3' />
        </FormS>
        {/* Phone */}
        <FormS style={{ flexDirection: 'row' }}>
          <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} color={'#bdc0c8'} name='phone-outline' size={18} />
          <Input value={phone} keyboardType='number-pad' editable={false} placeholderTextColor='#b2bec3' placeholder='No. Handphone' />
        </FormS>
        {/* Date */}
        {user.birth_date ? (
          <FormS style={{ flexDirection: 'row', backgroundColor: user.birth_date ? '#f0f2f7' : 'white' }}>
            <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} color={'#bdc0c8'} name='calendar-month-outline' size={18} />
            <Input value={dayjs(user.birth_date).format('DD-MM-YYYY')} editable={false} placeholderTextColor='#b2bec3' placeholder='Tanggal Lahir' />
          </FormS>
        ) : (
          <View>
            <Text style={{ color: '#bdbec6' }}>Tanggal Lahir</Text>
            {
              Platform.OS === 'ios'
                ? <ItemContainer>
                  <TouchableOpacity style={{ height: 40, justifyContent: 'center' }} onPress={() => this.refs.pick.setModal()}>
                    <Text style={{ color: '#757885' }}> {day}/{month}/{year} </Text>
                  </TouchableOpacity>
                </ItemContainer>
                : this.renderPickDate()
            }
          </View>

        )}
        { !this.props.memberRegistration.isValidatedDate ? <Text style={{ color: 'red', fontFamily: 'Quicksand-Medium', fontSize: 10, marginBottom: 5 }}>Tanggal tidak valid</Text> : null}
        {/* OTP */}
        <View style={{ flexDirection: 'row' }}>
          <FormS style={{ backgroundColor: 'white', flexDirection: 'row', flex: 3 }}>
            <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} color={'#bdc0c8'} name='cellphone-iphone' size={18} />
            <Input value={otp}
              autoCapitalize='characters'
              onChangeText={(text) => {
                this.changeOtp(text)
                if (text.length === 6) {
                  Keyboard.dismiss()
                  this.validateFulfilled()
                }
              }}
              keyboardType='number-pad'
              maxLength={6}
              placeholderTextColor='#b2bec3'
              placeholder='Kode OTP' />
          </FormS>
          <ButtonPrimary onPress={() => this.verifyPhone()} disabled={sendOtp.active || this.props.otp.fetchingVerify} style={{ marginLeft: 13, backgroundColor: sendOtp.active && !this.props.otp.err ? '#f0f2f7' : '#F26525' }}>
            {kirimOtpBtn}
          </ButtonPrimary>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={{ justifyContent: 'center', marginRight: 10 }}
            onPress={() => {
              this.setState(isChecked ? { isChecked: false } : { isChecked: true }, () => {
                this.validateFulfilled()
              })
            }}>
            <Icon color={isChecked ? '#008ccf' : '#D4DCE6'} name={isChecked ? 'checkbox-marked' : 'checkbox-blank-outline'} size={20} />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Quicksand-Bold', color: '#bdbec6', flex: 1 }}>
            Saya telah membaca dan setuju dengan
            <Text onPress={() => Linking.openURL('https://www.acehardware.co.id/membership-terms-and-condition')} style={{ color: '#F26525' }}> syarat dan ketentuan</Text> yang berlaku
          </Text>
        </View>
        <EasyModal ref='pick' size={45}>
          <View style={{ paddingHorizontal: 20, paddingTop: 20, justifyContent: 'space-between', flexDirection: 'column' }}>
            {this.renderPickDate()}
            <TouchableOpacity onPress={() => this.refs.pick.setModal()} style={{ marginBottom: 0, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#F26525', borderRadius: 3 }}>
              <Text style={{ color: 'white', fontSize: 16, textAlign: 'center', fontFamily: 'Quicksand-Medium' }}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </EasyModal>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  otp: state.otp,
  memberRegistration: state.memberRegistration
})

const dispatchToProps = (dispatch) => ({
  registerReset: () => dispatch(RegisterActions.registerReset()),
  resetStatus: () => dispatch(OtpActions.otpResetStatus()),
  getOtp: (params) => dispatch(OtpActions.otpAceRequest(params)),
  fulfilledTrue: () => dispatch(MemberRegActions.memberRegFulfilledTrue()),
  fulfilledFalse: () => dispatch(MemberRegActions.memberRegFulfilledFalse()),
  changeOtp: (params) => dispatch(MemberRegActions.memberRegChangeOtp(params)),
  verifyPhone: (params) => dispatch(OtpActions.otpVerifyPhoneRequest(params))
})

export default connect(mapStateToProps, dispatchToProps)(MemberRegistrationForm)

const FormS = styled.View`
  backgroundColor: #f0f2f7;
  border: 1px #e5e9f2 solid;
  padding: 0px;
  border-radius: 3px;
  margin-top: 5px;
  margin-bottom: 10px;
`
const Input = styled.TextInput`
  text-decoration-color: white;
  color: #757885; 
  flex: 1;
  height: 40;
`
const ButtonPrimary = styled.TouchableOpacity`
  paddingTop: 10;
  paddingBottom: 10;
  paddingRight: 20;
  paddingLeft: 20;
  backgroundColor: #F26525;
  borderRadius: 3;
  margin-top: 5px;
  margin-bottom: 10px;
`
const ButtonPrimaryText = styled.Text`
  color: white;
  fontSize: 14;
  textAlign: center;
  font-family:Quicksand-Bold;
`
const ItemContainer = styled.View`
  borderColor: #E0E6ED;
  borderWidth: 1;
  borderRadius: 3;
  marginBottom: 10;
  padding-left: 10px;
`
const ItemContainerRow = styled.View`
  paddingTop: 10;
  paddingBottom: 10;
  flexDirection: row;
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
