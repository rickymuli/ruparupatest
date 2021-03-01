import React, { PureComponent } from 'react'
import { View, ImageBackground, Dimensions, Platform, RefreshControl, ScrollView, Text, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import get from 'lodash/get'
import has from 'lodash/has'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import map from 'lodash/map'
import ContextProvider from '../Context/CustomContext'

// Redux
import TahuActions from '../Redux/TahuRedux'
import MiscActions from '../Redux/MiscRedux'

// UI-UX component
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import SnackbarComponent from '../Components/SnackbarComponent'
import Loading from '../Components/LottieComponent'

// Tahu conditional rendering component
import TahuMain from '../Components/TahuMain'

const { width, height } = Dimensions.get('screen')
class TahuPage extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      itemDetail: props.route.params?.itemDetail ?? null,
      backgroundColor: null,
      backgroundImgUrl: null,
      tahuComponents: null
    }
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {}
    if (!props.tahu.fetching && !isEmpty(props.tahu.data) && props.tahu.data !== 'no-campaign') {
      returnObj = {
        ...returnObj,
        tahuComponents: props.tahu.data.template_components,
        backgroundColor: props.tahu.data.calendar_styles.background_color,
        backgroundImgUrl: props.tahu.data.background
      }
    }
    if (!isEqual(props.route.params?.itemDetail ?? null, state.itemDetail)) {
      returnObj = {
        ...returnObj,
        itemDetail: props.route.params?.itemDetail ?? null
      }
    }
    return returnObj
  }

  componentDidMount () {
    this.verifyStaticRequest()
  }

  componentDidUpdate (prevProps) {
    const { misc, route } = this.props
    if (has(misc, 'verifyStatic.url_key')) {
      const data = {
        campaignId: misc.verifyStatic.reference_id,
        os: Platform.OS,
        companyCode: get(this.state.itemDetail, 'data.company_code', '')
      }
      this.props.miscVerifyStaticInit()
      this.props.tahuRequest(data)
    }
    let itemDetail = route.params?.itemDetail ?? {}
    let prevItemDetail = prevProps.route.params?.itemDetail ?? {}
    if (itemDetail && itemDetail !== prevItemDetail && !misc.fetching) {
      this.setState({ itemDetail }, () => this.verifyStaticRequest())
    }
  }

  verifyStaticRequest () {
    const { itemDetail } = this.state
    let data = {
      url_key: get(itemDetail, 'data.url_key', ''),
      company_code: get(itemDetail, 'data.company_code', '')
    }
    this.props.miscVerifyStaticRequest(data)
  }

  toggleWishlist = (message) => {
    this.refs.child.callWithAction(message, 'Lihat Wishlist')
  }

  callSnackbar = (message, type) => {
    this.refs.child.call(message, type)
  }

  gotowishlist = () => {
    this.props.navigation.navigate('Homepage', { screen: 'Wishlist' })
  }

  refreshItems () {
    this.verifyStaticRequest()
  }

  renderExpiredPromo () {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
        <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 28, textAlign: 'center' }}>Promo Tidak Ditemukan</Text>
        <Image source={require('../assets/images/promo/promo-berakhir.webp')} style={{ height: width, width: width * 0.9, marginVertical: 20 }} />
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Homepage')} style={{ backgroundColor: '#F26525', alignSelf: 'center', paddingVertical: 10, paddingHorizontal: 26, borderRadius: 5, marginTop: 8 }}>
          <Text style={{ fontFamily: 'Quicksand-Bold', textAlign: 'center', color: 'white', fontSize: 20 }}>Kembali Ke Home</Text>
        </TouchableOpacity>
      </View>
    )
  }

  getContext = () => {
    let context = {
      companyCode: get(this.state.itemDetail, 'data.company_code', '')
    }
    return context
  }

  renderContent () {
    const { tahuComponents, backgroundColor, backgroundImgUrl } = this.state
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={this.refreshItems.bind(this)}
          />
        }
        style={{ flex: 1 }}>
        {map(tahuComponents, (item, i) =>
          <View style={{ backgroundColor: isEmpty(backgroundImgUrl) && `#${backgroundColor}`, flex: 1 }} key={i}>
            <TahuMain item={item} navigation={this.props.navigation} toggleWishlist={this.toggleWishlist} callSnackbar={this.callSnackbar} />
          </View>
        )}
      </ScrollView>
    )
  }

  renderContentWithBackgroundImage () {
    const { backgroundImgUrl } = this.state
    return (
      <ImageBackground style={{ width: width, height: height, flex: 1 }} source={{ uri: backgroundImgUrl }} >
        {this.renderContent()}
      </ImageBackground>
    )
  }

  getContext = () => {
    let context = {
      companyCode: get(this.state.itemDetail, 'data.company_code', '')
    }
    return context
  }

  render () {
    const { tahuComponents, backgroundImgUrl } = this.state
    const { tahu } = this.props
    return (
      <>
        <ContextProvider value={this.getContext()}>
          <HeaderSearchComponent home back search cartIcon navigation={this.props.navigation} pageType={'tahu-page'} />
          {(tahu.fetching)
            ? <Loading />
            : !tahuComponents
              ? this.renderExpiredPromo()
              : backgroundImgUrl
                ? this.renderContentWithBackgroundImage()
                : this.renderContent()
          }
          <SnackbarComponent ref='child' actionHandler={this.gotowishlist} />
        </ContextProvider>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  tahu: state.tahu,
  misc: state.misc
})

const mapDispatchToProps = (dispatch) => ({
  tahuRequest: (data) => dispatch(TahuActions.tahuRequest(data)),
  miscVerifyStaticRequest: (data) => dispatch(MiscActions.miscVerifyStaticRequest(data)),
  miscVerifyStaticInit: () => dispatch(MiscActions.miscVerifyStaticInit())
})

export default connect(mapStateToProps, mapDispatchToProps)(TahuPage)
