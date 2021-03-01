import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  thumbnailStyle: {
    alignSelf: 'stretch',
    width: width,
    height: (width / 400) * 220
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
  },
  flexRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  layoutCmsBlockContainer: {
    width: width * 0.5,
    flexDirection: 'column'
  },
  layoutCmsBlockContainer_column: {
    height: width * 0.14,
    paddingHorizontal: 6,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 2,
    borderColor: '#F9FAFC',
    elevation: 1,
    marginHorizontal: 4,
    marginTop: 6
  },
  layoutCmsBlockContainerHome: {
    width: width * 0.42,
    flexDirection: 'column'
  },
  layoutImageFirst: {
    width: width * 0.45,
    height: ((width * 0.45) / 480) * 270,
    borderRadius: 5,
    marginBottom: 10,
    alignSelf: 'center'
  },
  layoutImageSecond: {
    width: width * 0.32,
    height: width * 0.32,
    marginBottom: 10,
    alignSelf: 'center'
  },
  layoutImageFirstHome: {
    width: width * 0.35,
    height: ((width * 0.35) / 480) * 270,
    borderRadius: 5,
    alignSelf: 'center'
  },
  layoutImageSecondHome: {
    width: width * 0.35,
    height: width * 0.35,
    marginBottom: 10,
    alignSelf: 'center'
  },
  cmsItemTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 12,
    paddingHorizontal: 20,
    paddingBottom: 10,
    textAlign: 'center'
  },
  cmsItemTitle_column: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
    paddingHorizontal: 20
  },
  cmsItemTitleHome: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 12,
    paddingHorizontal: 20,
    textAlign: 'center'
  },
  cmsContainer: {
    padding: 10
  },
  ViewImageText: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default styles
