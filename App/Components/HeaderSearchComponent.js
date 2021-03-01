import React, { Component } from 'react'
import { View, Text, Image, Linking, Platform, TouchableOpacity, TouchableWithoutFeedback, Dimensions, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IconAnt from 'react-native-vector-icons/AntDesign'
import { Navigate } from '../Services/NavigationService'
import isEmpty from 'lodash/isEmpty'
import delay from 'lodash/delay'
import config from '../../config.js'
import {
  Freshchat,
  FaqOptions
} from 'react-native-freshchat-sdk'
// import Modal from 'react-native-modal'
import EasyModal from './EasyModal'

// Styles
// import styles from './Styles/HeaderSearchStyle'
import styled from 'styled-components'
import { fonts, PrimaryTextBold } from '../Styles'

// Component
import HeadGtm from './HeadGtm'
import Loading from './LoadingComponent'
import TooltipWalkthrough from './TooltipWalkthrough'

// Redux
import CartActions from '../Redux/CartRedux'

const { width, height } = Dimensions.get('screen')

class HeaderSearchComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchItem: props.search || '',
      searchDisplay: props.search || ''
    }
  }

  componentDidMount () {
    // ((this.props).hasOwnProperty('cartIcon')) && this.props.cartRequest()
    // if ((this.props).hasOwnProperty('help')) this.firstPop.startTooltip('FreshChat')
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.search !== prevState.search) { return { searchDisplay: nextProps.search } }
    return null
  }

  _goToSearch () {
    const { searchDisplay } = this.state
    if (this.props.validatepdp) { this.props.validatepdp() }
    Navigate('SearchPage', {
      searchKeyword: typeof (searchDisplay) === 'boolean' ? '' : searchDisplay
    }, `headerSearch`)
  }

  goToNewsfeedPage () {
    this.props.resetNotif()
    this.props.navigation.navigate('NewsfeedPage')
  }

  startFreshchat () {
    var faqOptions = new FaqOptions()
    faqOptions.showContactUsOnFaqScreens = true
    faqOptions.showContactUsOnFaqNotHelpful = true
    Freshchat.showFAQs(faqOptions)
  }

  openFreshChat () {
    // const { authUser } = this.props
    if (Platform.OS === 'ios') {
      this.refs.contactUs.setModal(false)
      delay(function (text) {
        var faqOptions = new FaqOptions()
        faqOptions.showContactUsOnFaqScreens = true
        faqOptions.showContactUsOnFaqNotHelpful = true
        Freshchat.showFAQs(faqOptions)
      }, 200, 'later')
    } else this.startFreshchat()
    // if (authUser) {
    // } else {
    //   this.refs.contactUs.setModal(false)
    //   this.props.navigation.navigate('LoginRegisterPage')
    // }
  }

  renderModalnNextPop () {
    // this.firstPop.getAndSetTooltipVisible(false)
    this.refs.contactUs.setModal(true)
    this.firstPop.storeData('FreshChat')
    // setTimeout(() => {
    //   this.scrollView.scrollToEnd({ animated: true })
    //   this.thirdPop.visible()
    // }, 100)
  }

  renderLefthead () {
    const { back, home, help, leftAction } = this.props
    if (back) {
      // let index = this.props.navigation.dangerouslyGetParent().state.index // Checking if its possible to go back to previous page
      return (
        <TouchPointIcon
          onPress={() =>
            leftAction
              ? leftAction()
              : this.props.navigation.goBack()
            // ? this.props.navigation.goBack()
            // : this.props.navigation.navigate('Homepage')
          }
          hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }} >
          <View>
            <Icon name='arrow-left' size={24} style={{ color: '#555761' }} />
          </View>
        </TouchPointIcon>
      )
    } else if (home) {
      return (
        <TouchPointIcon onPress={() => Navigate('Home')} hitSlop={{ bottom: 20, top: 20, left: 50, right: 50 }}>
          <View>
            <Image style={{ width: 24, height: 24 }} source={require('../assets/images/home-header-index.webp')} />
          </View>
        </TouchPointIcon>
      )
    } else if (help) {
      return (
        // <TouchPointIcon onPress={() => Linking.openURL(`mailto:${config.defaultMailto}`)} hitSlop={{ bottom: 20, top: 20, left: 50, right: 50 }}>
        <TooltipWalkthrough
          ref={ref => { this.firstPop = ref }}
          position={'bottom'}
          content={<View>
            <Text style={{ color: '#757886', fontFamily: 'Quicksand-Medium', fontSize: 18 }}>Hi Ruppers! Sekarang fitur live chat sudah dapat digunakan di aplikasi mobile kami.</Text>
          </View>}
          nextAction={() => this.renderModalnNextPop()}
        // done={'FreshChat'}
        >
          <TouchPointIcon onPress={() => this.refs.contactUs.setModal(true)} hitSlop={{ bottom: 20, top: 20, left: 50, right: 50 }}>
            <View>
              <IconAnt name='customerservice' size={24} color='#555761' />
            </View>
          </TouchPointIcon>
        </TooltipWalkthrough>
      )
    } else {
      return (<EmptyView />)
    }
  }

  renderIconScan () {
    return (
      <TouchableOpacity onPress={() => Navigate('ScanPage')} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <IconAnt name={'scan1'} size={22} color={'#555761'} />
      </TouchableOpacity>
    )
  }

  renderMidHead () {
    const { searchDisplay } = this.state
    const { pageName, logo, searchBarcode, stickyHeaderHome, scrollEventY } = this.props
    if (stickyHeaderHome) {
      return (
        <View style={{ alignSelf: 'center', paddingHorizontal: 18 }}>
          {this.renderLogo({ opacity: scrollEventY > 0 ? 0 : 1 })}
          {this.renderSearch({ opacity: scrollEventY })}
        </View>
      )
    } else if ((this.props).hasOwnProperty('search')) {
      return (
        <SearchTouch onPress={() => this._goToSearch()}>
          {(!isEmpty(searchDisplay))
            ? <TextSecondarySearch>{searchDisplay.length > 20 ? searchDisplay.substring(0, 17) + '...' : searchDisplay}</TextSecondarySearch>
            : <TextSecondarySearch>Cari di <TextGray>rup</TextGray><TextBlue>a</TextBlue><TextGray>rup</TextGray><TextOrange>a</TextOrange></TextSecondarySearch>
          }
          {searchBarcode && this.renderIconScan()}
        </SearchTouch>
      )
    } else if (pageName) {
      return (
        <Title>
          <PrimaryTextBold style={{ fontSize: 19, textAlign: 'center', paddingBottom: 10 }}>{pageName}</PrimaryTextBold>
        </Title>
      )
    } else if (logo) return (<>{this.renderLogo()}</>)
    else return null
  }

  renderSearch = (style = {}) => (
    <TouchableWithoutFeedback onPress={() => this._goToSearch()}>
      <SearchTouchView style={style}>
        <TextSecondarySearch>Cari di <TextGray>rup</TextGray><TextBlue>a</TextBlue><TextGray>rup</TextGray><TextOrange>a</TextOrange></TextSecondarySearch>
        {this.renderIconScan()}
      </SearchTouchView>
    </TouchableWithoutFeedback>
  )

  // renderLogo = (style = {}) => (
  //   <View style={[{ alignItems: 'center', alignSelf: 'center', postion: 'absolute', flex: 1 }, style]}>
  //     <Image style={{ width: width * 0.7, height: width * 0.1 }} source={require('../assets/images/promo/logo-promo-12-12.webp')} resizeMode='contain' />
  //   </View>
  // )
  renderLogo = (style = {}) => (
    <View style={[{ alignItems: 'center', alignSelf: 'center', postion: 'absolute', flex: 1 }, style]}>
      <Image style={{ width: width * 0.55, height: width * 0.1 }} source={require('../assets/images/ruparupa-logo-copy.webp')} resizeMode='contain' />
    </View>
  )

  renderRightHead () {
    const { barcode, cartIcon, cart, refresh, close, rightAction, itmData = {} } = this.props
    if (barcode) {
      return (<>{this.renderIconScan()}</>)
    } else if (cartIcon) {
      return (
        <TouchPointIcon onPress={() => Navigate('CartPage', { itmData })}>
          {/* <Image style={{ width: 24, height: 24 }} source={require('../assets/images/shopping-cart.webp')} /> */}
          <IconAnt name={'shoppingcart'} size={24} color={'#555761'} />
          <View style={{ borderRadius: 100 / 2, backgroundColor: '#008CCF', justifyContent: 'center', alignItems: 'center', width: 16, height: 16, top: -4, right: 10, position: 'absolute' }}>
            {(cart.fetching)
              ? <Loading size='small' color='white' />
              : <Text style={{ fontFamily: 'Quicksand-Medium', color: '#ffffff', textAlign: 'center', fontSize: 12, marginBottom: (Platform.OS === 'ios' ? 0 : 2) }}>{(cart && cart.data !== null) ? cart.data.total_qty_item : '0'}</Text>
            }
          </View>
        </TouchPointIcon>
      )
    } else if (close) {
      return (
        <TouchPointIcon onPress={() => (rightAction) ? rightAction() : this.props.navigation.goBack()} hitSlop={{ bottom: 20, top: 20, left: 50, right: 50 }}>
          <View>
            <Icon name='close-circle' size={24} color='#D4DCE6' />
          </View>
        </TouchPointIcon>
      )
    } else if (refresh) {
      return (
        <TouchPointIcon onPress={() => rightAction()} hitSlop={{ bottom: 20, top: 20, left: 50, right: 50 }}>
          <View>
            <Icon name='refresh' size={24} />
          </View>
        </TouchPointIcon>
      )
    } else {
      return (<EmptyView />)
    }
  }

  renderContactUs () {
    return (
      <EasyModal ref='contactUs' size={40} title='Hubungi Kami' close>
        <ScrollView ref={ref => { this.scrollView = ref }} style={{ width, height: height * 0.4 }}>
          <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${config.defaultMailto}`)}>
              <View style={{ backgroundColor: 'white', padding: 10, justifyContent: 'flex-start', flexDirection: 'row', marginVertical: 10, marginLeft: 20, width, textAlign: 'left' }}>
                <IconAnt name='mail' size={20} style={{ marginRight: 7 }} /><Text style={{ fontFamily: fonts.regular, fontWeight: '700' }}>E-mail: </Text><Text style={{ fontFamily: 'Quicksand-Regular' }}>{config.defaultMailto}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${config.defaultPhone}`)}>
              <View style={{ backgroundColor: 'white', padding: 10, justifyContent: 'flex-start', flexDirection: 'row', marginVertical: 10, marginLeft: 20, width, textAlign: 'left' }}>
                <Image style={{ width: 20, height: 20, marginRight: 7 }} source={require('../assets/images/help-index-icon/help-index-icon.webp')} /><Text style={{ fontFamily: 'Quicksand-Regular', fontWeight: '700' }}>Phone: </Text><Text style={{ fontFamily: 'Quicksand-Regular' }}>{config.defaultPhone}</Text>
              </View>
            </TouchableOpacity>
            {/* <TooltipWalkthrough
                ref={ref => { this.thirdPop = ref }}
                name={'thirdPop'}
                content={<Text style={{ color: '#757886', fontFamily: fonts.medium, fontSize: 18 }}>Pilih opsi "Live Chat" untuk memulai chat dengan customer service kami</Text>}
                done={'FreshChat'}
              // nextAction={() => this.secondPop.visible()}
              > */}
            <TouchableOpacity onPress={() => this.openFreshChat()}>
              <View style={{ borderRadius: 100 / 2, backgroundColor: 'white', padding: 10, justifyContent: 'flex-start', flexDirection: 'row', marginVertical: 10, marginLeft: 20, width, textAlign: 'left' }}>
                <IconAnt name='message1' size={20} style={{ marginRight: 7 }} /><Text style={{ fontFamily: fonts.regular, fontWeight: '700' }}>Live Chat</Text>
              </View>
            </TouchableOpacity>
            {/* </TooltipWalkthrough> */}
          </View>
        </ScrollView>
      </EasyModal>
    )
  }

  render () {
    // const { contactVisible } = this.state
    const { withoutBoxShadow, pageType, pageName, help, noSafeHeader } = this.props
    let CardHeaderComponent = withoutBoxShadow ? IndexCardHeaderSearch : CardHeaderSearch
    let pageCategory = !isEmpty(pageType) ? pageType : !isEmpty(pageName) ? pageName : ''
    return (
      <CardHeaderComponent>
        <HeadGtm pageType={pageCategory} />
        <DistributeSpaceBetween noSafeHeader={noSafeHeader}>
          {this.renderLefthead()}
          {this.renderMidHead()}
          {this.renderRightHead()}
        </DistributeSpaceBetween>
        {help && this.renderContactUs()}
      </CardHeaderComponent>
    )
  }
}

const stateToProps = (state) => ({
  authUser: state.auth.user,
  cart: state.cart
})

const dispatchToProps = (dispatch) => ({
  cartRequest: () => dispatch(CartActions.cartRequest())
})

export default connect(stateToProps, dispatchToProps)(HeaderSearchComponent)

const CardHeaderSearch = styled.View`
padding-top: 10px;
background-color: white;
box-shadow: 1px 1px 1px #D4DCE6;
elevation:2;
`
const IndexCardHeaderSearch = styled.View`
padding-top: 10px;
background-color: white;
`
const DistributeSpaceBetween = styled.View`
padding-top: ${props => props.noSafeHeader ? '10px' : '30px'};
align-items: center;
flex-direction: row;
justify-content: space-between;
`
const Title = styled.View`
padding-horizontal: 10;
padding-bottom: 2;
align-items: center;
flexDirection: row;
justifyContent: center;
`
const EmptyView = styled.View`
padding-horizontal: 34;
`
const TouchPointIcon = styled.TouchableOpacity`
align-self:center;
margin-bottom:10px;
padding-horizontal: 20;
`
const SearchTouchView = styled.View`
  width: ${width * 0.55};
  align-self: center;
  align-items: center;
  position: absolute;
  flex-direction: row;
  justify-content: space-between;
  border: 1px #e5e9f2 solid;
  padding-horizontal: 10;
  border-radius: 30;
  margin-top: -10;
`

const SearchTouch = styled.TouchableOpacity`
flex-direction: row;
justify-content: space-between;
border: 1px #e5e9f2 solid;
border-radius: 3px;
margin-top: 0px;
margin-bottom: 10px;
flex: 1;
align-items: center;
padding-left: 10px;
padding-right: 10px;
padding-top: 5px;
border-radius: 30;
padding-bottom: 5px;
`
const TextSecondarySearch = styled.Text`
color: #555761;
font-size: 14px;
padding:5px;
font-family:${fonts.regular};
`

const TextOrange = styled.Text`
color: #F26525;
font-family:${fonts.bold};
`
const TextBlue = styled.Text`
color: #008CCF;
font-family:${fonts.bold};
`
const TextGray = styled.Text`
color: #555761;
font-family:${fonts.bold};
`
