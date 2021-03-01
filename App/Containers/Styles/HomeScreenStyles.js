import { StyleSheet, Dimensions } from 'react-native'

export default StyleSheet.create({
  contentContainer: {
    paddingTop: 3,
    flexDirection: 'column',
    backgroundColor: '#F9FAFC'
  },
  selectedStyle: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#F26524',
    width: Dimensions.get('screen').width * 0.5
  },
  selectedText: {
    color: '#F26524',
    fontFamily: 'Quicksand-Bold'
  },
  text: {
    fontFamily: 'Quicksand-Regular'
  },
  buttonStyle: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('screen').width * 0.5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D4DCE6'
  }
})
