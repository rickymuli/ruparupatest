import React, { Component } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import dayjs from 'dayjs'

// component
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import LottieComponent from '../Components/LottieComponent'
import MemberRegistrationForm from '../Components/MemberRegistrationForm'
import ButtonPrimary from '../Components/ButtonPrimary'

// Redux
import OtpActions from '../Redux/OtpRedux'
import RegisterActions from '../Redux/RegisterRedux'
import MemberRegActions from '../Redux/MemberRegistrationRedux'

// Styles
import styled from 'styled-components'

class MemberRegistration extends Component {
  static navigationOptions = {
    header: null
  }

  constructor (props) {
    super(props)
    let route = props?.route?.params?.route ?? ('route')
    let day = '1'
    let month = '1'
    let year = dayjs().format('YYYY') - 25
    if (props.user.user && !isEmpty(props.user.user.birth_date) && dayjs(props.user.birth_date).format('D') !== 'Invalid date') {
      day = dayjs(props.user.user.birth_date, 'YYYY-MM-DD', false).format('D')
      month = dayjs(props.user.user.birth_date, 'YYYY-MM-DD', false).format('M')
      year = dayjs(props.user.user.birth_date, 'YYYY-MM-DD', false).format('YYYY')
    }
    this.state = {
      route: route,
      date: props.user.user.birth_date || year + '-' + month + '-' + day,
      otp: ''
    }
  }

  componentDidMount () {
    this.props.otpInit()
    this.props.resetStatus()
    this.props.resetState()
    this.props.registerReset()
  }

  componentDidUpdate () {
    const { route } = this.state
    const { register, navigation, registerReset } = this.props
    if (register.navigation) {
      navigation.navigate(register.navigation, { newMember: 'Pendaftaran Member Ace berhasil', route })
      registerReset()
    }
  }

  validateOtp = () => {
    const { otp } = this.state
    const { user } = this.props.user
    if (otp) {
      let params = {
        phone: user.phone,
        otp_number: otp,
        email: user.email,
        action: 'register'
      }
      this.props.validateOtp(params)
    } else {
      console.log('Isi OTP')
    }
  }

  batalBtn = () => {
    this.props.resetStatus()
    this.props.resetState()
    this.props.registerReset()
    this.props.navigation.navigate('Profil')
  }

  daftarMember = () => {
    this.props.resetStatus()
    const { date, otp } = this.state
    const { user } = this.props.user
    let name
    if (user.last_name) {
      name = `${user.first_name + ' ' + user.last_name}`
    } else {
      name = user.first_name
    }
    let params = {
      phone: user.phone,
      otp: otp,
      email: user.email,
      full_name: name,
      birth_date: user.birth_date ? user.birth_date : date
    }
    this.props.registerAce(params)
  }

  changeDate (date) {
    this.setState({ date: date })
  }

  changeOtp (otp) {
    this.setState({ otp: otp })
  }

  render () {
    const { route } = this.state
    const { register, memReg } = this.props
    let pageName = ''
    if (route === 'AHI') {
      pageName = 'Daftar Member Ace'
    }
    if (route === 'HCI') {
      pageName = 'Daftar Member ID Informa'
    }
    if (route === 'TGI') {
      pageName = 'Daftar Toys Kingdom'
    }
    let messageBox
    if (register.fetching || this.props.otp.fetchingAceValidate || this.props.otp.fetchingVerify) {
      messageBox = (
        <View style={{ height: 40 }}>
          <LottieComponent />
        </View>
      )
    } else if (register.err === 'invalid OTP' ||
        register.err === 'HP tidak ditemukan' ||
        register.err === 'Otp Number is required' ||
        register.err === 'Otp has to be 6 digits long' ||
        register.err === 'There is no row at position 0.' ||
        register.err === 'invalid OTP'
    ) {
      messageBox = (
        <ErrorMessageBox>
          <Text style={{ color: '#a94442' }}>Kode OTP salah</Text>
        </ErrorMessageBox>
      )
    } else if (register.err) {
      messageBox = (
        <ErrorMessageBox>
          <Text style={{ color: '#a94442' }}>{register.err}</Text>
        </ErrorMessageBox>
      )
    } else if (this.props.otp.errValidate) {
      messageBox = (
        <ErrorMessageBox>
          <Text style={{ color: '#a94442', fontFamily: 'Quicksand-Regular' }}>Kode OTP salah</Text>
        </ErrorMessageBox>
      )
    } else if (this.props.otp.successAce) {
      messageBox = (
        <SuccessMessageBox>
          <Text style={{ color: 'white', fontFamily: 'Quicksand-Regular' }}>Kode OTP berhasil dikirim</Text>
        </SuccessMessageBox>
      )
    } else {
      messageBox = null
    }
    if (this.props.otp.err) {
      messageBox = (
        <ErrorMessageBox>
          <Text style={{ color: '#a94442' }}>{this.props.otp.err}</Text>
        </ErrorMessageBox>
      )
    }
    return (
      <Container>
        <HeaderSearchComponent back pageName={pageName} navigation={this.props.navigation} />
        <ScrollView keyboardShouldPersistTaps='always' style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
          <ContentContainer>
            {messageBox}
            <MemberRegistrationForm onChangeDate={(date) => this.changeDate(date)} onChangeOtp={(otp) => this.changeOtp(otp)} />
          </ContentContainer>
        </ScrollView>
        <ButtonPrimary disabledTopBtn={!memReg.isFulfilled || (this.props.register.fetching || this.props.otp.fetchingAceValidate)}
          topBtnStyle={!memReg.isFulfilled ? { backgroundColor: '#f0f2f7' } : (this.props.register.fetching || this.props.otp.fetchingAceValidate) ? { backgroundColor: '#f0f2f7' } : null}
          topTextStyle={!memReg.isFulfilled ? { color: '#8d8f96' } : (this.props.register.fetching || this.props.otp.fetchingAceValidate) ? { color: '#8d8f96' } : null}
          topText={'Simpan'}
          onPressTopBtn={() => this.daftarMember()}
          botBtnStyle={{ backgroundColor: null }}
          botTextStyle={{ color: '#8d8f96' }}
          botText={'Batal'}
          onPressBotBtn={() => this.batalBtn()}
        />
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  otp: state.otp,
  register: state.register,
  memReg: state.memberRegistration,
  membership: state.membership
})

const dispatchToProps = (dispatch) => ({
  registerReset: () => dispatch(RegisterActions.registerReset()),
  getOtp: (params) => dispatch(OtpActions.otpAceRequest(params)),
  registerAce: (params) => dispatch(RegisterActions.registerAceRequest(params)),
  resetStatus: () => dispatch(OtpActions.otpResetStatus()),
  otpInit: () => dispatch(OtpActions.otpInit()),
  resetState: () => dispatch(MemberRegActions.memberRegResetState())
})
export default connect(mapStateToProps, dispatchToProps)(MemberRegistration)

const Container = styled.View`
  flex: 1;
  backgroundColor: white;
`
const ContentContainer = styled.View`
  flex: 1
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
const SuccessMessageBox = styled.View`
  borderWidth: 1; 
  borderColor: #ebccd1;
  backgroundColor: #049372;
  padding: 15px;
  borderRadius: 4px;
  marginBottom: 20px;
`
