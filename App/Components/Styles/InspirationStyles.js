import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  thumbnailStyle: {
    alignSelf: 'stretch',
    width: 425,
    height: 200
  },
  thumbnailTitleStyle: {
    color: 'white',
    fontSize: 20,
    position: 'absolute',
    bottom: 20,
    left: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontFamily: 'Quicksand-Bold'
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    padding: 5,
    fontFamily: 'Quicksand-Bold'
  },
  headerView: {
    width: '100%',
    paddingTop: '3%',
    backgroundColor: '#ededed'
  },
  viewContent: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  button: {
    width: '75%',
    borderColor: '#2bb1ff',
    borderWidth: 1,
    borderRadius: 5,
    margin: '5%'
  },
  buttonText: {
    textAlign: 'center',
    color: '#2bb1ff',
    fontSize: 20,
    padding: 10,
    fontFamily: 'Quicksand-Bold'
  }
})

export default styles
