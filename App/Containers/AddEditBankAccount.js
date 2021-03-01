import React, { Component } from 'react'
import { View, Text, TextInput, Dimensions, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { Container, ButtonFilledSecondary, Bold, FontSizeM, ButtonFilledDisabled, ButtonFilledPrimary, ButtonFilledText, ButtonFilledTextDisabled, InfoBox } from '../Styles/StyledComponents'
import styled from 'styled-components'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

// Redux
import VoucherActions from '../Redux/VoucherRedux'

// Components
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import EasyModal from '../Components/EasyModal'
import Loading from '../Components/LottieComponent'

class AddEditBankAccount extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      noRek: '',
      selectedBank: 0,
      branchName: '',
      phone: props.user.user.phone,
      otp: '',
      password: '',
      rekeningId: null,
      action: 'add',
      countdown: 120,
      startCountdown: false
    }
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {}
    const data = props.route.params?.data ?? ''
    if (!isEmpty(data)) {
      if (data.customer_rekening_id !== state.rekeningId) {
        let bankIndex = props.voucher.bankData.findIndex((bankDetail) => bankDetail.bic === data.bic)
        returnObj = {
          name: data.account_name,
          noRek: data.account_number,
          branchName: data.branch_name,
          selectedBank: (bankIndex !== -1) ? bankIndex : 0,
          rekeningId: data.customer_rekening_id,
          action: 'edit'
        }
      }
    }
    return returnObj
  }

  changeText = (key, value) => {
    if (key === 'noRek') {
      value = value.replace(/[^0-9]/g, '')
    }
    this.setState({ [key]: value })
  }

  setBankModal = () => {
    const { voucher } = this.props
    if (!voucher.fetchingBankData && isEmpty(voucher.bankData)) {
      this.props.bankDataRequest()
    } else {
      this.refs.child.setModal(true)
    }
  }

  selectBank = (index) => {
    this.setState({ selectedBank: index })
    this.refs.child.setModal(false)
  }

  requestOtp = () => {
    const { phone } = this.state
    let data = {
      phone
    }
    this.props.refundOtpRequest(data)
  }

  componentDidUpdate () {
    if (this.props.voucher.otp === 'success' && !this.state.startCountdown) {
      this.idCountdown = setInterval(() => this.setState((prevState) => ({ countdown: prevState.countdown - 1 })), 1000)
      this.setState({ startCountdown: true })
    }
    if (this.state.countdown <= 0 && this.state.startCountdown) {
      this.setState({ countdown: 120, startCountdown: false })
      clearInterval(this.idCountdown)
    }
  }

  componentWillUnmount () {
    clearInterval(this.idCountdown)
  }

  setAddOrEdit = () => {
    const { action, name, noRek, password, selectedBank, branchName, phone, otp, rekeningId } = this.state
    let data = {
      accountName: name,
      accountNumber: noRek,
      password,
      bankId: this.props.voucher.bankData[selectedBank].bic,
      branchName,
      phone,
      otp
    }
    if (action === 'edit') {
      data.customer_rekening_id = rekeningId
    }
    this.props.setTempBankData(data)
    this.props.navigation.goBack()
  }

  render () {
    const { name, noRek, branchName, phone, otp, password, selectedBank, action, countdown, startCountdown } = this.state
    const { voucher } = this.props
    let success = true
    for (let key of Object.keys(this.state)) {
      if (isEmpty(this.state[key]) && key !== 'rekeningId' && key !== 'selectedBank' && key !== 'countdown' && key !== 'startCountdown') {
        success = false
      }
    }
    let ButtonComponent = (success) ? ButtonFilledPrimary : ButtonFilledDisabled
    let ButtonTextComponent = (success) ? ButtonFilledText : ButtonFilledTextDisabled
    return (
      <View>
        <ScrollView>
          <HeaderSearchComponent back pageName={(action === 'add') ? 'Tambah Nomor Rekening' : 'Ubah Nomor Rekening'} navigation={this.props.navigation} />
          <Container>
            <Input placeholder='Nama pemilik rekening' value={name} onChangeText={(e) => this.changeText('name', e)} />
            <Input keyboardType='numeric' placeholder='Nomor rekening' value={noRek} onChangeText={(e) => this.changeText('noRek', e)} />
            {(voucher.fetchingBankData)
              ? <Loading />
              : <TouchableOpacity onPress={() => this.setBankModal()} style={{ height: 40, borderWidth: 1, borderRadius: 5, borderColor: '#E0E6ED', marginTop: 10, paddingHorizontal: 5, justifyContent: 'center' }}>
                {(!isEmpty(voucher.bankData))
                  ? <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: 'Gotham-Light', fontSize: 16 }}>{voucher.bankData[selectedBank].name}</Text>
                    <Icon name='menu-down' size={20} />
                  </View>
                  : <FontSizeM style={{ color: '#CE0F21', textAlign: 'center' }}>Terjadi kesalahan. Mohon coba lagi <Icon color='#CE0F21' name='refresh' size={16} /></FontSizeM>
                }
              </TouchableOpacity>
            }
            <Input placeholder='Nama cabang' value={branchName} onChangeText={(e) => this.changeText('branchName', e)} />
            <Input style={{ backgroundColor: '#F0F2F7' }} editable={false} placeholder='Nomor handphone' value={phone} onChangeText={(e) => this.changeText('phone', e)} />
            <View style={{ marginTop: 5 }}>
              {(voucher.otp === 'success')
                ? <InfoBox>
                  <FontSizeM>OTP berhasil dikirimkan, silahkan masukkan nomor OTP yang dikirimkan ke nomor handphone Anda</FontSizeM>
                </InfoBox>
                : !isEmpty(voucher.errOtp)
                  ? <Text style={{ fontSize: 14, color: '#F3251D', fontFamily: 'Quicksand-Regular' }}>{voucher.errOtp}</Text>
                  : null
              }
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <TextInput
                style={{ height: 40, width: Dimensions.get('screen').width * 0.5, marginTop: 10, borderWidth: 1, borderRadius: 5, borderColor: '#E0E6ED', paddingHorizontal: 5, fontFamily: 'Quicksand-Regular' }}
                placeholder='Kode OTP'
                value={otp}
                onChangeText={(e) => this.changeText('otp', e)}
              />
              <View style={{ width: Dimensions.get('screen').width * 0.4, height: 40, marginTop: 10 }}>
                <TouchableOpacity disabled={startCountdown} onPress={() => this.requestOtp()} style={{ backgroundColor: '#008CCF', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                  <Bold style={{ fontSize: 16, color: 'white' }}>Kirim kode OTP</Bold>
                </TouchableOpacity>
              </View>
            </View>
            {(startCountdown)
              ? <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                <Text style={{ fontSize: 16, fontFamily: 'Quicksand-Regular' }}>Tunggu </Text>
                <Bold style={{ fontSize: 16 }}>{countdown} detik</Bold>
                <Text style={{ fontSize: 16, fontFamily: 'Quicksand-Regular' }}> untuk mengirim ulang kode</Text>
              </View>
              : null}
            <Input placeholder='Kata sandi Ruparupa' secureTextEntry value={password} onChangeText={(e) => this.changeText('password', e)} />
          </Container>
          <Container>
            <ButtonFilledSecondary onPress={() => this.props.navigation.goBack()}>
              <Bold style={{ fontSize: 16, color: 'white' }}>Batalkan</Bold>
            </ButtonFilledSecondary>
            <View style={{ marginTop: 5 }} />
            <ButtonComponent style={{ padding: 5 }} onPress={() => this.setAddOrEdit()}>
              <ButtonTextComponent style={{ fontFamily: 'Quicksand-Bold' }}>Tambah Nomor Rekening</ButtonTextComponent>
            </ButtonComponent>
          </Container>
        </ScrollView>
        <EasyModal ref='child' size={75} close title={'Pilih Bank'}>
          <FlatList
            data={voucher.bankData}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => this.selectBank(index)} style={{ borderTopColor: '#D4DCE6', borderTopWidth: 1, paddingVertical: 15, paddingLeft: 5 }}>
                <FontSizeM>{item.name}</FontSizeM>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => `banks ${index} ${item.name}`}
          />
        </EasyModal>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  voucher: state.voucher,
  user: state.user
})

const mapDispatchToProps = (dispatch) => ({
  refundOtpRequest: (data) => dispatch(VoucherActions.refundOtpRequest(data)),
  bankDataRequest: () => dispatch(VoucherActions.bankDataRequest()),
  setTempBankData: (data) => dispatch(VoucherActions.setTempBankData(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(AddEditBankAccount)

const Input = styled.TextInput`
  height: 40px;
  border-width: 1px;
  border-radius: 5px;
  border-color: #E0E6ED;
  margin-top: 10px;
  padding-horizontal: 5px;
  color: #555761;
  font-family: Quicksand-Regular;
  background-color: ${props => (props.backgroundColor) ? props.backgroundColor : '#ffffff'};
 `
