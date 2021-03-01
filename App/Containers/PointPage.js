import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native'
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'
import config from '../../config'
import startCase from 'lodash/startCase'
import isEmpty from 'lodash/isEmpty'
import capitalize from 'lodash/capitalize'
import get from 'lodash/get'
import map from 'lodash/map'

// Styles
import styled from 'styled-components'
// Redux
import UserActions from '../Redux/UserRedux'
import OtpActions from '../Redux/OtpRedux'

// Components
import PointComponent from '../Components/PointComponent'
import RedeemPointList from '../Components/RedeemPointList'
import RedeemPointSuccess from '../Components/RedeemPointSuccess'
import HeaderSearchComponent from '../Components/HeaderSearchComponent'

const { width } = Dimensions.get('screen')
class PointPage extends Component {
  constructor (props) {
    super(props)
    this.otp = null
    this.state = {
      selected: 'ace',
      memberPinAhi: '',
      memberIdAhi: '',
      memberPinHci: '',
      memberIdHci: '',
      memberPinTgi: '',
      memberIdTgi: '',
      memberIdGeneral: '',
      memberPinGeneral: '',
      loginRedeemPoint: '',
      point: 0,
      balance: '',
      redeemVoucher: '',
      err: null,
      fetchingPoint: false,
      otpValidationAHI: false,
      otpValidationHCI: false,
      otpValidationTGI: false,
      translateToCode: {
        ace: 'AHI',
        informa: 'HCI',
        toyskingdom: 'TGI'
      }
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const { memberIdAhi, memberIdHci, memberIdTgi, err: error, translateToCode, selected } = prevState
    const { user, point, redeem, err } = nextProps
    // let otpValidation = prevState[`otpValidation${translateToCode[selected]}`]
    // if (get(otp.data, 'status') === 'valid' && !otpValidation) {
    //   return {
    //     [`otpValidation${translateToCode[selected]}`]: true
    //   }
    // }
    if (err && err !== error) return { err }
    let obj = { err: null }
    if (point && point.point !== prevState.point) {
      obj['point'] = point.point || 0
    }
    if (!user.fetching && user.user && user.user.group) {
      const { AHI, HCI, TGI } = user.user.group
      if (!isEmpty(AHI) && AHI !== memberIdAhi) obj['memberIdAhi'] = AHI
      if (!isEmpty(HCI) && HCI !== memberIdHci) obj['memberIdHci'] = HCI
      if (!isEmpty(TGI) && TGI !== memberIdTgi) obj['memberIdTgi'] = TGI
    }
    if (!user.fetchingPoint && point) obj['loginRedeemPoint'] = translateToCode[selected]
    if (!user.fetchingRedeem && redeem && redeem.voucher_code) obj['redeemVoucher'] = redeem.voucher_code
    return obj
  }

  componentWillUnmount () {
    this.props.initOtp()
    this.props.userInit()
    this.props.initPoint()
  }

  handleRedeem = (balance) => {
    const { loginRedeemPoint, memberPinGeneral, memberIdGeneral } = this.state
    const params = {
      company_id: loginRedeemPoint,
      member_pin: memberPinGeneral,
      member_id: memberIdGeneral,
      balance
    }
    this.props.redeemPoint({ params })
    this.setState({ balance })
  }

  handleSubmit = (memberPin, memberId) => {
    const { selected, translateToCode } = this.state
    this.setState({ memberPinGeneral: memberPin, memberIdGeneral: memberId, checkOtp: true })
    let params = {
      company_id: translateToCode[selected],
      member_pin: memberPin,
      member_id: (memberId !== '') ? memberId : ''
    }
    this.setState({
      [`memberPin${capitalize(translateToCode[selected])}`]: memberPin,
      [`memberId${capitalize(translateToCode[selected])}`]: memberId
    })
    if (isEmpty(memberPin) && isEmpty(memberId)) {
      this.logoutCard()
    }
    this.props.checkPoint({ params })
  }

  logoutCard = () => {
    this.setState({ loginRedeemPoint: '', otpValidation: false })
    this.props.initRedeem()
  }

  backToList = () => {
    this.setState({ redeemVoucher: '' })
    this.props.initRedeem()
  }

  handleNavigateTab = (selected) => {
    this.setState({ selected, err: null })
  }

  renderTab = () => {
    const { selected } = this.state
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white' }}>
        {map(['ace', 'informa', 'toyskingdom'], (v, i) =>
          <Tab key={i} selected={v === selected} onPress={() => this.handleNavigateTab(v)}>
            <TextTab selected={v === selected}>{v === 'toyskingdom' ? 'Toys Kingdom' : startCase(v)}</TextTab>
          </Tab>
        )}
      </View>
    )
  }

  renderMemberidIsEmpty () {
    const { selected } = this.state
    let imageUrl = `${config.imageURL}fl_lossy,f_auto,q_auto/v1567765127/2.1/banner-tukar-poin/${selected === 'toyskingdom' ? `toys-mobile.webp` : `${selected}-mobile.webp`}`
    let route = ''
    if (selected === 'ace') {
      route = 'AHI'
    } else if (selected === 'informa') {
      route = 'HCI'
    } else if (selected === 'toyskingdom') {
      route = 'TGI'
    }
    return (
      <View>
        <Image style={{ width, height: (width * 200) / 375, marginTop: 10 }} source={{ uri: imageUrl }} />
        <TouchableOpacity onPress={() => this.props.navigation.navigate('MembershipPage', { route })} style={{ marginTop: 16, paddingVertical: 8, width: width * 0.6, backgroundColor: '#008CCF', borderRadius: 6, alignSelf: 'center' }}>
          <Text style={{ color: 'white', fontFamily: 'Quicksand-Bold', textAlign: 'center', fontSize: 16 }}>Masukkan Member ID</Text>
        </TouchableOpacity>
      </View>
    )
  }

  componentDidUpdate (prevProps) {
    const { loginRedeemPoint, checkOtp, translateToCode, selected } = this.state
    let otpValidation = this.state[`otpValidation${translateToCode[selected]}`]
    if (loginRedeemPoint && !otpValidation && checkOtp) {
      this.setState({ checkOtp: false }, this.choices('check-point', 'message'))
    }
    let status = get(this.props.otp.data, 'status')
    if (status === 'valid' && status !== get(prevProps.otp.data, 'status')) {
      this.setState({ [`otpValidation${translateToCode[selected]}`]: true })
      this.props.initOtp()
    }
  }

  choices () {
    const { user } = this.props.user
    let dataTemp = {
      action: 'check-point',
      customer_id: user.customer_id,
      email: user.email,
      phone: user.phone
    }
    let data = { action: 'check-point', verification_input: user.phone }
    let choicesParam = { data, dataTemp }
    this.props.navigation.navigate('ValidateOption', { choicesParam })
  }

  render () {
    const { selected, err, point, loginRedeemPoint, redeemVoucher, memberIdGeneral, balance, translateToCode } = this.state
    const { user } = this.props
    let selectedId = translateToCode[selected]
    let otpValidation = this.state[`otpValidation${selectedId}`]
    return (
      <View style={{ backgroundColor: 'white' }}>
        <HeaderSearchComponent pageName={'Tukar Poin'} close navigation={this.props.navigation} />
        {this.renderTab()}
        {(isEmpty(this.state[`memberId${capitalize(selectedId)}`]))
          ? this.renderMemberidIsEmpty()
          : (loginRedeemPoint === '' || !otpValidation)
            ? <PointComponent fetchingPoint={user.fetchingPoint} memberId={this.state[`memberId${capitalize(selectedId)}`]} selectedTab={selected} handleSubmit={this.handleSubmit.bind(this)} err={err} />
            : (loginRedeemPoint !== '' && redeemVoucher === '' && otpValidation)
              ? <RedeemPointList selected={selected} memberId={memberIdGeneral} logoutCard={this.logoutCard.bind(this)} handleRedeem={this.handleRedeem.bind(this)} point={point} />
              : (loginRedeemPoint !== '' && redeemVoucher !== '' && otpValidation)
                ? <RedeemPointSuccess selected={selected} memberId={memberIdGeneral} companyId={loginRedeemPoint} redeemVoucher={redeemVoucher} balance={balance} backToList={this.backToList} point={point} />
                : null
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  otp: state.otp,
  user: state.user,
  err: state.user.err,
  point: state.user.point,
  redeem: state.user.redeem
})

const mapDispatchToProps = (dispatch) => ({
  checkPoint: (params) => dispatch(UserActions.userCheckPointRequest(params)),
  redeemPoint: (params) => dispatch(UserActions.userRedeemPointRequest(params)),
  initOtp: () => dispatch(OtpActions.otpInit()),
  saveDataGenerate: (params) => dispatch(OtpActions.otpSaveDataGenerate(params)),
  initRedeem: () => dispatch(UserActions.userInitRedeem()),
  userInit: () => dispatch(UserActions.userInit()),
  initPoint: () => dispatch(UserActions.userInitPoint())
})

export default connect(mapStateToProps, mapDispatchToProps)(PointPage)

const Tab = styled.TouchableOpacity`
  padding: 15px;
  justifyContent: center;
  alignItems: center;
  borderBottomWidth: 2;
  borderBottomColor: ${props => props.selected ? '#F26524' : '#E5E9F2'};
  width: 33%;
`
const TextTab = styled.Text`
  color: ${props => props.selected ? '#F26524' : '#757885'};
  fontFamily: Quicksand-Bold;
`
