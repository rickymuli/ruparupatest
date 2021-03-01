import React, { Component } from 'react'
import { Dimensions, View, TextInput, TouchableOpacity, Text, Platform } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { FontSizeM, Container, Bold, ButtonFilledSecondary, ButtonFilledText, ButtonFilledPrimary, ButtonFilledDisabled, ButtonFilledTextDisabled } from '../Styles/StyledComponents'
import styled from 'styled-components'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import { UpperCase } from '../Utils/Misc'

// Redux
import VoucherActions from '../Redux/VoucherRedux'

// Components
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import Loading from '../Components/LottieComponent'
import EasyModal from '../Components/EasyModal'
import FinishedRefundVoucher from '../Components/FinishedRefundVoucher'
import ForgotPassword from '../Components/ForgotPassword'
import Checkbox from '../Components/Checkbox'

class RefundVoucherPage extends Component {
  constructor () {
    super()
    this.state = {
      voucherNominal: 0,
      selectedBankAccount: 0,
      voucherCode: '',
      agreeTerms: false,
      password: '',
      data: null,
      error: '',
      forgetPass: false
    }
  }
  componentDidMount () {
    let voucherData = this.props.route.params?.data ?? null
    if (!isEmpty(voucherData)) {
      this.setState({
        voucherNominal: voucherData.voucher_amount,
        voucherCode: voucherData.voucher_code
      })
    }
    this.props.bankDataRequest()
    this.props.userBankAccountRequest()
  }

  selectedBankAccount = (index) => {
    this.refs.child.setModal(false)
    if (index === -1) {
      this.props.navigation.navigate('AddEditBankAccount')
    } else {
      this.props.initTempBankData()
      this.setState({ selectedBankAccount: index })
    }
  }

  componentWillUnmount () {
    this.props.initTempBankData()
  }

  setItemForEdit = (data) => {
    this.props.navigation.navigate('AddEditBankAccount', { data })
  }

  submitRequest = () => {
    const { voucher } = this.props
    const { voucherCode, password, agreeTerms, selectedBankAccount } = this.state
    let data = {
      voucherCode,
      password,
      termsFlag: agreeTerms
    }
    let error = ''
    if (isEmpty(voucher.tempBankAccountData)) {
      if (!isEmpty(voucher.bankAccount[selectedBankAccount])) {
        data.accountName = voucher.bankAccount[selectedBankAccount].account_name
        data.accountNumber = voucher.bankAccount[selectedBankAccount].account_number
        data.accountId = voucher.bankAccount[selectedBankAccount].customer_rekening_id
        data.phone = voucher.bankAccount[selectedBankAccount].phone
      } else {
        error = 'Mohon isi data rekening anda'
      }
    } else {
      data.otpNumber = voucher.tempBankAccountData.otp
      data.bankId = voucher.tempBankAccountData.bankId
      data.bankBranch = voucher.tempBankAccountData.branchName
      data.accountName = voucher.tempBankAccountData.accountName
      data.accountNumber = voucher.tempBankAccountData.accountNumber
      data.phone = voucher.tempBankAccountData.phone
      data.accountId = '0'
    }
    if (!isEmpty(error)) {
      this.setState({ error })
    } else {
      this.props.submitRefundRequest(data)
      this.setState({ data, error })
    }
  }

  render () {
    const { voucher } = this.props
    const { agreeTerms, selectedBankAccount, password } = this.state
    let success = true
    if (isEmpty(password) || !agreeTerms) {
      success = false
    }
    let ButtonComponent = (success) ? ButtonFilledPrimary : ButtonFilledDisabled
    let ButtonTextComponent = (success) ? ButtonFilledText : ButtonFilledTextDisabled
    return (
      <View>
        <HeaderSearchComponent back pageName='Pencairan Dana' navigation={this.props.navigation} />
        {(!isEmpty(voucher.createRefund))
          ? <FinishedRefundVoucher data={this.state.data} voucherNominal={this.state.voucherNominal} navigation={this.props.navigation} />
          : <>
            <InfoBoxPcp>
              <View><Icon name='information' size={16} color='#757885' /></View>
              <View style={{ width: Dimensions.get('screen').width * 0.8, marginLeft: 10 }}>
                <FontSizeM style={{ color: '#757885' }}>Permohonan penarikan dana Anda akan kami proses dalam 1x24 jam hari kerja. Anda akan mendapatkan email konfirmasi ketika dana sudah ditransfer. Terima kasih</FontSizeM>
              </View>
            </InfoBoxPcp>
            <Container>
              <Bold style={{ fontSize: 16 }}>Total Pengembalian</Bold>
              <TextInput style={{ height: 40, backgroundColor: '#F0F2F7', paddingLeft: 10, fontFamily: 'Quicksand-Medium', borderRadius: 5 }} editable={false} value={`Rp ${this.state.voucherNominal}`} />
              <View style={{ height: 70 }}>
                {(voucher.fetchingBankAccount)
                  ? <Loading />
                  : (!isEmpty(voucher.bankAccount) || !isEmpty(voucher.tempBankAccountData))
                    ? <>
                      {isEmpty(voucher.bankAccount)
                        ? <View style={{ padding: 10, height: 40, borderWidth: 1, marginTop: 5, borderColor: '#E0E6ED', borderRadius: 5, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={{ fontFamily: 'Quicksand-Regular', fontSize: 16 }}>{`${voucher.tempBankAccountData.accountNumber} - ${UpperCase(voucher.tempBankAccountData.accountName)} - ${voucher.tempBankAccountData.bankId}`}</Text>
                        </View>
                        : <TouchableOpacity onPress={() => this.refs.child.setModal()} style={{ marginTop: 5 }}>
                          <View style={{ padding: 10, height: 40, borderWidth: 1, borderColor: '#E0E6ED', borderRadius: 5, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                            {
                              !isEmpty(voucher.tempBankAccountData)
                                ? <Text style={{ fontFamily: 'Quicksand-Regular', fontSize: 16 }}>{`${voucher.tempBankAccountData.accountNumber} - ${UpperCase(voucher.tempBankAccountData.accountName)} - ${voucher.tempBankAccountData.bankId}`}</Text>
                                : <Text style={{ fontFamily: 'Quicksand-Regular', fontSize: 16 }}>{!isEmpty(voucher.bankAccount[selectedBankAccount]) ? `${voucher.bankAccount[selectedBankAccount].account_number} - ${UpperCase(voucher.bankAccount[selectedBankAccount].account_name)}` : ''}</Text>
                            }
                            <Icon name='menu-down' size={20} />
                          </View>
                        </TouchableOpacity>
                      }
                      <TouchableOpacity style={{ marginTop: 5 }} onPress={() => this.setItemForEdit(voucher.bankAccount[selectedBankAccount])}>
                        <Bold style={{ color: '#008CCF', fontSize: 16 }}>Ubah nomor rekening</Bold>
                      </TouchableOpacity>
                      </>
                    : <TouchableOpacity onPress={() => this.selectedBankAccount(-1)}>
                      <Bold style={{ color: '#008CCF' }}>Tambah rekening baru</Bold>
                    </TouchableOpacity>
                }
              </View>
              <TextInput value={password} onChangeText={(e) => this.setState({ password: e })} secureTextEntry placeholder='Kata Sandi Ruparupa' style={{ height: 40, borderWidth: 1, borderRadius: 5, borderColor: '#E0E6ED', marginTop: 10, paddingHorizontal: 5, fontFamily: 'Quicksand-Regular' }} />
              {(this.state.forgetPass)
                ? <ForgotPassword changeForgetPass={() => this.setState({ forgetPass: false })} />
                : <TouchableOpacity onPress={() => this.setState({ forgetPass: !this.state.forgetPass })} style={{ marginVertical: 5 }}>
                  <Bold style={{ color: '#008CCF', fontSize: 16 }}>Lupa Kata Sandi</Bold>
                </TouchableOpacity>
              }
              <TouchableOpacity onPress={() => this.setState({ agreeTerms: !agreeTerms })} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={(Platform.OS === 'ios') ? { borderWidth: 1, borderRadius: 5, borderColor: '#D4DCE6' } : null}>
                  <Checkbox
                    onPress={() => this.setState({ agreeTerms: !agreeTerms })}
                    selected={agreeTerms}
                  />
                </View>
                <View style={{ width: Dimensions.get('screen').width * 0.9, marginLeft: 15 }}>
                  <Text style={{ fontFamily: 'Quicksand-Regular', fontSize: 14 }}>Data yang saya masukkan sudah sesuai dan benar</Text>
                </View>
              </TouchableOpacity>
            </Container>
            {(!isEmpty(voucher.errCreateRefund) || !isEmpty(this.state.error))
              ? <Container>
                <Text style={{ fontFamily: 'Quicksand-Regular', fontSize: 16, color: '#F3251D' }}>{(!isEmpty(this.state.error)) ? this.state.error : voucher.errCreateRefund}</Text>
              </Container>
              : null
            }
            <Container>
              <ButtonFilledSecondary onPress={() => this.props.navigation.goBack()}>
                <ButtonFilledText>Batalkan</ButtonFilledText>
              </ButtonFilledSecondary>
              <View style={{ marginTop: 5 }} />
              <ButtonComponent onPress={() => this.submitRequest()} style={{ padding: 5 }}>
                <ButtonTextComponent style={{ fontFamily: 'Quicksand-Bold' }}>Cairkan</ButtonTextComponent>
              </ButtonComponent>
            </Container>
            <EasyModal ref='child' size={50} close title={'Pilih Akun Rekening'}>
              <Container>
                {(voucher.bankAccount.map((account, index) => (
                  <FormList onPress={() => this.selectedBankAccount(index)} key={`account no ${index}`}>
                    <View>
                      <FontSizeM>{`${account.account_number} - ${UpperCase(account.account_name)}`}</FontSizeM>
                    </View>
                  </FormList>
                )))}
                <FormList onPress={() => this.selectedBankAccount(-1)}>
                  <View>
                    <FontSizeM>Tambah rekening baru</FontSizeM>
                  </View>
                </FormList>
              </Container>
            </EasyModal>
        </>
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  voucher: state.voucher
})

const mapDispatchToProps = (dispatch) => ({
  submitRefundRequest: (data) => dispatch(VoucherActions.submitRefundRequest(data)),
  bankDataRequest: () => dispatch(VoucherActions.bankDataRequest()),
  initTempBankData: () => dispatch(VoucherActions.initTempBankData()),
  userBankAccountRequest: () => dispatch(VoucherActions.userBankAccountRequest())
})

export default connect(mapStateToProps, mapDispatchToProps)(RefundVoucherPage)

const InfoBoxPcp = styled.View`
  flex-direction: row;
  background-color: #e5f7ff;
  padding: 20px;
  padding-right: 30px;
`

const FormList = styled.TouchableOpacity`
  padding-vertical: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #D4DCE6;
`
