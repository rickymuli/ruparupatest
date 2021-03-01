import React, { Component } from 'react'
import { View, FlatList, Platform, TouchableOpacity, Text, Linking, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { Bold, Container, ButtonFilledSmall, BR } from '../Styles/StyledComponents'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import Snackbar from '../Components/SnackbarComponent'
import analytics from '@react-native-firebase/analytics'

// Redux
import ReturnRefundActions from '../Redux/ReturnRefundRedux'
import ReturnRefundHandlerActions from '../Redux/ReturnRefundHandlerRedux'

// Context
import ContextProvider from '../Context/CustomContext'

// Components
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import ReturnRefundProductList from '../Components/ReturnRefundProductList'
import ReturnRefundMiniComponents from '../Components/ReturnRefundMiniComponents'
import ReturnRefundProgress from '../Components/ReturnRefundProgress'
import ReturnInfoComponent from '../Components/ReturnInfoComponent'
import Checkbox from '../Components/Checkbox'

class ReturnRefundDetailPage extends Component {
  constructor () {
    super()
    this.state = {
      progress: 0,
      pagesNames: [
        'Alasan pengembalian',
        'Unggah foto produk',
        'Pilih solusi pengembalian',
        'Ringkasan pengembalian',
        'Pengajuan pengembalian selesai'
      ],
      reasons: [],
      images: [],
      returnMethods: [],
      goToFinishPage: false,
      agreeTerms: false
    }
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {}
    if (!isEmpty(props.returnHandler.images)) {
      let imageState = JSON.parse(JSON.stringify(state.images))
      if (!isEmpty(imageState)) {
        let foundObj = false
        imageState.map((imageData, index) => {
          if (isEqual(String(imageData.id), String(props.returnHandler.images.id))) {
            imageData = props.returnHandler.images
            imageState[index] = imageData
            foundObj = true
          }
        })
        if (!foundObj) {
          imageState.push(props.returnHandler.images)
        }
      } else {
        imageState.push(props.returnHandler.images)
      }
      returnObj = {
        ...returnObj,
        images: imageState
      }
    }
    if (!isEmpty(props.returnRefund.result)) {
      returnObj = {
        ...returnObj,
        goToFinishPage: true
      }
    }
    return returnObj
  }

  componentDidMount () {
    const { returnHandler } = this.props
    let reasons = []
    let returnMethods = []
    returnHandler.products.map((productData, indexProduct) => {
      reasons.push({
        reasonId: '',
        reasonName: 'Pilih alasan pengembalian',
        notes: ''
      })
      returnMethods.push({
        reasonType: '',
        reasonName: ''
      })
    })
    this.setState({ reasons, returnMethods })
    this.props.returnMethodRequest()
    this.props.getReasonDataRequest()
  }

  setupState = (key, payload, index) => {
    let tempData = JSON.parse(JSON.stringify(this.state[key]))
    if (Array.isArray(tempData)) {
      tempData[index] = payload
    } else {
      tempData = payload
    }
    this.setState({ [key]: tempData })
  }

  componentWillUnmount () {
    this.props.initImage()
    this.modal = null
  }

  // Render Progress Bar
  renderProgressBar = () => {
    const { progress } = this.state
    let FinalProgressComponent = []
    for (let i = 0; i < 5; i++) {
      if (progress >= i) {
        FinalProgressComponent.push(<ReturnRefundProgress onProgress key={`return progress${i}`} />)
      } else {
        FinalProgressComponent.push(<ReturnRefundProgress onProgress={false} key={`return progress${i}`} />)
      }
    }
    return FinalProgressComponent
  }

  _renderHeader = () => {
    const { navigation, returnHandler } = this.props
    const { pagesNames, progress } = this.state
    return (
      <>
        <ReturnRefundProductList products={returnHandler.products} navigation={navigation} />
        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
          {this.renderProgressBar()}
        </View>
        <View style={{ padding: 15 }}>
          <Bold style={{ fontSize: 16 }}>{pagesNames[progress]}</Bold>
        </View>
        <ReturnInfoComponent />
      </>
    )
  }

  goBack = () => {
    if (this.state.progress !== 0) {
      this.setState({ progress: Number(this.state.progress) - 1 })
    } else {
      this.props.navigation.goBack()
    }
  }

  nextStep = () => {
    if (Number(this.state.progress) + 1 === 4) {
      this.submitData()
    } else {
      this.setState({ progress: Number(this.state.progress) + 1 })
    }
  }

  _renderFooter = () => {
    const { progress, reasons, returnMethods, images, agreeTerms } = this.state
    let verified = true
    if (progress === 0) {
      reasons.map((reason) => {
        if (isEmpty(String(reason.reasonId)) || isEmpty(reason.notes) || reason.notes.length < 20) {
          verified = false
        }
      })
    } else if (progress === 1) {
      let totalItem = 0
      this.props.returnHandler.products.map((product) => {
        totalItem += product.qty
      })
      if (images.length !== Number(totalItem) * 3) {
        verified = false
      } else {
        images.map((image) => {
          if (isEmpty(image)) {
            verified = false
          }
        })
      }
    } else if (progress === 2) {
      returnMethods.map((method) => {
        if (isEmpty(method.reasonType)) {
          verified = false
        }
      })
    } else if (progress === 3) {
      if (!agreeTerms) {
        verified = false
      }
    }
    return (
      <Container>
        {progress === 3
          ? <TouchableOpacity onPress={() => this.setState({ agreeTerms: !agreeTerms })} style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}>
            <Checkbox
              color='#F26525'
              selected={agreeTerms}
              onPress={() => this.setState({ agreeTerms: !agreeTerms })}
            />
            <View style={{ flexDirection: 'row', width: Dimensions.get('screen').width * 0.8, flexWrap: 'wrap' }}>
              <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886' }}>Saya setuju dengan</Text>
              <TouchableOpacity onPress={() => Linking.openURL('https://m.ruparupa.com/faq-pengembalian')}>
                <Text style={{ fontFamily: 'Quicksand-Bold', color: '#757886' }}>{` Syarat & ketentuan `}</Text>
              </TouchableOpacity>
              <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886' }}>di ruparupa.com</Text>
            </View>
          </TouchableOpacity>
          : null
        }
        <ButtonFilledSmall onPress={() => this.goBack()} style={{ backgroundColor: '#008CCF', borderColor: '#008CCF' }}>
          <Bold style={{ color: 'white', fontSize: 16 }}>Kembali</Bold>
        </ButtonFilledSmall>
        <BR />
        {(this.props.returnRefund.fetchingResult || !verified)
          ? <ButtonFilledSmall style={{ backgroundColor: '#D4DCE6', borderColor: '#D4DCE6' }}>
            <Bold style={{ color: 'white', fontSize: 16 }}>{!verified ? 'Lanjut' : 'Sedang diproses'}</Bold>
          </ButtonFilledSmall>
          : <ButtonFilledSmall onPress={() => this.nextStep()}>
            <Bold style={{ color: 'white', fontSize: 16 }}>Lanjut</Bold>
          </ButtonFilledSmall>
        }
      </Container>
    )
  }

  submitData = () => {
    const { returnRefund, returnHandler } = this.props
    const { reasons, returnMethods, images } = this.state
    let totalRefundArr = []
    // Find total refund from estimation data and get invoice number
    returnRefund.data.invoices.map((invoice) => {
      let totalRefund = 0
      returnRefund.estimationData.map((estimation) => {
        invoice.items.map(item => {
          if (item.sales_order_item_id === estimation.sales_order_item_id) {
            totalRefund += estimation.refund_product + estimation.refund_shipping + estimation.refund_voucher
          }
        })
        totalRefundArr.push({ totalRefund, invoiceNo: invoice.invoice_no })
      })
    })
    let detail = []
    returnHandler.invoices.map(invoice => {
      let newData = []
      returnHandler.products.map(product => {
        if (invoice.invoiceNo === product.invoiceNo) {
          let productIndex = returnHandler.products.findIndex(product => invoice.invoiceNo === product.invoiceNo)
          let productImages = []
          images.map((image) => {
            if (isEqual(String(product.sales_order_item_id), image.id.substring(image.id.toString().length - product.sales_order_item_id.toString().length, image.id.toString().length))) {
              let resultObj = {
                priority: parseInt(image.id),
                image_url: image.output
              }
              productImages.push(resultObj)
            }
          })
          let newDataObj = {
            itemData: product,
            qty: product.qty,
            reason: {
              reasonId: reasons[productIndex].reasonId,
              note: reasons[productIndex].notes
            },
            images: productImages,
            reasonType: returnMethods[productIndex].reasonType
          }
          newData.push(newDataObj)
        }
      })
      let finalObj = {
        ...invoice,
        totalRefund: totalRefundArr[totalRefundArr.findIndex(data => data.invoiceNo === invoice.invoiceNo)].totalRefund,
        newData
      }
      detail.push(finalObj)
    })
    let data = {
      orderNo: returnRefund.data.order_no,
      customerEmail: returnRefund.customerEmail,
      newAddress: returnHandler.address,
      detail
    }
    this.props.submitReturnRefundRequest(data)
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.progress === 3 && !isEqual(prevState.progress, this.state.progress)) {
      let items = []
      const { reasons } = this.state
      this.props.returnHandler.products.forEach((item, index) => {
        let promoItems = []
        item.promo_items.forEach((promo) => {
          promoItems.push({
            'sales_order_item_id': promo.sales_order_item_id,
            'qty_refunded': item.qty * promo.qty_ordered
          })
        })
        items.push({
          'sales_order_item_id': item.sales_order_item_id,
          'qty_refunded': item.qty,
          'refund_reason_id': parseInt(reasons[index].reasonId),
          'promo_items': promoItems
        })
      })
      this.props.getEstimation(items)
    }
    if (this.state.goToFinishPage) {
      analytics().logRefund({ transaction_id: this.props.returnRefund.data.order_no })
      this.props.navigation.navigate('ReturnRefundFinishPage')
    }
    if (!isEmpty(this.props.returnRefund.errResult)) {
      this.props.resetResult()
      this.modal.call(this.props.returnRefund.errResult, 'error', 1000)
    }
  }

  render () {
    const { returnHandler, returnRefund } = this.props
    const { progress, reasons, images, returnMethods } = this.state
    let removeClippedSubviews = Platform.OS === 'android' !== false
    return (
      <ContextProvider value={{
        navigation: this.props.navigation,
        setupState: this.setupState,
        reasons,
        images,
        returnMethods,
        progress,
        fetchingImageUrl: returnHandler.fetchingImageUrl,
        customerEmail: returnRefund.customerEmail,
        errImageUpload: returnHandler.errImageUpload
      }}>
        <HeaderSearchComponent back logo navigation={this.props.navigation} />
        <FlatList
          initialNumToRender={3}
          ListHeaderComponent={this._renderHeader}
          ListFooterComponent={this._renderFooter}
          removeClippedSubviews={removeClippedSubviews}
          data={returnHandler.products}
          extraData={[progress, reasons, images, returnMethods]}
          renderItem={({ item, index }) => (
            <ReturnRefundMiniComponents
              progress={progress}
              item={item}
              index={index}
            />
          )}
          keyExtractor={(item, index) => `reason per product ${index}`}
        />
        <Snackbar ref={ref => { this.modal = ref }} />
      </ContextProvider>
    )
  }
}

const mapStateToProps = (state) => ({
  returnRefund: state.returnRefund,
  returnHandler: state.returnHandler
})

const mapDispatchToProps = (dispatch) => ({
  getReasonDataRequest: () => dispatch(ReturnRefundActions.getReasonDataRequest()),
  returnMethodRequest: () => dispatch(ReturnRefundActions.returnMethodRequest()),
  submitReturnRefundRequest: (data) => dispatch(ReturnRefundActions.submitReturnRefundRequest(data)),
  getEstimation: (data) => dispatch(ReturnRefundActions.getEstimationRequest(data)),
  initImage: () => dispatch(ReturnRefundHandlerActions.initImage()),
  resetResult: () => dispatch(ReturnRefundActions.resetResult())
})

export default connect(mapStateToProps, mapDispatchToProps)(ReturnRefundDetailPage)
