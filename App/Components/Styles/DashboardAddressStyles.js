import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 15
  },
  headerContainer: {
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10
  },
  header: {
    fontSize: 16
  },
  contentContainer: {
    flexDirection: 'column'
  },
  button: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    borderRadius: 5
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Quicksand-Medium'
  }
})

export default styles
