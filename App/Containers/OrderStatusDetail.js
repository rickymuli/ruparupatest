import React, { Component } from 'react'
import { Clipboard, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'
import toSafeInteger from 'lodash/toSafeInteger'
import map from 'lodash/map'
import startCase from 'lodash/startCase'
import get from 'lodash/get'
import isObject from 'lodash/isObject'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
// import Toast, { DURATION } from 'react-native-easy-toast'
import { formatWithSeparator } from '../Services/Day'
import { NumberWithCommas } from '../Utils/Misc'
import { Row, ButtonSecondaryOutlineSmall, ButtonSecondaryOutlineTextSmall, Container, ButtonFilledText, ButtonFilledPrimary, Bold } from '../Styles/StyledComponents'
import Modal from 'react-native-modal'
// Redux
import OrderActions from '../Redux/OrderRedux'
import ReviewRatingActions from '../Redux/ReviewRatingRedux'

// Component
import Loading from '../Components/LottieComponent'
import ChatButton from '../Components/ChatButton'
// import OrderTransactionLogo from '../Components/OrderTransactionLogo'
import OrderDetailBody from '../Components/OrderDetailBody'
// import HeaderSearchComponent from '../Components/HeaderSearchComponent'
// import ReviewContainer from '../Components/ReviewContainer'
import Snackbar from '../Components/SnackbarComponent'
import ContextProvider from '../Context/CustomContext'

import { fonts, dimensions, PrimaryTextBold } from '../Styles'

class OrderStatusDetail extends Component {
  constructor (props) {
    super(props)
    this.updateStatusState = this.updateStatusState.bind(this)
    this.state = {
      order: props.order || {},
      modalVisible: false,
      // reviewData: null,
      redirect: false,
      statusUpdate: false
    }
    this.snackbar = React.createRef()
  }

  componentDidMount () {
    const orderData = this.props.route.params.orderData
    this.props.getOrderDetail(orderData.order_id, orderData.email)
  }

  componentDidUpdate () {
    if (this.props.order.success && this.state.statusUpdate) {
      this.setState({ order: this.props.order, statusUpdate: false })
    }
  }

  componentWillUnmount () {
    this.props.orderInitHideDiv()
    this.snackbar = null
    // this.props.initReviewData()
  }

  updateStatusState = () => {
    const orderData = this.props.route.params.orderData
    this.props.getOrderDetail(orderData.order_id, orderData.email)
    this.setState({ statusUpdate: true })
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {}
    if (!isEqual(props.order, state.order)) {
      returnObj = {
        ...returnObj,
        order: props.order
      }
    }
    // if (state.reviewData !== props.reviewRating.dataReview) {
    //   returnObj = {
    //     ...returnObj,
    //     reviewData: props.reviewRating.dataReview
    //   }
    //   if (props.reviewRating.dataReview !== null) {
    //     if (props.reviewRating.dataReview.total === 0) {
    //       returnObj = {
    //         ...returnObj,
    //         redirect: true
    //       }
    //     } else {
    //       returnObj = {
    //         ...returnObj,
    //         modalVisible: true
    //       }
    //     }
    //   }
    // }
    return returnObj
  }

  // componentDidUpdate () {
  //   if (this.state.redirect) {
  //     this.setState({ redirect: false }, () => {
  //       const { reviewHandler } = this.props
  //       if (!isEmpty(reviewHandler.selectedProduct)) {
  //         const { sku, productName, imageUrl } = reviewHandler.selectedProduct
  //         let data = {
  //           sku,
  //           product_name: productName,
  //           image_url: imageUrl
  //         }
  //         this.props.navigation.navigate('ReviewDetailPage', { data: { ...data, type: 'product' } })
  //       }
  //     })
  //   }
  // }

  // showToast = (message) => {
  //   this.refs.toast.show(message, DURATION.LENGTH_SHORT)
  // }

  // setModalVisible = (visible) => {
  //   this.setState({ modalVisible: visible })
  // }

  setupReturnRefund = () => {
    const data = this.state.order.data
    let itemDetail = {
      data: {
        email: data.customer.email,
        order_no: data.order_no
      }
    }
    this.props.navigation.navigate('ReturnRefundPage', { itemDetail })
  }

  alertRender = () => {
    return (
      <View>
        <Modal
          hasBackdrop={false}
          onModalShow={() => this.setModalVisible(false)}
          isVisible={this.state.modalVisible}
          animationIn={'slideInDown'}
          animationOut={'slideOutUp'}
          animationType={'fade'}
        >
          <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 4 }}>
            <Text style={{ fontFamily: fonts.bold, color: 'white', fontSize: 14 }}>Copied to Clipboard</Text>
          </View>
        </Modal>
      </View >
    )
  }

  copyToClipboard = async (text) => {
    await Clipboard.setString(text)
    this.setModalVisible(true)
    this.alertRender()
  }

  copyToClipboardSnackbar = (text) => {
    Clipboard.setString(text)
    this.callSnackbar('Berhasil Tersalin')
  }

  setModalVisible = (state) => {
    this.setState({ modalVisible: state })
  }

  renderBody () {
    const { order } = this.state
    const orderData = order.data
    let voucher = toSafeInteger(orderData.discount_amount) + toSafeInteger(orderData.gift_cards_amount)
    let showReturButton = false
    orderData.shipment.forEach((ship) => {
      if (ship.shipment_status === 'received') {
        showReturButton = true
      }
    })
    return (
      <Container style={{ paddingBottom: 90 }}>
        {/* {!isEmpty(orderData.shipment) &&
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          {orderData.shipment.map((shipment, index) => (
            <OrderTransactionLogo key={`transaction logo ${index}`} from='header' index={index} shipment={shipment} showToast={this.showToast.bind(this)} />
          ))}
        </View>
        } */}
        <View style={{ flexDirection: 'column' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
            <Text style={{ fontFamily: fonts.regular, fontSize: 14 }}>Tgl Pembelian</Text>
            {orderData.payment.created_at &&
              <PrimaryTextBold style={{ fontSize: 14 }}>
                {formatWithSeparator(orderData.created_at)}
              </PrimaryTextBold>
            }
          </View>
          {(orderData.payment.status === 'paid') &&
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
              <Text style={{ fontFamily: fonts.regular, fontSize: 14 }}>Tgl Pembayaran</Text>
              <PrimaryTextBold style={{ fontSize: 14 }}>
                {(orderData.payment.updated_at)
                  ? formatWithSeparator(orderData.payment.updated_at)
                  : formatWithSeparator(orderData.payment.created_at)
                }
              </PrimaryTextBold>
            </View>
          }
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
            <Text style={{ fontFamily: fonts.regular, fontSize: 14 }}>Voucher</Text>
            <PrimaryTextBold style={{ fontSize: 14 }}>
              - Rp {(voucher > 0) && NumberWithCommas(voucher)}
            </PrimaryTextBold>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
            <Text style={{ fontFamily: fonts.regular, fontSize: 14 }}>Grand Total</Text>
            <PrimaryTextBold style={{ fontSize: 14 }}>Rp {NumberWithCommas(orderData.grand_total)}</PrimaryTextBold>
          </View>
          {orderData?.payment?.type === 'bank_transfer' && orderData?.payment?.status !== 'paid'
            ? <View style={{ flexDirection: 'column', justifyContent: 'center', marginBottom: 15, alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 14 }}> Nomor Virtual Account {startCase(orderData.payment.va_bank)} Anda</Text>
              <View style={{ flexDirection: 'column', marginTop: 15 }}>
                <View style={{ flexDirection: 'row' }}>
                  <TextInput style={{ flexDirection: 'row', alignContent: 'center', borderWidth: 1, borderRadius: 3, borderColor: '#D4DCE6', fontSize: 14, width: dimensions.width * 0.4, height: dimensions.height * 0.05, color: '#757886' }} value={orderData.payment.va_number} underlineColorAndroid='transparent' editable={false} />
                  <TouchableOpacity onPress={() => this.copyToClipboard(orderData.payment.va_number)} style={{ flexDirection: 'row', backgroundColor: '#F26525', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F26525', borderRadius: 3, width: dimensions.width * 0.16, height: dimensions.height * 0.05 }}>
                    <Text style={{ color: 'white', fontFamily: fonts.medium, fontSize: 14 }}>Salin</Text>
                    <Icon name='content-copy' size={18} color='white' />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            : null
          }
        </View>
        {showReturButton &&
          <ButtonSecondaryOutlineSmall onPress={() => this.setupReturnRefund()}>
            <Row style={{ marginVertical: 5 }}>
              <Icon name='swap-horizontal' style={{ marginRight: 5 }} />
              <ButtonSecondaryOutlineTextSmall>Pengajuan Pengembalian</ButtonSecondaryOutlineTextSmall>
            </Row>
          </ButtonSecondaryOutlineSmall>
        }
        {(orderData.refund.length > 0)
          ? <View style={{ marginTop: 10, paddingVertical: 5, borderTopWidth: 1, borderColor: '#D4DCE6' }}>
            <Text style={{ marginBottom: 10, fontSize: 16, fontFamily: fonts.regular }}>Terdapat <Bold style={{ fontSize: 16 }}>{orderData.refund.length} order</Bold> dalam proses pengembalian</Text>
            <ButtonFilledPrimary onPress={() => this.props.navigation.navigate('ReturnRefundStatusPage', {
              orderData: {
                email: orderData.customer.email,
                order_id: orderData.order_no
              }
            })}>
              <ButtonFilledText>Cek status pengembalian</ButtonFilledText>
            </ButtonFilledPrimary>
          </View>
          : null
        }
        {map(orderData.shipment, (shipment, index) => (
          <OrderDetailBody key={`order detai
          l body ${index}`} navigation={this.props.navigation} shipment={shipment} index={index} updateStatusState={this.updateStatusState} callSnackbar={this.callSnackbar} />
        ))
        }
        {this.alertRender()}
      </Container>
    )
  }

  callSnackbar = (message, type, duration, callback) => {
    this.snackbar.current.call(message, type, duration, callback)
  }

  callSnackbarWithAction = (message, actionText, callback, duration) => {
    this.snackbar.current.callWithAction(message, actionText, callback, duration)
  }

  getContext () {
    let context = {
      callSnackbarWithAction: this.callSnackbarWithAction.bind(this),
      callSnackbar: this.callSnackbar.bind(this)
    }
    return context
  }

  render () {
    const { order } = this.state
    const orderData = order.data
    return (
      <ContextProvider value={this.getContext()}>

        <View style={{ flexDirection: 'column', backgroundColor: '#ffffff', paddingTop: 30 }}>
          <ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15 }}>
              <View />
              <TouchableOpacity onPress={() => this.copyToClipboardSnackbar(get(orderData, 'order_no', ''))} activeOpacity={1} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <PrimaryTextBold style={{ textAlign: 'center', fontSize: 16, paddingLeft: dimensions.width * 0.1 }}>{get(orderData, 'order_no', '')}</PrimaryTextBold>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Icon name='close-circle' color='#D4DCE6' size={24} />
              </TouchableOpacity>
            </View>
            {order.fetching && !isObject(orderData)
              ? <Loading />
              : !isEmpty(orderData)
                ? this.renderBody()
                : <Text style={{ fontFamily: fonts.regular, textAlign: 'center', marginTop: 20 }}>Order Tidak ditemukan</Text>
            }
          </ScrollView>
          {!order.fetching && !isEmpty(orderData) && <ChatButton />}
          {/* <Toast
          ref='toast'
          style={{ width: '100%', backgroundColor: '#049372', borderRadius: 0 }}
          position='top'
          positionValue={0}
          fadeInDuration={750}
          fadeOutDuration={1500}
          opacity={1}
          textStyle={{ color: '#FFFFFF', textAlign: 'center' }}
        /> */}
          {/* <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false)
          }}
        >
          <SafeAreaView>
            {(Platform.OS === 'ios') ? <StatusBar hidden /> : null}
            <HeaderSearchComponent back pageName='Review' leftAction={() => this.setModalVisible(false)} />
            <ReviewContainer
              showReviewImage
              showTags
              showDescription
              hideReviewButton
              showRating
              data={(!isEmpty(reviewData) && reviewData.reviews[0])} />
          </SafeAreaView>
        </Modal> */}
        </View>
        <Snackbar ref={this.snackbar} actionHandler={() => this.props.navigation.navigate('WishlistPage')} />

      </ContextProvider >
    )
  }
}

const mapStateToProps = (state) => ({
  order: state.order,
  reviewRating: state.reviewRating,
  reviewHandler: state.reviewHandler
})

const mapDispatchToProps = (dispatch) => ({
  getOrderDetail: (orderId, email) => dispatch(OrderActions.orderRequest(orderId, email)),
  initReviewData: () => dispatch(ReviewRatingActions.initReviewData()),
  orderInitHideDiv: () => dispatch(OrderActions.orderInitHideDiv())
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderStatusDetail)
