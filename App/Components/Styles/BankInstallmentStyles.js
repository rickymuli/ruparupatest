import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  productInfoBoard: {
    padding: 20,
    backgroundColor: 'white'
  },
  title: {
    marginBottom: 15,
    color: '#757886',
    fontSize: 20,
    fontFamily: 'Quicksand-Bold'
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#D4DCE6',
    alignItems: 'center',
    height: 60,
    width: '100%',
    padding: 10
  },
  bankIcon: {
    height: 21,
    maxWidth: 120,
    flexWrap: 'wrap'
  },
  button: {
    marginTop: 10,
    width: '100%',
    alignContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E0E6ED',
    borderRadius: 4
  }
})

export default styles
