import React, { PureComponent } from 'react'
import { View, Text, Linking, Dimensions } from 'react-native'
import HTML from 'react-native-render-html'
import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'
import get from 'lodash/get'
import map from 'lodash/map'

import styles from './Styles/PDPStyles'
import htmlStyles from '../Styles/RNHTMLStyles'
import { WithContext } from '../Context/CustomContext'
import ProductDetailAttribute from './ProductDetailAttribute'
class ContentSpec extends PureComponent {
    getData = () => {
      const { activeVariant, payload, hideWeight } = this.props
      const { warranty_unit: unit, warranty_part: part, warranty_services: services } = payload.warranty
      let attributes = activeVariant.attributes
      let data = { SKU: activeVariant.sku }
      if (get(attributes, '[0].attribute_id') === 195) data['Warna'] = get(attributes, '[0].attribute_option.option_value', '-')
      if (get(activeVariant.attribute_sap, 'name_sap')) data['Nama Komoditas'] = get(activeVariant.attribute_sap, 'name_sap')
      if (payload.weight !== 0 && !hideWeight) data['Berat'] = `${payload.weight} kg`
      if (payload.product_height !== 0) data['Dimensi'] = `${payload.product_length} x ${payload.product_width} x ${payload.product_height} cm`
      if (unit && unit !== 'No period') data['Warranty Unit'] = unit
      if (part && part !== 'No period') data['Warranty Part'] = part
      if (services && services !== 'No period') data['Warranty Service'] = services
      return data
    }

    renderDescription () {
      const { payload } = this.props
      let description = (!isEmpty(payload.description_mobile) ? payload.description_mobile : payload.description)
      if (isEmpty(description)) return null
      if (includes(description, '<p')) description = `<p>${description}</p>`
      // Set video iframe size
      if (includes(description, '<iframe')) {
        // Disabled eslint due to regex
        /* eslint-disable */
        let source = description.match(/src=\"(.*?)\"/g)
        let iframeIndex = 0
        // Finding and replacing the correct iframe for youtube videos iframe in product description
        source.map((sourceData, sourceIndex) => {
          if (sourceData.includes('youtube.com')) {
            description = description.replace(/<iframe(.*?)iframe>/g, (match) => {
              if (iframeIndex === sourceIndex) {
                let newIframe = `<iframe allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" frameborder="0" ${sourceData}></iframe>`
                iframeIndex++
                return newIframe
              } else {
                return match
              }
            })
          }
        })
      }
      return <HTML
        allowedStyles={[]}
        html={description}
        onLinkPress={(evt, href) => { Linking.openURL(href.replace('https', 'http')) }}
        tagsStyles={htmlStyles.HTMLPDPTagStyles}
        ignoredStyles={['width', 'height']}
        imageMaxWidth={Dimensions.get('screen').width}
      />
    }

    render () {
      const { payload } = this.props
      return (
        <View style={{ padding: 20, backgroundColor: 'white' }}>
          <View>
            <Text style={styles.itemDescription}>{`Detail Produk & Spesifikasi`}</Text>
          </View>
          <View>
            {(!isEmpty(payload.specification)) &&
              <ProductDetailAttribute attributes={payload.attributes} spesification={payload.specification} />
            }
            {this.renderDescription()}
          </View>
          <View style={{ marginTop: 10 }}>
            {map(this.getData(), (v, key) => {
              return (
                <View key={key} style={styles.spesificationContainer}>
                  <Text style={styles.productDetailSpesificationHead}>{key}</Text>
                  <Text style={styles.productDetailSpesification}>{v}</Text>
                </View>
              )
            })}
          </View>
        </View>
      )
    }
}

export default WithContext(ContentSpec)
