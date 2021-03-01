import React, { Component } from 'react'
import { Image, TouchableOpacity, View, FlatList, Text } from 'react-native'
// import { cmsBlockFailure } from '../Redux/TahuRedux'
import CMSBlock from './CMSBlock'
// import _ from 'lodash'
// Components by type
class TahuProduct extends Component {
  goTo (item) {
    let itemDetail = {
      data: {
        url_key: item.url_key
      },
      search: ''
    }
    this.props.navigation.navigate(item.dir, { itemDetail })
  }

  renderPeoplesChoice () {
    const { width, data } = this.props
    return (
      <View>
        <Text style={{ fontFamily: 'Quicksand-Bold', textAlign: 'center', fontSize: 20 }}>{data.layout_title}</Text>
        <FlatList
          data={data.content}
          numColumns={2}
          keyExtractor={(item, index) => `PeoplesChoice ${index}`}
          renderItem={({ item, i }) => (
            <TouchableOpacity onPress={() => this.goTo(item)} style={{ width: width * 0.5, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 10 }}>
              <Image source={{ uri: item.image }} style={{ width: width * 0.4, height: width * 0.4, borderRadius: width * 0.4 / 2 }} />
              <Text style={{ width: width * 0.4, fontFamily: 'Quicksand-Bold', textAlign: 'center', fontSize: 16, paddingTop: 5 }}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    )
  }

  render () {
    const { type, data, navigation } = this.props
    let cmsParam = { fromTahuCMS: true, data: { ...data, status: 10 } }
    return (
      <>
        {type === 'peoplesChoice' &&
            this.renderPeoplesChoice()
        }
        {
          (type === 'cmsBlock') &&
            <>
              {data.page_layout !== 2
                ? <CMSBlock cmsParam={cmsParam} navigation={navigation} />
                : <>{this.renderPeoplesChoice()}</>
              }
            </>
        }
      </>
    )
  }
}

export default TahuProduct
