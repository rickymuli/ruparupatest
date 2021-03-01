import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'column',
    backgroundColor: '#F9FAFC'
  },
  headerContainer: {
    margin: 20
  },
  header: {
    fontSize: 18
  },
  innerContainer: {
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 15
  },
  header2: {
    fontSize: 16
  },
  innerHeaderContainer: {
    margin: 10
  },
  contentContainer: {
    flexDirection: 'row'
  },
  userDetailStyles: {
    flexDirection: 'column',
    marginVertical: 20,
    paddingHorizontal: 20
  },
  detailText: {
    marginBottom: 10
  },
  progressBarContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    backgroundColor: '#E0E6ED',
    borderRadius: 4
  },
  progressBar: {
    alignSelf: 'flex-start',
    backgroundColor: '#228B22',
    borderRadius: 4,
    paddingTop: 2,
    height: 25
  },
  button: {
    padding: 10,
    borderWidth: 2,
    borderColor: '#E0E6ED',
    borderRadius: 5
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Quicksand-Medium'
  },
  infobox: {
    padding: 10,
    borderWidth: 2,
    borderColor: '#E0E6ED',
    borderRadius: 5
  },
  infoboxText: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Quicksand-Bold'
  }
})

export default styles
