import React, { useRef } from 'react'
import { View, StyleSheet, PanResponder, TouchableOpacity, Dimensions, Animated } from 'react-native'
import { View as ViewAnimated } from 'react-native-animatable'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import WebView from 'react-native-webview'

//   const videoParse = urlToObject(video)
//   const videoId = (videoParse && videoParse.v) ? videoParse.v : video.substring('https://youtu.be/'.length, video.length).split('?')[0]
//   <WebView source={{ uri: `https://www.youtube.com/embed/${videoId}` }} javaScriptEnabled domStorageEnabled mediaPlaybackRequiresUserAction />

const { width } = Dimensions.get('screen')

const ProductDetailVideo = ({ setPlayVideo, video }) => {
  // const video = 'https://www.youtube.com/embed/tDibDzy9GKQ'

  const pan = useRef(new Animated.ValueXY()).current
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      {
        dx: pan.x,
        dy: pan.y
      }
    ]),
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.moveX > 400) setPlayVideo(false)
      Animated.spring(
        pan,
        {
          toValue: { x: 0, y: 0 }
        }
      ).start()
    }
  })

  return (
    <ViewAnimated useNativeDriver animation='slideInLeft'
      style={{ width, flex: 1, height: width * 0.8, paddingVertical: 10, alignSelf: 'center', position: 'absolute', zIndex: 1, top: 50 }}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[pan.getLayout(), styles.box]}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity style={{ paddingHorizontal: 4, paddingVertical: 2, backgroundColor: 'rgba(0, 0, 0, 0.1)' }} onPress={() => setPlayVideo(false)}>
            <Icon name='close-circle' color='#F26525' size={24} />
          </TouchableOpacity>
        </View>
        <WebView source={{ uri: video }} javaScriptEnabled domStorageEnabled mediaPlaybackRequiresUserAction />
      </Animated.View>
    </ViewAnimated>
  )
}

export default ProductDetailVideo

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: width * 0.8
  },
  box: {
    // backgroundColor: '#61dafb',
    width: width * 0.8,
    borderRadius: 4,
    height: width * 0.7
  }
})
