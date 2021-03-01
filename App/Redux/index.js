import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'
import ReduxPersist from '../Config/ReduxPersist'

// Redux Component
import { reducer as authRedux } from './AuthRedux'
import { reducer as cartRedux } from './CartRedux'
import { reducer as inspirationRedux } from './InspirationRedux'
import { reducer as miscRedux } from './MiscRedux'
import { reducer as logRedux } from './LogRedux'
import { reducer as searchRedux } from './SearchRedux'
import { reducer as categoryDetailRedux } from './CategoryDetailRedux'
import { reducer as productRedux } from './ProductRedux'
import { reducer as productDetailRedux } from './ProductDetailRedux'
import { reducer as navigationFilterRedux } from './NavigationFilterRedux'
import { reducer as orderRedux } from './OrderRedux'
import { reducer as productLastSeenRedux } from './ProductLastSeenRedux'
import { reducer as userRedux } from './UserRedux'
import { reducer as registerRedux } from './RegisterRedux'
import { reducer as newsletterRedux } from './NewsletterRedux'
import { reducer as addressRedux } from './AddressRedux'
import { reducer as staticRedux } from './StaticRedux'
import { reducer as emailRedux } from './EmailRedux'
import { reducer as searchHistoryRedux } from './SearchHistoryRedux'
import { reducer as newsFeedRedux } from './NewsFeedRedux'
import { reducer as tahuRedux } from './TahuRedux'
import { reducer as otpRedux } from './OtpRedux'
import { reducer as locationRedux } from './LocationRedux'
import { reducer as productHandlerRedux } from './ProductHandler'
import { reducer as storeDataRedux } from './StoreDataRedux'
import { reducer as storeNewRetailRedux } from './StoreNewRetailRedux'
import { reducer as reviewRatingRedux } from './ReviewRatingRedux'
import { reducer as reviewHandlerRedux } from './ReviewHandlerRedux'
import { reducer as returnRefundRedux } from './ReturnRefundRedux'
import { reducer as returnRefundHandler } from './ReturnRefundHandlerRedux'
import { reducer as voucherRedux } from './VoucherRedux'
import { reducer as membershipRedux } from './MembershipRedux'
import { reducer as storeLocationRedux } from './StoreLocationRedux'
import { reducer as remoteConfigRedux } from './RemoteConfigRedux'
import { reducer as reorderRedux } from './ReorderRedux'
import { reducer as prevSearchRedux } from './PrevSearchRedux'
import { reducer as memberRegistrationRedux } from './MemberRegistrationRedux'
import { reducer as loginMemberRedux } from './LoginMembershipRedux'

/* ------------- Assemble The Reducers ------------- */
const reducers = {
  auth: authRedux,
  address: addressRedux,
  cart: cartRedux,
  categoryDetail: categoryDetailRedux,
  email: emailRedux,
  history: searchHistoryRedux,
  inspiration: inspirationRedux,
  location: locationRedux,
  log: logRedux,
  misc: miscRedux,
  membership: membershipRedux,
  // nav: require('./NavigationRedux').reducer,
  navigationFilter: navigationFilterRedux,
  newsFeed: newsFeedRedux,
  newsletter: newsletterRedux,
  order: orderRedux,
  prevSearch: prevSearchRedux,
  product: productRedux,
  productDetail: productDetailRedux,
  productLastSeen: productLastSeenRedux,
  register: registerRedux,
  remoteConfig: remoteConfigRedux,
  returnRefund: returnRefundRedux,
  returnHandler: returnRefundHandler,
  reviewHandler: reviewHandlerRedux,
  reviewRating: reviewRatingRedux,
  search: searchRedux,
  static: staticRedux,
  storeData: storeDataRedux,
  user: userRedux,
  tahu: tahuRedux,
  otp: otpRedux,
  productHandler: productHandlerRedux,
  storeNewRetail: storeNewRetailRedux,
  reorder: reorderRedux,
  voucher: voucherRedux,
  storeLocation: storeLocationRedux,
  memberRegistration: memberRegistrationRedux,
  loginMember: loginMemberRedux
}

let finalReducers = reducers
// If rehydration is on use persistReducer otherwise default combineReducers
if (ReduxPersist.active) {
  const persistConfig = ReduxPersist.storeConfig
  finalReducers = persistReducer(persistConfig, combineReducers(Object.assign({}, reducers)))
}

let { store, sagasManager, sagaMiddleware } = configureStore(finalReducers, rootSaga)

if (module.hot) {
  module.hot.accept(() => {
    const nextRootReducer = require('./').reducers
    store.replaceReducer(nextRootReducer)

    const newYieldedSagas = require('../Sagas').default
    sagasManager.cancel()
    sagasManager.done.then(() => {
      sagasManager = sagaMiddleware.run(newYieldedSagas)
    })
  })
}
export default { store }
