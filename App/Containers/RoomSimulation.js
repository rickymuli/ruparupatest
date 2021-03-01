import React from 'react'
import config from '../../config'
import { View, Text, StatusBar, Image, Dimensions, TouchableOpacity, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import lodashGet from 'lodash/get'
import Gestures from 'react-native-easy-gestures'
// import { CameraKitCameraScreen } from 'react-native-camera-kit'
import { RNCamera } from 'react-native-camera'
import BottomSheet from 'reanimated-bottom-sheet'
import ContentSpec from '../Components/ContentSpec'
import analytics from '@react-native-firebase/analytics'

const { width, height } = Dimensions.get('screen')
const RoomSimulation = (props) => {
  const { navigation, route } = props
  const payload = route.params?.payload
  const activeVariant = route.params?.activeVariant
  const images = payload?.variants?.[0].images ?? []
  const [urlImages, setUrlImages] = React.useState((lodashGet(images, '[0].image_url', '')).replace('.jpg', '.webp'))
  const sheetRef = React.useRef(null)
  React.useEffect(() => {
    // sheetRef.current.snapTo(0)
    analytics().logEvent('RoomSimulation')
  }, [])

  console.log({ images })
  const renderContent = () => (
    <View style={{ backgroundColor: 'white', paddingBottom: 20 }}>
      <View style={{ paddingHorizontal: 15, paddingTop: 10 }}>
        <Text style={{ color: '#757886', fontSize: 20, fontFamily: 'Quicksand-Bold' }}>Images</Text>
        <View style={{ flexDirection: 'row', paddingVertical: 10, flexWrap: 'wrap' }}>
          {images.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => setUrlImages((item.image_url || '').replace('.jpg', '.webp'))} style={{ marginRight: 10 }}>
              <Image
                source={{ uri: `${config.imageRR}w_240,h_240${item.image_url}` }}
                style={{
                  width: width * 0.2,
                  height: width * 0.2
                }}
                resizeMode='contain'
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <ContentSpec payload={payload} activeVariant={activeVariant} />
    </View>
  )

  const information = () => {
    Alert.alert('Tutorial',
      ' - Pinch dan Unpinch Object untuk memperbesar atau memperkecil.\n - Drag dan drop Object untuk memindahkan posisi.'
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor='transparent' />
      <View style={{ position: 'absolute', padding: 10, zIndex: 1, justifyContent: 'space-between', width: '100%', flexDirection: 'row', top: 20 }}>
        <TouchableOpacity style={{ borderRadius: 15, padding: 2 }} onPress={() => navigation.goBack()}>
          <Icon name={'arrow-left'} size={30} color={'#555761'} />
        </TouchableOpacity>
        <TouchableOpacity style={{ borderRadius: 15, padding: 2 }} onPress={() => information()}>
          <Icon name={'information-outline'} size={30} color={'#555761'} />
        </TouchableOpacity>
      </View>
      {/* <CameraKitCameraScreen
        style={{width: width * 0.80, height: width, alignItems: 'center', justifyContent: 'center' }}
        cameraOptions={{
          focusMode: 'on' // off/on(default)
        }}
        hideControls // (default false) optional, hide buttons and additional controls on top and bottom of screen
      /> */}
      <RNCamera style={{ height: height * 0.8 }}>
        <View style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
          <Gestures>
            <View style={{ padding: 100 }}>
              <Image
                source={{ uri: `${config.imageRR}w_720,h_720,f_auto,q_auto/f_auto,q_auto:eco/e_make_transparent${urlImages}` }}
                style={{
                  width: width * 0.5,
                  height: width * 0.5
                }}
                resizeMode='contain'
              />
            </View>
          </Gestures>
        </View>
      </RNCamera>
      <BottomSheet
        ref={sheetRef}
        snapPoints={[200, 700, 150]}
        borderRadius={10}
        renderContent={renderContent}
        renderHeader={() => <View style={{ height: 5, backgroundColor: 'grey', width: 60, borderRadius: 10, alignSelf: 'center', marginBottom: 5 }} />}
      />
    </View>
  )
}

export default RoomSimulation
