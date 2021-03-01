import React, { Component } from 'react'
import { StatusBar, SafeAreaView } from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import { connect } from 'react-redux'
import StartupActions from '../Redux/StartupRedux'
// import ReduxPersist from '../Config/ReduxPersist'

class RootContainer extends Component {
  componentDidMount () {
    // if redux persist is not active fire startup action
    // if (!ReduxPersist.active) {
    this.props.startup()
    // }
  }

  render () {
    console.disableYellowBox = true
    return (
      // <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor='white' barStyle='dark-content' />
        <ReduxNavigation />
      </SafeAreaView>
    )
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup())
})

export default connect(null, mapDispatchToProps)(RootContainer)
