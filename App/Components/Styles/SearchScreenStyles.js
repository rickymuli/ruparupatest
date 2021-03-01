import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  popularSearchView: {
    marginTop: 2,
    marginBottom: 10,
    marginLeft: 10,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#F26525',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 20
  },
  popularSearchText: {
    maxWidth: 340,
    flexWrap: 'wrap',
    fontFamily: 'Quicksand-Medium',
    fontSize: 14,
    marginBottom: 1,
    color: '#F26525'
  },
  headerText: {
    fontSize: 16,
    padding: '3%',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Quicksand-Bold',
    color: '#757886'
  },
  capsuleText: {
    maxWidth: 340,
    flexWrap: 'wrap',
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    marginBottom: 1,
    color: '#757886'
  },
  eraseHistoryStyle: {
    padding: '3%',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#DA221B',
    fontFamily: 'Quicksand-Regular'
  },
  prevSearchView: {
    // flexWrap: 'wrap',
    marginTop: 2,
    marginBottom: 10,
    marginLeft: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E5E9F2',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 7,
    paddingHorizontal: 15
  }
})

export default styles
