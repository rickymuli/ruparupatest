import React, { PureComponent } from 'react'
import { View } from 'react-native'
import Swiper from 'react-native-swiper'
import WebView from 'react-native-webview'

const Video = (props) => <WebView {...props} javaScriptEnabled domStorageEnabled mediaPlaybackRequiresUserAction androidHardwareAccelerationDisabled />
class TahuVideo extends PureComponent {
  render () {
    const { height, width, data } = this.props
    return (
      <View style={{ width: width, height: height, alignSelf: 'center' }}>
        { Array.isArray(data)
          ? <Swiper autoplay={!__DEV__} loop>
            {data.map((val, key) => <Video key={key} source={{ uri: `https://www.youtube.com/embed/${val.vid_id}` }} />)}
          </Swiper>
          : <Video source={{ uri: `https://www.youtube.com/embed/${data.vid_id}` }} />
        }
      </View>
    )
  }
}

export default TahuVideo
