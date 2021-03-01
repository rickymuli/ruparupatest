import React from 'react'
import { BackHandler, Platform } from 'react-native'
import { SetTopLevelNav } from '../Services/NavigationService'
import { connect } from 'react-redux'
import AppNavigation from './AppNavigation'
import {
  createReactNavigationReduxMiddleware,
  reduxifyNavigator
} from 'react-navigation-redux-helpers'

createReactNavigationReduxMiddleware(
  'root',
  (state) => state.nav
)

const ReduxAppNavigator = reduxifyNavigator(AppNavigation, 'root')

class ReduxNavigation extends React.Component {
  componentDidMount () {
    if (Platform.OS === 'ios') return
    BackHandler.addEventListener('hardwareBackPress', () => {
      const { dispatch, nav } = this.props
      // change to whatever is your first screen, otherwise unpredictable results may occur
      if (nav.routes.length === 1 && (nav.routes[0].routeName === 'LaunchScreen')) {
        return false
      }
      // if (shouldCloseApp(nav)) return false
      dispatch({ type: 'Navigation/BACK' })
      return true
    })
  }

  componentWillUnmount () {
    if (Platform.OS === 'ios') return
    BackHandler.removeEventListener('hardwareBackPress', undefined)
  }

  render () {
    const { dispatch, nav } = this.props
    // const navigation = {
    //   dispatch: this.props.dispatch,
    //   state: this.props.nav
    // }
    return <ReduxAppNavigator ref={SetTopLevelNav} dispatch={dispatch} state={nav} />
  }
}

const mapStateToProps = state => ({
  nav: state.nav
})
export default connect(mapStateToProps)(ReduxNavigation)
