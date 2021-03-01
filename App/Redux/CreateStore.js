import { createStore, applyMiddleware, compose } from 'redux'
import Rehydration from '../Services/Rehydration'
import ReduxPersist from '../Config/ReduxPersist'
// import Config from '../Config/DebugConfig'
import createSagaMiddleware from 'redux-saga'
import mainConfig from '../../config'
import logger from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25, features: { persist: true } })
// creates the store
export default (rootReducer, rootSaga) => {
  /* ------------- Redux Configuration ------------- */

  const middleware = []
  const enhancers = []

  /* ------------- Analytics Middleware ------------- */
  // middleware.push(ScreenTracking)

  /* ------------- Saga Middleware ------------- */

  const sagaMonitor = null
  const sagaMiddleware = createSagaMiddleware({ sagaMonitor })
  middleware.push(sagaMiddleware)

  /* ------------- Logger Middleware ------------- */
  if (mainConfig.DEBUG && __DEV__) {
    middleware.push(logger)
  } else if (__DEV__) {
    const createDebugger = require('redux-flipper').default
    let reduxDebugger = createDebugger()
    middleware.push(reduxDebugger)
  }

  /* ------------- Assemble Middleware ------------- */

  enhancers.push(composeEnhancers((applyMiddleware(...middleware))))
  const store = createStore(rootReducer, compose(...enhancers))

  // configure persistStore and check reducer version number
  if (ReduxPersist.active) {
    Rehydration.updateReducers(store)
  }

  // kick off root saga
  let sagasManager = sagaMiddleware.run(rootSaga)

  return {
    store,
    sagasManager,
    sagaMiddleware
  }
}
