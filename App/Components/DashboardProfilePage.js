import React, { Component } from 'react'
import { View, ScrollView, Platform, Linking } from 'react-native'
import isEmpty from 'lodash/isEmpty'
import { connect } from 'react-redux'
import config from '../../config'
import getVersion from '../Services/GetVersion'

// Redux
import UserActions from '../Redux/UserRedux'
import OrderActions from '../Redux/OrderRedux'
import AddressActions from '../Redux/AddressRedux'

// Components
import DashboardWelcome from './DashboardWelcome'
import DashboardNavigation from './DashboardNavigation'
import ProfileSummaryDashboard from './ProfileSummaryDashboard'
import DashboardAddress from './DashboardAddress'
// import DashboardOrder from './DashboardOrder'
import ChatButton from './ChatButton'
// import LogoutButton from './LogoutButton'
import HeaderSearchComponent from './HeaderSearchComponent'
import Snackbar from '../Components/SnackbarComponent'
import TermsAndConditionComponent from './TermsAndConditionComponent'
import DashboardButtonNavigationFull from './DashboardButtonNavigationFull'
import { setUpIdentityLoggedIn } from '../Services/Smartlook'
import { PrimaryTextBold } from '../Styles'
/**
 * Upper buttons
 * Account summary
 * Delivery Address
 * Order
 */

class DashboardProfilePage extends Component {
  static navigationOptions = {
    header: null
  }

  constructor (props) {
    super(props)
    this.state = {
      user: props.user,
      address: props.address || []
    }
  }

  componentWillReceiveProps (newProps) {
    const { user, address } = newProps
    if (!user.fetching) {
      this.setState({ user })
      if (user.user) setUpIdentityLoggedIn(user.user.customer_id, user.user.email, user.user.first_name)
    }
    if (address.data && address.data.length > 0 && address.data[0].is_default === '1') {
      this.setState({ address: address.data[0] })
    } else {
      this.setState({ address: [] })
    }
  }

  componentDidMount () {
    this.initPage()
  }

  componentDidUpdate (prevProps, prevState) {
    const { user, loginMember } = this.props
    if (!user.fetching && user.err && user.err === 'Terjadi kesalahan koneksi') {
      this.snackbarWithAction(this.props.user.err, 'Coba lagi', this.initPage.bind(this), 0)
    }
    if (prevProps.loginMember.data !== loginMember.data && !loginMember.fetching) {
      this.callSnackbar('Data membership berhasil tersimpan')
    }
  }

  callSnackbar = (message, type, duration, callback) => {
    this.refs.child.call(message, type, duration, callback)
  }

  snackbarWithAction (message, actionName, callback, duration) {
    this.refs.child.callWithAction(message, actionName, callback.bind(this), duration)
  }

  snackbarForceClose () {
    this.refs.child.forceClose()
  }

  checkVersion () {
    let stg = config.developmentENV === 'stg'
    let version = ''
    if (Platform.OS === 'ios') {
      version = stg ? config.versionStgIos : config.versionIos
    } else {
      version = stg ? config.versionStgAndroid : config.versionAndroid
    }
    return `Versi ${version}`
  }

  initPage () {
    this.props.getUserData()
    // this.props.getOrderList()
    this.props.getAddress()
    // this.props.userGetAllWishlistRequest()
    this.snackbarForceClose()
  }

  render () {
    const { user, address } = this.state
    const { storeNewRetail } = this.props
    return (
      <View style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
        <HeaderSearchComponent help search cartIcon pageType='profile-page' navigation={this.props.navigation} />
        <ScrollView>
          <DashboardWelcome user={user} />
          <ProfileSummaryDashboard navigation={this.props.navigation} user={user} />
          <DashboardAddress navigation={this.props.navigation} address={address} />
          {/* <DashboardOrder navigation={this.props.navigation} order={order} /> */}
          <DashboardNavigation navigation={this.props.navigation} />
          {/* <DashboardButtonNavigationFull title='Review Rating' iconName='star' pressAction={() => this.props.navigation.navigate('ReviewRatingPage')} /> */}
          <DashboardButtonNavigationFull title='Toko Dekat Saya' iconName='map-marker' pressAction={() => this.props.navigation.navigate('NearestStores')} />
          <DashboardButtonNavigationFull title='Pusat Bantuan' iconName='information-outline' pressAction={() => Linking.openURL('https://m.ruparupa.com/help-center')} />
          <TermsAndConditionComponent useButton />
          {!isEmpty(storeNewRetail) && !isEmpty(storeNewRetail.data) && <DashboardButtonNavigationFull title='Keluar dari Toko' iconName='exit-to-app' navigation={this.props.navigation} />}
          <DashboardButtonNavigationFull title='Keluar' iconName='exit-to-app' navigation={this.props.navigation} />
          <View style={{ padding: 15 }}>
            <PrimaryTextBold style={{ fontSize: 16, textAlign: 'center' }}>{getVersion()}</PrimaryTextBold>
          </View>
        </ScrollView>
        <Snackbar ref='child' />
        <ChatButton />
      </View>
    )
  }
}

const stateToProps = (state) => ({
  storeNewRetail: state.storeNewRetail,
  user: state.user,
  order: state.order,
  address: state.address,
  loginMember: state.loginMember
})

const dispatchToProps = (dispatch) => ({
  getUserData: () => dispatch(UserActions.userRequest()),
  userGetAllWishlistRequest: () => dispatch(UserActions.userGetAllWishlistRequest()),
  getOrderList: () => dispatch(OrderActions.orderListRequest()),
  getAddress: () => dispatch(AddressActions.addressRequest())
})

export default connect(stateToProps, dispatchToProps)(DashboardProfilePage)
