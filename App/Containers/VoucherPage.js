import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Clipboard, Image, FlatList, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { NumberWithCommas } from '../Utils/Misc'
import styled from 'styled-components'
import Toast from 'react-native-easy-toast'
import reduce from 'lodash/reduce'
import orderBy from 'lodash/orderBy'
import isEmpty from 'lodash/isEmpty'
import { ButtonFilledSecondary, Bold } from '../Styles/StyledComponents'
import { PrimaryText, PrimaryTextMedium, PrimaryTextBold, fonts, dimensions, colors } from '../Styles'

// Redux
import UserActions from '../Redux/UserRedux'

// Components
import LottieComponent from '../Components/LottieComponent'
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import EasyModal from '../Components/EasyModal'

class VoucherPage extends Component {
  constructor (props) {
    super(props)
    this.modal = null
    this.state = {
      user: props.user || undefined,
      vouchers: props.user.voucher || [],
      positiveStyle: {
        color: '#049372',
        fontFamily: fonts.medium
      },
      negativeStyle: {
        color: '#F3251D',
        fontFamily: fonts.medium
      },
      refresh: false,
      openVoucher: null
    }
  }

  componentDidMount () {
    this.props.userVoucherRequest()
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    let returnObj = {}
    if (nextProps.user !== prevState.user) {
      returnObj = {
        ...returnObj,
        user: nextProps.user,
        vouchers: nextProps.user.voucher
      }
    }
    if (prevState.refresh) {
      returnObj = {
        ...returnObj,
        refresh: false
      }
    }
    return returnObj
  }

  saveVoucher = (voucherNumber) => {
    Clipboard.setString(voucherNumber)
    this.refs.toast.show('Kode Tersalin', 500)
  }

  filterVoucher () {
    const { vouchers } = this.state
    reduce(vouchers, function (result, value, key) {
      (result[value] || (result[value] = [])).push(key)
      return result
    }, [])
  }

  setSelectedVoucher = (voucher) => {
    this.props.navigation.navigate('RefundVoucherPage', { data: voucher })
  }

  refreshVoucher = () => {
    this.props.userVoucherRequest()
  }

  renderVoucherCard = (voucher) => {
    return (
      <CardContainer>
        <View>
          <ItemVoucher>
            <PrimaryTextBold>Kode Voucher</PrimaryTextBold>
            <View style={{ borderRadius: 3, padding: 3, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: fonts.medium }}>{voucher.voucher_code}</Text>
              <TouchableOpacity onPress={() => this.saveVoucher(voucher.voucher_code)} style={{ backgroundColor: '#F26525', borderRadius: 3, paddingHorizontal: 10, marginLeft: 15, elevation: 3, shadowOffset: { width: 0, height: -3 }, shadowColor: '#000000' }}>
                <PrimaryTextBold style={{ justifyContent: 'center', color: '#ffffff' }}>Salin</PrimaryTextBold>
              </TouchableOpacity>
            </View>
          </ItemVoucher>
          <ItemVoucher>
            <PrimaryTextBold>Tipe Kupon</PrimaryTextBold>
            <Text style={{ fontFamily: fonts.regular }}>{voucher.type}</Text>
          </ItemVoucher>
          <ItemVoucher>
            <PrimaryTextBold>Berlaku Hingga</PrimaryTextBold>
            <Text style={{ fontFamily: fonts.regular }}>{voucher.expiration_datetime}</Text>
          </ItemVoucher>
          <ItemVoucher>
            <PrimaryTextBold>Nominal Voucher</PrimaryTextBold>
            <Text style={{ fontFamily: fonts.regular }}>Rp {NumberWithCommas(voucher.voucher_amount)}</Text>
          </ItemVoucher>
          <ItemVoucher>
            <PrimaryTextBold>Status</PrimaryTextBold>
            {(voucher.status.toLowerCase() === 'aktif')
              ? <Text style={[{ fontFamily: fonts.regular }, this.state.positiveStyle]}>{voucher.status}</Text>
              : <Text style={[{ fontFamily: fonts.regular }, this.state.negativeStyle]}>{voucher.refund_status === 'recheck' ? 'Proses Pengecekan' : (voucher.refund_status === 'refunded') ? 'Sudah Digunakan' : voucher.status}</Text>
            }
          </ItemVoucher>
          <View style={{ marginBottom: 5 }} />
          {(voucher.type.toLowerCase() === 'refund' && voucher.voucher_amount >= 10000 && voucher.status === 'Aktif' && voucher.rule_id === '47')
            ? <ButtonFilledSecondary onPress={() => this.setSelectedVoucher(voucher)}>
              <Bold style={{ color: 'white' }}>Cairkan Dana</Bold>
            </ButtonFilledSecondary>
            : null
          }
          {voucher?.type?.toLowerCase() !== 'refund' && !isEmpty(voucher?.tnc)
            ? <TouchableOpacity
              onPress={() => {
                this.setState({ openVoucher: voucher })
                this.modal.setModal(true)
              }}
              style={{ height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderWidth: 1.5, borderColor: '#008CCF', borderRadius: 3, paddingHorizontal: 10, marginTop: 15 }}
            >
              <Text style={{ fontFamily: 'Quicksand-Regular', color: '#008CCF', fontWeight: 'bold' }}>Lihat Syarat & Ketentuan</Text>
            </TouchableOpacity>
            : null
          }
          <MarginTopS>
            <HrFull />
          </MarginTopS>
        </View>
      </CardContainer>
    )
  }

  _headerComponent = () => {
    const voucherTnc = [
      'Penggunaan Voucher hanya dapat digunakan 1 kali.',
      'Voucher tidak dapat diuangkan, kecuali voucher yang diterima dari pengembalian produk',
      'Masa berlaku Voucher tergantung pada tipe Voucher yang tertera'
    ]
    return (
      <View style={{ backgroundColor: '#e5f7ff', padding: 8 }}>
        <View style={{ flexDirection: 'row', paddingBottom: 4 }}>
          <Icon name={'information'} color='#757885' size={16} style={{ marginRight: 5, marginTop: 2 }} />
          <PrimaryTextMedium style={{ textAlign: 'center' }}>Syarat dan ketentuan :</PrimaryTextMedium>
        </View>
        {voucherTnc.map((tnc, index) => (
          <View style={{ flexDirection: 'row', paddingBottom: 2 }} key={`voucher tnc ${index}`}>
            <PrimaryText style={{ width: 20, textAlign: 'left' }}>{index + 1}. </PrimaryText>
            <PrimaryText style={{ width: dimensions.width * 0.9 }}>{tnc}</PrimaryText>
          </View>
        ))}
      </View>
    )
  }

  renderEmptyVoucher = () => {
    const ratio = (dimensions.width * 0.6) / 694
    return (
      <View style={{ paddingBottom: 15, marginTop: 15, paddingRight: 20, paddingLeft: 20 }}>
        <View style={{ marginLeft: 60, marginRight: 60, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ marginTop: 15, marginBottom: 25 }}>
            <Image
              source={require('../assets/images/poin-kosong.webp')}
              style={{ width: dimensions.width * 0.6, height: ratio * 975 }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
              <Icon name='information-outline' color={colors.primary} size={16} />
              <PrimaryText style={{ paddingHorizontal: 5 }}>Maaf, Anda belum memiliki voucher</PrimaryText>
            </View>
          </View>
        </View>
      </View>
    )
  }

  render () {
    const { user, vouchers, refresh } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <HeaderSearchComponent pageName={'Voucher Saya'} close navigation={this.props.navigation} />
        {(user.fetching || user.fetchingVoucher || user.fetchingPoint)
          ? <LottieComponent />
          : <FlatList
            data={orderBy(vouchers, ['status', 'expiration_datetime'], ['asc', 'asc'])}
            refreshing={refresh}
            onRefresh={() => this.refreshVoucher()}
            ListHeaderComponent={this._headerComponent}
            ListEmptyComponent={this.renderEmptyVoucher}
            renderItem={({ item }) => this.renderVoucherCard(item)}
            keyExtractor={(item, index) => `voucher cards ${index}`}
          />
        }
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
        <EasyModal ref={(ref) => { this.modal = ref }} size={80} title='Syarat dan Ketentuan' close>
          <ScrollView style={{ margin: 10 }}>
            <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886', fontSize: 16 }}>{this.state.openVoucher?.tnc}</Text>
          </ScrollView>
        </EasyModal>
      </View>
    )
  }
}

const stateToProps = (state) => ({
  user: state.user
})

const dispatchToProps = (dispatch) => ({
  userVoucherRequest: () => dispatch(UserActions.userVoucherRequest())
})

export default connect(stateToProps, dispatchToProps)(VoucherPage)

const HrFull = styled.View`
  flex:1;
  backgroundColor:#E0E6ED;
  height:1;
  marginHorizontal:-10;
`
const MarginTopS = styled.View`
  margin-top: 15px;
`

// const InfoBoxPcp = styled.View`
//   flex-direction: row;
//   background-color: #e5f7ff;
//   padding: 20px;
//   padding-right: 30px;
// `

const ItemVoucher = styled.View`
flex-direction: row;
justify-content: space-between;
padding-top: 10;
`

const CardContainer = styled.View`
flex-direction: column;
padding-horizontal: 10px;
margin-vertical: 5px;
margin-horizontal: 20px;
background-color: white;
box-shadow: 1px 1px 1px #d4dce6;
elevation: 1;
`
