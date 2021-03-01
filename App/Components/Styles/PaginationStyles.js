import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    paddingRight: 15,
    paddingLeft: 15,
    marginTop: 25,
    marginBottom: 25,
    backgroundColor: 'white'
  },
  innerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnPage: {
    borderRadius: 4,
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 14,
    paddingRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E6ED'
  },
  pageText: {
    color: '#757886',
    fontSize: 16,
    fontFamily: 'Quicksand-Regular'
  },
  btnPageSelected: {
    borderRadius: 4,
    backgroundColor: '#31b0d5',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 14,
    paddingRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#269abc'
  },
  pageTextSelected: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Quicksand-Regular'
  },
  arrowBtn: {
    borderRadius: 4,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 14,
    paddingRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E6ED'
  }
})

export default styles
