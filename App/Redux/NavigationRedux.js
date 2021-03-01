import AppNavigation from '../Navigation/AppNavigation'
// import { NavigationActions } from 'react-navigation'

// const defaultGetStateForAction = StackNav.router.getStateForAction

export const reducer = (state, action) => {
  // StackNav.router.getStateForAction(action, state)
  // if (
  //   state &&
  //   action.type === NavigationActions.BACK &&
  //   state.routes[state.index].params.isEditing
  // ) {
  //   // Returning null from getStateForAction means that the action
  //   // has been handled/blocked, but there is not a new state
  //   return null
  // }
  // return defaultGetStateForAction(action, state)
  const newState = AppNavigation.router.getStateForAction(action, state)
  return newState || state
}
