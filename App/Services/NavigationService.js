// import { NavigationActions } from 'react-navigation'
import { StackActions } from '@react-navigation/routers'
import { CommonActions } from '@react-navigation/native'
import * as Sentry from '@sentry/react-native'

let _navigator
let _state

export const SetTopLevelNav = (navRef) => {
  // Sentry.addBreadcrumb({
  //   category: "auth",
  //   message: "Authenticated user " + user.email,
  //   level: Sentry.Severity.Info,
  // });
  if (navRef) _navigator = navRef
}

export const SetState = (state) => {
  var routes = state?.routes || []
  var index = routes.length
  Sentry.addBreadcrumb({
    type: 'navigation',
    category: 'navigation',
    data: {
      from: routes[index]?.name ?? '',
      to: routes[index - 1]?.name ?? '',
      params: JSON.stringify(routes[index - 1]?.params ?? {})
    }
  })
  // Sentry.addBreadcrumb({
  //   type: "navigation",
  //   category: "navigation",
  //   data: state||{},
  //   message: '',
  //   level: Sentry.Severity.Info,
  // });
  _state = state
}

export const Navigate = (routeName, params = {}) => {
  _navigator.dispatch(
    CommonActions.navigate({
      name: routeName,
      params
    })
  )
}

export const Push = (routeName, params = {}, key = null) => {
  let navigation = { name: routeName, params }
  if (key) navigation['key'] = key

  _navigator.dispatch(
    CommonActions.navigate(navigation)
  )
}

export const Listener = (listen, callback) => {
  _navigator.dispatch(CommonActions.addListener(listen, () => callback()))
}

export const Replace = (routeName, params = {}) => {
  _navigator.dispatch(
    StackActions.replace(routeName, { ...params })
  )
  // _navigator.dispatch(
  //   StackActions.replace({
  //     routeName,
  //     params
  //   })
  // )
}

export const GetNavStack = () => _navigator && _navigator.state

export const GetState = () => _state

export const Navigator = () => _navigator

export const GetNavParam = (name, defaultValue = {}) => {
  _navigator.dispatch(
    StackActions.getParam({
      name,
      defaultValue
    })
  )
}

// add other navigation functions that you need and export them

export default {
  Navigate,
  GetNavParam,
  SetTopLevelNav,
  GetNavStack
}
