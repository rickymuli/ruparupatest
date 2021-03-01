import React, { useState, useMemo } from 'react'
import { View, Text, Share, Platform, TouchableWithoutFeedback, Modal, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native'
// import { View as ViewAnimated } from 'react-native-animatable'
import FastImage from 'react-native-fast-image'
import config from '../../config.js'
import { urlToObject } from '../Utils/Misc/UrlParser'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Swiper from 'react-native-swiper'
import PhotoView from 'react-native-photo-view'
import WebView from 'react-native-webview'
import analytics from '@react-native-firebase/analytics'

// lodash
// import get from 'lodash/get'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'

// Styles
import styles from './Styles/PDPStyles'

// Component
import { ShareAndWishlist, Loading } from './'

const { width } = Dimensions.get('screen')

const ProductDetailImage = ({ nonListingProduct, activeVariant, itemData, payload }) => {
  // const isProductScanned = route.params?.isScanned ?? false
  const videos = activeVariant?.videos ?? []
  const [selectedIndex, setselectedIndex] = useState('1')
  const [modalVisible, setmodalVisible] = useState(false)
  const [isVisible, setisVisible] = useState(false)
  const [imageModalLoaded, setimageModalLoaded] = useState(false)
  // const [imageSwiper, setImageSwiper] = useState(images || get(payload, 'variants[0].images', []))
  // const [playVideo, setPlayVideo] = useState(false)
  const imageSwiper = useMemo(() => {
    let temp = activeVariant.images || []
    videos.forEach(video => {
      if (!isEmpty(video.video_url) || isEqual(video.status, 10)) {
        let videoParse = urlToObject(video.video_url)
        let videoId = (videoParse && videoParse.v) ? videoParse.v : video.video_url.substring('https://youtu.be/'.length, video.video_url.length).split('?')[0]
        // Standard path for YouTube thumbnail: http://img.youtube.com/vi/[video-id]/[thumbnail-number].webp
        let videoObj = {
          image_url: `http://img.youtube.com/vi/${videoId}/0.webp`,
          videoId: videoId,
          priority: video.priority,
          status: video.status,
          video_beta_url: video.video_beta_url,
          video_url: video.video_url
        }
        temp.push(videoObj)
      }
    })
    return temp
  }, [activeVariant])

  // useEffect(() => {
  //   if (!isEmpty(activeVariant.images) && (images.length === 1)) setImages(activeVariant.images)

  //   let temp = isProductScanned ? activeVariant.images : [...imageSwiper]
  //   videos.forEach(video => {
  //     if (!isEmpty(video.video_url) || isEqual(video.status, 10)) {
  //       let videoParse = urlToObject(video.video_url)
  //       let videoId = (videoParse && videoParse.v) ? videoParse.v : video.video_url.substring('https://youtu.be/'.length, video.video_url.length).split('?')[0]
  //       // Standard path for YouTube thumbnail: http://img.youtube.com/vi/[video-id]/[thumbnail-number].webp
  //       let videoObj = {
  //         image_url: `http://img.youtube.com/vi/${videoId}/0.webp`,
  //         videoId: videoId,
  //         priority: video.priority,
  //         status: video.status,
  //         video_beta_url: video.video_beta_url,
  //         video_url: video.video_url
  //       }
  //       temp.push(videoObj)
  //     }
  //   })
  //   setImageSwiper(temp)
  // }, [activeVariant])

  const shareLink = () => {
    const url = encodeURIComponent(`?itm_source=sharing+button&itm_campaign=Whatsapp&itm_term=${activeVariant.sku}`)

    Share.share({
      ...Platform.select({
        ios: {
          message: payload.name,
          url: `https://ruparupa.page.link/?link=${config.baseURL}pdp/${payload.url_key}?${url}`
        },
        android: {
          message: `https://ruparupa.page.link/?link=${config.baseURL}pdp/${payload.url_key}${url}`
        }
      }),
      title: payload.name
    }, {
      ...Platform.select({
        ios: {
          // iOS only:
          excludedActivityTypes: [
            'com.apple.UIKit.activity.PostToTwitter'
          ]
        },
        android: {
          // Android only:
          dialogTitle: 'Share : ' + payload.name
        }
      })
    })
    analytics().logEvent('user_share_product', {
      content_type: payload.name,
      item_id: activeVariant.sku
    })
  }

  const showImage = (index) => { setselectedIndex(index); setmodalVisible(true) }

  const renderPagination = (index, total, context) => {
    return (
      <View style={styles.paginationStyle}>
        <View>
          {(!nonListingProduct && !isEmpty(activeVariant)) &&
            <ShareAndWishlist
              shareLink={shareLink}
              sku={activeVariant.sku}
              itemData={itemData} />
          }
        </View>
        <View>
          {isVisible &&
            <Text style={styles.paginationText}>
              <Icon
                name='image'
                size={16}
                color='rgba(117, 120, 133, 1)'
                style={{ marginRight: 10 }}
              />
              {index + 1}/{total}
            </Text>
          }
        </View>
      </View>
    )
  }

  const renderPhotoView = (image, index) => {
    if (image.hasOwnProperty('video_url')) return null
    return (
      <View style={styles.slide2} key={`show images ${index} ${image.image_url}`}>
        <PhotoView
          source={{ uri: `${config.imageRR}w_2400,h_2400,f_auto,q_auto${image.image_url}` }}
          minimumZoomScale={1}
          maximumZoomScale={8}
          androidScaleType='fitCenter'
          style={styles.imageInModal}
          onLoadStart={() => { setimageModalLoaded(false) }}
          onLoadEnd={() => { setimageModalLoaded(true) }}
        />
        {(!imageModalLoaded) &&
          <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: '48%', left: '48%' }}>
            <Loading />
          </View>
        }
      </View>
    )
  }

  const renderImages = () => {
    if (isEmpty(imageSwiper)) return null
    let styleHead = imageSwiper?.length >= 2 ? styles.modalHeader : styles.modalImageViewHeader
    return (
      <SafeAreaView style={styles.modalContainer}>
        <View style={styleHead}>
          <TouchableOpacity style={styles.closeIcon} onPress={() => setmodalVisible(false)}>
            <Icon name='close-circle' color='#D4DCE6' size={24} />
          </TouchableOpacity>
        </View>
        { imageSwiper?.length >= 2
          ? <Swiper
            loop={Platform.OS !== 'ios'}
            index={Number(selectedIndex)}
            containerStyle={styles.wrapperModal}
            showsButtons
          >
            {imageSwiper?.map((v, i) => renderPhotoView(v, i))}
          </Swiper>
          : renderPhotoView(imageSwiper[0], 1)
        }
      </SafeAreaView>
    )
  }

  const renderVideo = (image) => {
    // const videoParse = urlToObject(video)
    // const videoId = (videoParse && videoParse.v) ? videoParse.v : video.substring('https://youtu.be/'.length, video.length).split('?')[0]
    return (
      <View style={{
        width: width, height: width, alignSelf: 'center'
        // position:'absolute', zIndex:1
      }}>
        {/* <ProductDetailVideo setPlayVideo={setPlayVideo} video={`https://www.youtube.com/embed/${videoId}`} /> */}
        <WebView source={{ uri: `https://www.youtube.com/embed/${image.videoId}` }} javaScriptEnabled domStorageEnabled mediaPlaybackRequiresUserAction />
      </View>
    )
  }

  const getImageUri = (uri) => (uri && !uri.includes('https://res.cloudinary.com/')) ? `${config.imageRR}w_500,h_500,f_auto,q_auto${uri}` : uri

  return (
    <>
      {/* {playVideo && renderVideo()} */}
      {/* {(!isEmpty(video) && !playVideo) && <View style={{ justifyContent: 'center', position: 'absolute', height: width, zIndex: 1 }}>
        <TouchableOpacity style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', borderTopRightRadius: 20, borderBottomRightRadius: 20, paddingLeft: 10 }} onPress={() => setPlayVideo(true)}>
          <Icon name='play-circle-outline' color={'#F26525'} size={40} />
        </TouchableOpacity>
      </View>} */}
      <Swiper
        style={styles.wrapper}
        renderPagination={renderPagination}
        loop={Platform.OS !== 'ios'}
      >
        {map(imageSwiper, (image, index) => {
          if (image.hasOwnProperty('video_url')) return renderVideo(image)
          else {
            return (<TouchableWithoutFeedback onPress={() => showImage(index)} style={styles.slide} key={`productImage ${index}`}>
              <FastImage
                source={{
                  uri: getImageUri(image.image_url),
                  priority: FastImage.priority.high
                }}
                resizeMode={FastImage.resizeMode.contain}
                style={{ width, height: width }}
                onLoad={() => setisVisible(true)} />
            </TouchableWithoutFeedback>)
          }
        })}
      </Swiper>
      <Modal
        animationType='slide'
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setmodalVisible(false)
        }}>
        {renderImages()}
      </Modal>
    </>
  )
}

export default ProductDetailImage
