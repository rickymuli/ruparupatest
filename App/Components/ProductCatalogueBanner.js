// Header PCP prototype

import React, { PureComponent } from 'react'
import { View, ImageBackground, Dimensions, TouchableOpacity, Text, Linking, Alert, Image } from 'react-native'
import HTML from 'react-native-render-html'
import config from '../../config'
import isEmpty from 'lodash/isEmpty'

// Styles
import htmlStyles from '../Styles/RNHTMLStyles'
import styles from './Styles/PCPBanner'
export default class ProductCatalogueBanner extends PureComponent {
  downloadPDF = (link) => {
    Linking.canOpenURL(link)
      .then(supported => {
        if (supported) {
          Linking.openURL(link)
        } else {
          Alert.alert('Invalid URL', 'Link yang ingin dibuka tidak valid')
        }
      })
  }

  render () {
    const { categoryDetail } = this.props
    const data = categoryDetail.data
    const header = data.header_description_mobile
    const image = data.image
    if (isEmpty(image) || isEmpty(header)) {
      return null
    } else {
      if ((parseInt(data.page_layout) === 0 && parseInt(data.level) === 2) || parseInt(data.page_layout) === 1 || parseInt(data.page_layout) === 2) {
        return (
          <View style={styles.container}>
            <Image
              source={{ uri: `${config.imageURL}f_auto,fl_lossy,q_auto/w_600,h_300${image}` }}
              style={{ width: Dimensions.get('window').width, height: 200 }}
            />
            <View>
              <HTML
                html={`<div class="text-content">${header.replace(/\\/g, ``)}</div>`}
                classesStyles={htmlStyles.HTMLPCPBannerClassStyles}
                tagsStyles={htmlStyles.HTMLPCPBannerTagsStyles}
              />
            </View>
          </View>
        )
      } else if ((parseInt(data.page_layout) === 0 && parseInt(data.level) === 3) || parseInt(data.page_layout) === 3 || parseInt(data.page_layout) === 4) {
        let regexHref = /<a.*?href="([^">]*\/([^">]*?))".*?>/g
        let link = regexHref.exec(header)
        let height1 = (!isEmpty(header.includes('Unduh Katalog')) ? 180 : 50)
        return (
          <ImageBackground source={{ uri: `${config.imageURL}f_auto,fl_lossy,q_auto/w_640${image}` }} style={{ width: Dimensions.get('window').width, height: height1 }}>
            <View style={styles.container2}>
              <HTML
                html={header}
                classesStyles={htmlStyles.HTMLPCPBannerClassStyles2}
                tagsStyles={htmlStyles.HTMLPCPBannerTagsStyles2}
              />
              {(header.includes('Unduh Katalog'))
                ? <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <TouchableOpacity onPress={() => this.downloadPDF(link[1])} style={{ paddingVertical: 5, paddingHorizontal: 15, backgroundColor: '#FF7F45', borderRadius: 3, width: Dimensions.get('window').width * 0.5 }}>
                    <Text style={{ fontFamily: 'Quicksand-Medium', color: 'white', textAlign: 'center' }}>Unduh Katalog</Text>
                  </TouchableOpacity>
                </View>
                : null
              }
            </View>
          </ImageBackground>
        )
      } else if ((parseInt(data.page_layout) === 0 && parseInt(data.level) === 4)) {
        return null
      } else if (parseInt(data.page_layout) === 5 || parseInt(data.page_layout) === 6) {
        return (
          <HTML
            html={header}
            classesStyles={htmlStyles.HTMLPCPBannerClassStyles}
            tagsStyles={htmlStyles.HTMLPCPBannerTagsStyles}
          />
        )
      } else {
        return null
      }
    }
  }
}
