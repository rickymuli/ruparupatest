import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  buttonDisabled: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 3,
    justifyContent: 'center',
    width: '100%'
  },
  buttonDisabledPickup: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 3,
    justifyContent: 'center',
    width: '100%',
    borderColor: '#EEEEEE',
    borderWidth: 1
  },
  button: {
    backgroundColor: '#F26525',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 3,
    justifyContent: 'center',
    width: '100%'
  },
  buttonPickup: {
    backgroundColor: '#F26525',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 3,
    justifyContent: 'center',
    width: '40%'
  },
  buttonCartMini: {
    borderColor: '#F26525',
    padding: 4,
    marginHorizontal: 10,
    borderWidth: 1,
    borderRadius: 3,
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: 'Quicksand-Bold'
  },
  buttonTextMini: {
    fontSize: 12,
    color: '#F26525',
    textAlign: 'center',
    fontFamily: 'Quicksand-Bold'
  },
  buttonCartMiniDisable: {
    borderColor: 'grey',
    padding: 4,
    marginHorizontal: 4,
    borderWidth: 1,
    borderRadius: 3,
    justifyContent: 'center'
  }
})

export default styles
