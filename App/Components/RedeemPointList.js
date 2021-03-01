import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import config from '../../config'
import { NumberWithCommas } from '../Utils/Misc'
import dayjs from 'dayjs'

// Component
import LottieComponent from './LottieComponent'

class RedeemPointList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: props.selected,
      err: null,
      voucher: 100000,
      fetchingRedeem: false,
      memberId: props.memberId
    }
  }

  componentWillReceiveProps (newProps) {
    const { err, fetchingRedeem, selected, memberId } = newProps
    this.setState({
      err,
      fetchingRedeem,
      selected,
      memberId
    })
  }

  handleVoucher = (voucher) => {
    if (voucher !== this.state.voucher) {
      this.setState({ voucher })
    }
  }

  handleRedeem = () => {
    const { voucher } = this.state
    this.props.handleRedeem(voucher)
  }

  render () {
    const { fetchingRedeem, selected, voucher, err, memberId } = this.state
    let voucherPoints
    let voucherPrice = [100000, 50000, 25000]
    if (config.redeemPointDouble && config.redeemPointDouble !== '') {
      if (dayjs() <= dayjs(config.redeemPointDouble)) {
        voucherPrice = [200000, 100000, 50000]
      }
    }
    switch (selected) {
      case 'ace' :
        voucherPoints = [40, 20, 10]
        // cardImage = `${config.assetsIconURL}2.1/svg/card-membership/mobile/ace-card-membership-2.svg`
        break
      case 'informa' :
        voucherPoints = [40, 20, 10]
        // cardImage = `${config.assetsIconURL}2.1/svg/card-membership/mobile/informa-card-membership.svg`
        break
      case 'toyskingdom' :
        voucherPoints = [400, 200, 100]
        // cardImage = `${config.assetsIconURL}2.1/svg/card-membership/mobile/toys-kingdom-card-membership-2.svg`
        break
      default:
        voucherPoints = [40, 20, 10]
    }

    let styles = {
      selectedOuterView: {
        width: 24,
        height: 24,
        borderRadius: 100 / 2,
        borderWidth: 1,
        borderColor: '#008CCF',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
      },
      selectedInnerView: {
        width: 15,
        height: 15,
        borderRadius: 100 / 2,
        backgroundColor: '#008CCF'
      },
      notSelected: {
        width: 24,
        height: 24,
        borderRadius: 100 / 2,
        borderWidth: 2,
        borderColor: '#E0E6ED',
        backgroundColor: 'white'
      },
      selectedText: {
        fontSize: 14,
        color: '#008CCF',
        fontFamily: 'Quicksand-Regular'
      },
      selectedTextHeader: {
        fontSize: 14,
        color: '#008CCF',
        fontFamily: 'Quicksand-Bold'
      },
      notSelectedText: {
        fontSize: 14,
        color: '#E0E6ED',
        fontFamily: 'Quicksand-Regular'
      },
      notSelectedTextHeader: {
        fontSize: 14,
        color: '#E0E6ED',
        fontFamily: 'Quicksand-Bold'
      }
    }
    if (fetchingRedeem) {
      return (
        <View style={{ flexDirection: 'column', padding: 20, height: '50%', justifyContent: 'space-evenly' }}>
          <View style={{ marginVertical: 20 }}>
            <LottieComponent />
          </View>
          <View>
            <Text style={{ fontFamily: 'Quicksand-Regular', textAlign: 'center', fontSize: 16, lineHeight: 30 }}>Kami sedang memproses permintaan Anda, jangan tutup/refresh halaman ini.</Text>
          </View>
        </View>
      )
    } else {
      return (
        <View style={{ flexDirection: 'column', justifyContent: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, letterSpacing: 7.5, textAlign: 'center', fontFamily: 'Quicksand-Regular' }}>{memberId}</Text>
          <Text style={{ fontSize: 16, textAlign: 'center', fontFamily: 'Quicksand-Regular' }}>{(this.props.point) ? NumberWithCommas(this.props.point) : 0 } Poin</Text>
          {voucherPoints.map((voucherPoint, index) => (
            <TouchableOpacity onPress={() => this.handleVoucher(voucherPrice[index])} key={`voucher ${index} ${voucherPoint}`} style={{ padding: 10, marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E1E7EE', borderRadius: 3 }}>
              <View style={{ justifyContent: 'center', alignItems: 'center', paddingLeft: 10 }}>
                <View style={(voucher === voucherPrice[index]) ? styles.selectedOuterView : styles.notSelected}>
                  <View style={(voucher === voucherPrice[index]) ? styles.selectedInnerView : ''} />
                </View>
              </View>
              <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Text style={(voucher === voucherPrice[index] ? styles.selectedTextHeader : styles.notSelectedTextHeader)}>Rp {NumberWithCommas(voucherPrice[index])} voucher belanja</Text>
                <Text style={(voucher === voucherPrice[index] ? styles.selectedText : styles.notSelectedText)}>(-{voucherPoint} poin)</Text>
              </View>
              <View style={{ width: '10%' }} />
            </TouchableOpacity>
          ))}
          {(err && err !== '')
            ? <View style={{ margin: 10 }}>
              <Text style={{ color: 'red', fontSize: 16, fontFamily: 'Quicksand-Regular' }}>{err.replace('Error: ', '')}</Text>
            </View>
            : null
          }
          <TouchableOpacity style={{ paddingTop: 10, paddingBottom: 10, marginTop: 10, backgroundColor: '#F26525', borderRadius: 3 }} onPress={() => this.handleRedeem()}>
            <Text style={{ fontSize: 16, textAlign: 'center', color: 'white', fontFamily: 'Quicksand-Medium' }}>Tukar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ borderWidth: 1, borderColor: '#E0E6ED', paddingTop: 10, paddingBottom: 10, marginTop: 10, borderRadius: 3 }} onPress={() => this.props.logoutCard()}>
            <Text style={{ fontSize: 16, textAlign: 'center', fontFamily: 'Quicksand-Medium' }}>Ganti Kartu</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }
}

const stateToProps = (state) => ({
  err: state.user.err,
  fetchingRedeem: state.user.fetchingRedeem
})

export default connect(stateToProps)(RedeemPointList)
