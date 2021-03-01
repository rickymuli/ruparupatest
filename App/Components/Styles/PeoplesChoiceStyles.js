import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#F9FAFC',
    marginTop: 20
  },
  subView: {
    width: '50%',
    flexDirection: 'column',
    padding: 5,
    alignItems: 'center'
  },
  imageStyle: {
    width: 150,
    height: 150,
    borderRadius: 100
  },
  textStyle: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Quicksand-Bold'
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    padding: 5,
    fontFamily: 'Quicksand-Bold'
  },
  headerView: {
    width: '100%'
  },
  mainViewItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  }
})

export default styles
