import React, { Component } from 'react'
import { Text, View, Linking, Image, TouchableWithoutFeedback, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import map from 'lodash/map'
import chunk from 'lodash/chunk'
import isEmpty from 'lodash/isEmpty'
// import styled from 'styled-components'
// import { trackWithProperties } from '../Services/MixPanel'
import analytics from '@react-native-firebase/analytics'

// Redux
import TahuActions from '../Redux/TahuRedux'

// Styles
import styles from './Styles/AppStyles'
import { fonts } from '../Styles'

class ExploreByCategory extends Component {
  componentDidMount () {
    this.props.exploreByCategoryRequest()
  }

  _handleAnalytic = (data) => {
    analytics().logSelectContent({ content_type: 'explore-by-category', item_id: !data.url_key ? '' : data.url_key})
  }

  itemPressed = (item) => {
    this._handleAnalytic(item)
    // trackWithProperties('Data exploreByCategory', item.data)
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
        itm_campaign: 'explore-by-category',
        itm_source: 'Homepage'
      }
      this.props.navigation.navigate(item.dir, {
        itemDetail, itmData
      })
    }
  }

  render () {
    const { tahu } = this.props
    return (
      <View style={{ marginTop: 15 }}>
        {(!tahu.fetchingExploreByCategory) &&
          (!isEmpty(tahu.dataExploreByCategory) && tahu.dataExploreByCategory.status === 10) &&
            <View>
              <Text style={{ fontFamily: fonts.bold, fontSize: 15, marginTop: 10, paddingLeft: 10 }}>{tahu.dataExploreByCategory.layout_title}</Text>
              <ScrollView horizontal style={{ backgroundColor: 'white', paddingTop: 15 }}>
                <View>
                  {map(chunk(tahu.dataExploreByCategory.content, Math.round(tahu.dataExploreByCategory.content.length / 2)), (items, index) =>
                    <View key={`grid2 ${index}`} style={{ flexDirection: 'row' }}>
                      {map(items, (item, i) =>
                        <TouchableWithoutFeedback key={`${i}`} onPress={() => this.itemPressed(item)}>
                          <View style={styles.layoutCmsBlockContainerHome}>
                            <Image source={{ uri: item.image }} style={(Number(tahu.dataExploreByCategory.page_layout) === 0) ? styles.layoutImageFirstHome : styles.layoutImageSecondHome} />
                            <Text style={styles.cmsItemTitleHome}>{item.title}</Text>
                          </View>
                        </TouchableWithoutFeedback>
                      )
                      }
                    </View>
                  )
                  }
                </View>
              </ScrollView>
            </View>
        }
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  exploreByCategoryRequest: () => dispatch(TahuActions.exploreByCategoryRequest())
})

const mapStateToProps = (state) => ({
  tahu: state.tahu
})

export default connect(mapStateToProps, mapDispatchToProps)(ExploreByCategory)

// const Shadow = styled.View`
//   box-shadow: 1px 1px 1px #757885;
//   padding: 5px;
//   marginBottom: 5px
//   backgroundColor: white;
//   alignSelf: center;
//   alignItems: center;
//   justifyContent: center;
//   borderRadius: 5;
//   shadowOpacity: 0.22;
//   shadowRadius: 2.22;
//   elevation: 2;
// `
