import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 10
  },
  button: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E6ED',
    height: 90,
    width: '33.3%'
  },
  text: {
    color: '#757886',
    fontSize: 10,
    paddingTop: 5
  }
})

export default styles
