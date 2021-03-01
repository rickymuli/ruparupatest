import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F9FAFC',
    paddingBottom: '2%'
  },
  contentView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  },
  brandImage: {
    width: 85,
    height: 32
  },
  viewItems: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: 90,
    width: 90,
    margin: '1%'
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    padding: 5,
    fontFamily: 'Quicksand-Bold'
  },
  headerView: {
    height: '30%',
    width: '100%',
    paddingTop: '3%'
  },
  swipableViewStyle: {
    height: '30%',
    paddingTop: '3%'
  }
})

export default styles
