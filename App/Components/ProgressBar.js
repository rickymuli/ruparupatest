import React, { useRef, useEffect } from 'react'
import { Text, View, Animated, StyleSheet } from 'react-native'

const ProgressBar = (props) => {
  const { progress } = props
  let animation = useRef(new Animated.Value(0))

  useEffect(() => {
    Animated.timing(animation.current, {
      toValue: progress,
      duration: 0,
      useNativeDriver: false
    }).start()
  }, [progress])

  const width = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp'
  })

  return (
    <View>
      <Text style={{ fontFamily: 'Quicksand-Regular', textAlign: 'center', paddingBottom: 10, color: '#757886' }}>{progress}%</Text>
      <View style={styles.progressBar}>
        <Animated.View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(242, 101, 37, 0.8)', width }} />
      </View>
    </View>
  )
}

export default ProgressBar

const styles = StyleSheet.create({
  progressBar: {
    height: 5,
    width: '100%',
    backgroundColor: 'rgba(242, 101, 37, 0.4)'
    // backgroundColor: '#F26525',
    // opacity: 0.4
  }
})
