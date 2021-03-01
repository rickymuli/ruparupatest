import * as React from 'react'

import ProductDetailPage from '../Containers/ProductDetailPage'
// import ProfileModal from '../Containers/ProfileModal'
import EditProfile from '../Containers/EditProfile'
import AddressPage from '../Containers/AddressPage'
import AddEditAddressPage from '../Containers/AddEditAddressPage'
import VoucherPage from '../Containers/VoucherPage'
import PointPage from '../Containers/PointPage'
import WishlistPage from '../Containers/WishlistPage'
import CartPage from '../Containers/CartPage'
import ScanPage from '../Containers/ScanPage'
import ScanQrcode from '../Containers/ScanQrcode'
import SearchPage from '../Containers/SearchPage'
import PaymentPage from '../Containers/PaymentPage'
import StaticPage from '../Containers/StaticPage'
// import WebViewPage from '../Containers/WebViewPage'
// import IndexCategory from '../Containers/IndexCategory'
// import IndexSearch from '../Containers/IndexSearch'
import IndexProfile from '../Containers/IndexProfile'
import IndexOrderStatusPage from '../Containers/IndexOrderStatusPage'
import OrderStatusDetail from '../Containers/OrderStatusDetail'
import ProfilePage from '../Containers/ProfilePage'
// import NewsfeedPage from '../Containers/NewsfeedPage'
import TahuPage from '../Containers/TahuPage'
import TahuStatic from '../Containers/TahuStatic'
import ValidateOption from '../Containers/ValidateOption'
import ReviewRatingPage from '../Containers/ReviewRatingPage'
import CameraPage from '../Containers/CameraPage'
import ReviewDetailPage from '../Containers/ReviewDetailPage'
import RefundVoucherPage from '../Containers/RefundVoucherPage'
import ReturnRefundPage from '../Containers/ReturnRefundPage'
import ReturnRefundDetailPage from '../Containers/ReturnRefundDetailPage'
import ReturnRefundFinishPage from '../Containers/ReturnRefundFinishPage'
import AddEditBankAccount from '../Containers/AddEditBankAccount'
// import CameraPage from '../Containers/CameraPage'
// import Verification from '../Containers/Verification'
import MembershipPage from '../Containers/MembershipModal'
import ValidateOtp from '../Containers/ValidateOtp'
import ChangeEmail from '../Containers/ChangeEmail'
import ChangePhone from '../Containers/ChangePhone'
import UpdatePassword from '../Containers/UpdatePassword'
import UpdatePhone from '../Containers/UpdatePhone'
// import NewPcp from '../Containers/NewPcp'
// import HomeTabs from '../Containers/HomeTabs'
import Homepage from '../Containers/Homepage'
import ProductDetailPageStore from '../Containers/ProductDetailPageStore'
import StoreNewRetailValidation from '../Containers/StoreNewRetailValidation'
import ProductCataloguePage from '../Containers/ProductCataloguePage'
import AlgoliaProductCataloguePage from '../Containers/AlgoliaProductCataloguePage'
import ReturnRefundStatusPage from '../Containers/ReturnRefundStatusPage'
// import ReviewRatingPage from '../Containers/ReviewRatingPage'
import NearestStores from '../Containers/NearestStores'
import EditRefundStatusImagePage from '../Containers/EditRefundStatusImagePage'
import RoomSimulation from '../Containers/RoomSimulation'
import MemberRegistration from '../Containers/MemberRegistration'
import MemberUpgrade from '../Containers/MemberUpgrade'
import PasskeyVerification from '../Containers/PasskeyVerification'

import { SetTopLevelNav, SetState } from '../Services/NavigationService'
import TabBar from './TabBar'

import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ConfirmationReorder from '../Containers/ConfirmationReorder'
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
// import { useReduxDevToolsExtension } from '@react-navigation/devtools'

const BottomTab = createBottomTabNavigator()
const BottomTabNavigator = () => (
  <BottomTab.Navigator
    initialRouteName='Home'
    shifting={false}
    tabBarOptions={{
      activeTintColor: '#F26525',
      inactiveTintColor: '#D4DCE6',
      labelStyle: {
        fontFamily: 'Quicksand-Bold',
        fontSize: 9,
        marginTop: -5,
        marginBottom: 5
      }
    }}
    tabBar={props => <TabBar {...props} />}
  >
    <BottomTab.Screen name='Home' component={Homepage} />
    <BottomTab.Screen name='Wishlist' component={WishlistPage} />
    <BottomTab.Screen name='Scan' component={ScanPage} options={{ ...TransitionPresets.ModalSlideFromBottomIOS }} />
    <BottomTab.Screen name='Order' component={IndexOrderStatusPage} />
    <BottomTab.Screen name='Profil' component={IndexProfile} />
  </BottomTab.Navigator>
)

const Stack = createStackNavigator()

const StackNavigator = () => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='Homepage' component={BottomTabNavigator} />
    <Stack.Screen name='ProductCataloguePage' component={ProductCataloguePage} options={{ ...TransitionPresets.SlideFromRightIOS }} />
    <Stack.Screen name='AlgoliaProductCataloguePage' component={AlgoliaProductCataloguePage} options={{ ...TransitionPresets.SlideFromRightIOS }} />
    {/* <Stack.Screen name='ProductCataloguePage' component={NewPcp} /> */}
    <Stack.Screen name='ProductDetailPage' component={ProductDetailPage} options={{ ...TransitionPresets.SlideFromRightIOS }} />
    <Stack.Screen name='ProductDetailPageStore' component={ProductDetailPageStore} />
    <Stack.Screen name='ProfileModal' component={ProfilePage} />
    <Stack.Screen name='AddressPage' component={AddressPage} />
    <Stack.Screen name='WishlistPage' component={WishlistPage} />
    <Stack.Screen name='VoucherPage' component={VoucherPage} />
    <Stack.Screen name='PointPage' component={PointPage} />
    <Stack.Screen name='OrderStatusDetail' component={OrderStatusDetail} />
    <Stack.Screen name='EditProfile' component={EditProfile} />
    <Stack.Screen name='AddEditAddressPage' component={AddEditAddressPage} />
    <Stack.Screen name='ScanPage' component={ScanPage} options={{ ...TransitionPresets.ModalSlideFromBottomIOS }} />
    <Stack.Screen name='SearchPage' component={SearchPage} options={{ ...TransitionPresets.ModalSlideFromBottomIOS }} />
    <Stack.Screen name='CartPage' component={CartPage} options={{ ...TransitionPresets.SlideFromRightIOS }} />
    <Stack.Screen name='PaymentPage' component={PaymentPage} />
    <Stack.Screen name='PromoPage' component={TahuPage} />
    <Stack.Screen name='StoreNewRetailValidation' component={StoreNewRetailValidation} />
    <Stack.Screen name='UpdatePhone' component={UpdatePhone} />
    <Stack.Screen name='UpdatePassword' component={UpdatePassword} />
    <Stack.Screen name='TahuStatic' component={TahuStatic} />
    <Stack.Screen name='ChangePhone' component={ChangePhone} />
    <Stack.Screen name='ChangeEmail' component={ChangeEmail} />
    <Stack.Screen name='CameraPage' component={CameraPage} />
    <Stack.Screen name='ReviewRatingPage' component={ReviewRatingPage} />
    <Stack.Screen name='ReviewDetailPage' component={ReviewDetailPage} />
    <Stack.Screen name='RefundVoucherPage' component={RefundVoucherPage} />
    <Stack.Screen name='ReturnRefundPage' component={ReturnRefundPage} />
    <Stack.Screen name='ReturnRefundDetailPage' component={ReturnRefundDetailPage} />
    <Stack.Screen name='ReturnRefundFinishPage' component={ReturnRefundFinishPage} />
    <Stack.Screen name='AddEditBankAccount' component={AddEditBankAccount} />
    <Stack.Screen name='MembershipPage' component={MembershipPage} />
    <Stack.Screen name='MemberRegistration' component={MemberRegistration} />
    <Stack.Screen name='MemberUpgrade' component={MemberUpgrade} />
    <Stack.Screen name='PasskeyVerification' component={PasskeyVerification} />
    <Stack.Screen name='ValidateOption' component={ValidateOption} />
    <Stack.Screen name='ValidateOtp' component={ValidateOtp} />
    <Stack.Screen name='ReturnRefundStatusPage' component={ReturnRefundStatusPage} />
    <Stack.Screen name='NearestStores' component={NearestStores} />
    <Stack.Screen name='ConfirmationReorder' component={ConfirmationReorder} />
    <Stack.Screen name='EditRefundStatusImagePage' component={EditRefundStatusImagePage} />
    <Stack.Screen name='StaticPage' component={StaticPage} />
    <Stack.Screen name='ScanQrcode' component={ScanQrcode} />
    <Stack.Screen name='RoomSimulation' component={RoomSimulation} options={{ ...TransitionPresets.ModalSlideFromBottomIOS }} />
  </Stack.Navigator>
)

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white'
  }
}

function App () {
  // useReduxDevToolsExtension(SetTopLevelNav)
  return (
    <NavigationContainer ref={SetTopLevelNav} onStateChange={SetState} theme={Theme}>
      {StackNavigator()}
    </NavigationContainer>
  )
}

export default App
