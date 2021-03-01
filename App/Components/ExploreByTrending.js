import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, Image, TouchableWithoutFeedback, Linking, Dimensions } from 'react-native'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
// import { trackWithProperties } from '../Services/MixPanel'
import analytics from '@react-native-firebase/analytics'
import map from 'lodash/map'
import chunk from 'lodash/chunk'
import isEmpty from 'lodash/isEmpty'

// Redux
import TahuActions from '../Redux/TahuRedux'

// import styled from 'styled-components'
import { ScrollView } from 'react-native-gesture-handler'

// Styles
import styles from './Styles/AppStyles'
import { fonts } from '../Styles'

const { width } = Dimensions.get('screen')
class ExploreByTrending extends Component {
  constructor () {
    super()
    this.state = {
      isfetched: []
    }
  }
  componentDidMount () {
    this.props.exploreByTrendingRequest()
  }

  _handleAnalytic = (data) => {
    analytics().logSelectContent({ content_type: 'explore-by-trendings', item_id: !data.url_key ? '' : data.url_key })
  }

  itemPressed = (item) => {
    this._handleAnalytic(item)
    // trackWithProperties('Data exploreByTrending', item.data)
    let itemDetail = {
      data: {
        url_key: item.url_key
      },
      search: ''
    }
    if (item.dir === 'Browser') {
      Linking.openURL(item.target_link)
    } else {
      const itmData = {
        itm_campaign: 'explore-by-trending',
        itm_source: 'Homepage'
      }
      this.props.navigation.navigate(item.dir, {
        itemDetail, itmData
      })
    }
  }

  render () {
    const { isfetched } = this.state
    const { tahu } = this.props
    let explore = tahu.dataExploreByTrending || {}
    if (explore.status !== 10 || isEmpty(explore.content)) return null
    let imageStyle = (Number(explore.page_layout) === 0) ? styles.layoutImageFirst : styles.layoutImageSecond
    return (
      <View>
        <Text style={{ fontFamily: fonts.bold, fontSize: 15, marginTop: 15, paddingLeft: 10 }}>{explore.layout_title}</Text>
        <ScrollView horizontal style={{ backgroundColor: 'white', paddingVertical: 10 }}>
          <View>
            {map(chunk(explore.content, Math.round(explore.content.length / 2)), (items, index) => (
              <View key={`grid2 ${index}`} style={{ flexDirection: 'row' }}>
                {map(items, (item, i) =>
                  <TouchableWithoutFeedback key={i} onPress={() => this.itemPressed(item)}>
                    <View style={{ flexDirection: 'column', paddingVertical: 8, width: width * 0.38 }}>
                      {((Number(explore.page_layout)) === 2)
                        ? <View style={{ paddingLeft: 10, alignItems: 'center' }}>
                          <Image source={{ uri: item.image }} style={{ borderRadius: width * 0.32 / 2, width: width * 0.32, height: width * 0.32 }} />
                          <Text style={{ fontFamily: fonts.regular, fontSize: fonts.sm, textAlign: 'center', paddingTop: 8 }}>{item.title}</Text>
                        </View>
                        : <View style={styles.layoutCmsBlockContainer}>
                          <ShimmerPlaceHolder
                            autoRun
                            width={imageStyle.width}
                            height={imageStyle.height}
                            visible={isfetched.includes(index)}>
                            <Image onLoad={() => !isfetched.includes(index) && this.setState({ isfetched: [...isfetched, index] })} source={{ uri: item.image }} style={imageStyle} />
                          </ShimmerPlaceHolder>
                          <Text style={styles.cmsItemTitle}>{item.title}</Text>
                        </View>
                      }
                    </View>
                  </TouchableWithoutFeedback>
                )
                }
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  exploreByTrendingRequest: () => dispatch(TahuActions.exploreByTrendingRequest())
})

const mapStateToProps = (state) => ({
  tahu: state.tahu
})

export default connect(mapStateToProps, mapDispatchToProps)(ExploreByTrending)

// const Round = styled.View`
//   marginBottom: 8;
//   backgroundColor: white;
//   alignSelf: center;
//   alignItems: center;
//   justifyContent: center;
//   width: ${width * 0.3};
//   height: ${width * 0.3};
//   box-shadow: 1px 1px 1px #757885;
//   borderRadius: ${width * 0.3 / 2};
//   shadowOpacity: 0.22;
//   shadowRadius: 2.22;
//   elevation: 2;
// `
