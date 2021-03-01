import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  content: {
    padding: 20,
    flexDirection: 'column'
  },
  card: {
    shadowColor: '#757885',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 1,
    padding: 20,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#D4DCE6',
    marginBottom: 10
  },
  header: {
    textAlign: 'center',
    fontFamily: 'Quicksand-Bold',
    fontSize: 18,
    marginBottom: 10
  },
  italic: {
    fontStyle: 'italic'
  },
  normal: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    marginBottom: 20
  },
  buttonOutline: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#008CCF',
    borderRadius: 3
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#008CCF',
    backgroundColor: '#008CCF',
    borderRadius: 3
  },
  buttonTextOutline: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#008CCF',
    textAlign: 'center'
  },
  buttonText: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center'
  },
  textInputView: {
    borderWidth: 1,
    borderColor: '#e5e9f2',
    padding: 0,
    borderRadius: 3,
    marginTop: 5,
    marginBottom: 10
  },
  errorMessage: {
    fontFamily: 'Quicksand-Regular',
    color: '#F3251D',
    textAlign: 'center'
  },
  infoCard: {
    backgroundColor: '#E5F7FF',
    padding: 20
  },
  infoText: {
    fontFamily: 'Quicksand-Medium',
    color: '#555761',
    textAlign: 'center'
  }
})

export default styles
