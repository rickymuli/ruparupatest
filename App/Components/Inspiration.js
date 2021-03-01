import React, { useEffect, useRef, useState } from 'react'
import { View, FlatList, Text } from 'react-native'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import _ from 'lodash'
import { useDispatch } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import Toast, { DURATION } from 'react-native-easy-toast'
import { WithContext } from '../Context/CustomContext'
import useEzFetch from '../Hooks/useEzFetch'

// Component
import InspirationComponent from './InspirationComponent'
import LottieComponent from './LottieComponent'
// import ChatButton from './ChatButton'

// Snackbar
import SnackBar from 'react-native-snackbar-component'

import InspirationActions from '../Redux/InspirationRedux'

const Inspiration = (props) => {
  const dispatch = useDispatch()
  const [refresh, setRefresh] = useState(false)
  const [renderCount, setRenderCount] = useState(0)
  const { get, fetching, data, error } = useEzFetch()
  let toast = useRef(null)

  useEffect(() => {
    setRenderCount(props.renderCount)
    getInspiration()
    return () => { toast = null }
  }, [])

  useEffect(() => {
    if (!isEmpty(data) && refresh) {
      setRefresh(false)
    }
  }, [data])

  const getInspiration = () => {
    let companyCode = props.companyCode
    let bu = ''
    if (!isEmpty(companyCode)) {
      bu = (companyCode === 'AHI') ? 'ace/' : (companyCode === 'HCI') ? 'informa/' : ''
    }
    get(`${bu}inspirations?storeCode=`, null, ({ response }) => {
      dispatch(InspirationActions.inspirationSuccess(response?.data?.data ?? []))
    })
  }

  const refreshItems = () => {
    setRefresh(true)
    getInspiration()
  }

  const toggleWishlist = (message) => {
    if (props.toggleWishlist) {
      props.toggleWishlist(message)
      return
    }
    toast.show(message, DURATION.LENGTH_SHORT)
  }

  const { titleLarge, fromTahu } = props
  let textStyle = {
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
    padding: 10,
    fontSize: 12,
    color: '#757886'
  }
  if (fromTahu) {
    textStyle.color = '#000000'
  }
  if (titleLarge) {
    textStyle.fontSize = 18
  }
  if (refresh || fetching) {
    return (
      <LottieComponent />
    )
  } else {
    return (
      <View style={{ marginTop: 10 }}>
        {!fromTahu && <Text style={textStyle}>Ide & Inspirasi</Text>}
        <FlatList
          data={data && renderCount ? data.slice(0, parseInt(renderCount)) : data}
          refreshing={refresh}
          style={{ backgroundColor: 'white' }}
          keyExtractor={(item, index) => `inpsiration flatlist ${index}`}
          onRefresh={() => refreshItems()}
          renderItem={({ item }) => (
            <View>
              { !fetching && !isEmpty(data)
                ? <InspirationComponent toggleWishlist={toggleWishlist} inspirationData={item} navigation={props.navigation} />
                : <LottieComponent />
              }
            </View>
          )}
        />
        {/* <ChatButton /> */}
        <Toast
          ref={ref => { toast = ref }}
          style={{ width: '100%', backgroundColor: '#049372', borderRadius: 0 }}
          position='top'
          positionValue={0}
          fadeInDuration={750}
          fadeOutDuration={1500}
          opacity={1}
          textStyle={{ color: '#FFFFFF', textAlign: 'center' }}
        />
        <SnackBar
          visible={!isEmpty(error)}
          textMessage='Terjadi kesalahan koneksi'
          actionHandler={
            () => {
              refreshItems()
            }}
          actionText='coba lagi'
          backgroundColor='rgba(0,0,0,0.5)'
        />
      </View>
    )
  }
}

export default WithContext(Inspiration)
