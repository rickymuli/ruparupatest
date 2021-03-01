import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  viewOffer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column'
  },
  viewItems: {
    margin: 10,
    width: 100,
    height: 100
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    padding: 5,
    fontFamily: 'Quicksand-Bold'
  },
  headerView: {
    width: '100%',
    paddingTop: '3%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainViewItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  }
})

export default styles
