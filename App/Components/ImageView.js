import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Animated,
  ActivityIndicator
} from 'react-native'
import { PinchGestureHandler, State } from 'react-native-gesture-handler'

export default class ImageView extends Component {
  constructor (props) {
    super(props)

    this.baseScale = new Animated.Value(1)
    this.pinchScale = new Animated.Value(1)
    this.scale = Animated.multiply(this.baseScale, this.pinchScale)
    this.lastScale = 1
    this.onPinchGestureEvent = Animated.event(
      [{ nativeEvent: { scale: this.pinchScale } }],
      { useNativeDriver: true }
    )
    this.state = {
      imageLoading: true
    }
  }

    onPinchHandlerStateChange = event => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        this.lastScale *= event.nativeEvent.scale
        this.baseScale.setValue(this.lastScale)
        this.pinchScale.setValue(1)
      }
    }

    render () {
      const { imageLoading } = this.state
      const { image } = this.props
      return (
        <View style={{ flex: 1 }}>
          <PinchGestureHandler
            onGestureEvent={this.onPinchGestureEvent}
            onHandlerStateChange={this.onPinchHandlerStateChange}>
            <Animated.View style={{ ...StyleSheet.absoluteFillObject, overflow: 'hidden', alignItems: 'center', flex: 1, justifyContent: 'center' }} collapsable={false}>
              <Animated.Image
                style={[{ width: 450, height: 450 },
                  {
                    transform: [
                      { perspective: 200 },
                      { scale: this.scale }
                    ]
                  }
                ]}
                source={{ uri: image }}
                onLoadStart={() => { this.setState({ imageLoading: true }) }}
                onLoadEnd={() => { this.setState({ imageLoading: false }) }}
              />
              {imageLoading &&
              <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute' }}>
                <ActivityIndicator size='large' />
              </View>
              }
            </Animated.View>
          </PinchGestureHandler>
        </View>
      )
    }
}
