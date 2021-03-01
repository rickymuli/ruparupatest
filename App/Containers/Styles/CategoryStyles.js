import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f9',
    paddingTop: 30
  },
  card: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#d4dce6',
    elevation: 1
  },
  cardNegative: {
    backgroundColor: '#F0F2F7',
    paddingHorizontal: 10
  }
})

export default styles
