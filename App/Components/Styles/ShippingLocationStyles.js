import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  button: {
    paddingRight: 12,
    paddingLeft: 12,
    paddingTop: 10,
    paddingBottom: 10,
    borderColor: '#E0E6ED',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  okButton: {
    backgroundColor: '#F26525',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 3,
    justifyContent: 'center',
    width: '100%'
  },
  okText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Quicksand-Bold'
  },
  pills: {
    borderWidth: 1,
    borderColor: '#E0E6ED',
    borderRadius: 3,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 8,
    paddingLeft: 8,
    marginRight: 5,
    marginBottom: 10
  }
})

export default styles
