import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#F9FAFC'
  },
  categoryView: {
    width: '50%',
    flexDirection: 'column',
    padding: 5,
    alignItems: 'center'
  },
  imageStyle: {
    width: 180,
    height: 100,
    borderRadius: 10
  },
  categoryTextStyle: {
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
    height: '7%',
    width: '100%',
    paddingTop: '3%'
  }
})

export default styles
