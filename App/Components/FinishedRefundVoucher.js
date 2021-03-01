import React, { Component } from 'react'
import { Text, View, Dimensions } from 'react-native'
import { InfoBox, Container, Bold, ButtonFilledPrimary, ButtonFilledText, FontSizeM } from '../Styles/StyledComponents'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { UpperCase, NumberWithCommas } from '../Utils/Misc'
import { connect } from 'react-redux'

// Redux
import VoucherActions from '../Redux/VoucherRedux'
import UserActions from '../Redux/UserRedux'

class FinishedRefundVoucher extends Component {
  componentWillUnmount () {
    this.props.initCreateRefund()
  }

  goBack = () => {
    this.props.userVoucherRequest()
    this.props.navigation.navigate('VoucherPage')
  }

  render () {
    const { data, voucherNominal } = this.props
    let renderData = [
      { label: 'Nama pemilik rekening', value: UpperCase(data.accountName) },
      { label: 'Nomor rekening', value: data.accountNumber },
      { label: 'Total pengembalian', value: `Rp ${NumberWithCommas(voucherNominal)}` }
    ]
    return (
      <View>
        <Container>
          <InfoBox>
            <View style={{ marginRight: 5 }}>
              <Icon name='information' size={16} color='#757885' />
            </View>
            <View style={{ width: Dimensions.get('screen').width * 0.85 }}>
              <FontSizeM style={{ lineHeight: 20 }}>Dana Anda akan kami transfer ke rekening yang telah dipilih selambat-lambatnya 5 hari kerja. Kami akan mengirimkan email konfirmasi setelah dana berhasil dikembalikan</FontSizeM>
            </View>
          </InfoBox>
        </Container>
        <Container>
          {renderData.map((rowData, index) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' }} key={`finish refund data ${index}${rowData.label}`}>
              <Text style={{ fontFamily: 'Quicksand-Regular', fontSize: 16 }}>{rowData.label}</Text>
              <Bold style={{ fontSize: 16 }}>{rowData.value}</Bold>
            </View>
          ))}
        </Container>
        <Container>
          <ButtonFilledPrimary onPress={() => this.goBack()}>
            <ButtonFilledText>Selesai</ButtonFilledText>
          </ButtonFilledPrimary>
        </Container>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  initCreateRefund: () => dispatch(VoucherActions.initCreateRefund()),
  userVoucherRequest: () => dispatch(UserActions.userVoucherRequest())
})

export default connect(null, mapDispatchToProps)(FinishedRefundVoucher)
