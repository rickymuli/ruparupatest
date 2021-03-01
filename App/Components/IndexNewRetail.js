import React from 'react'
import { View, Text } from 'react-native'
import { useSelector } from 'react-redux'
import { colors } from '../Styles'

const IndexNewRetail = (props) => {
  const { data } = useSelector(state => state.storeNewRetail)
  if (!data) return null
  return (
    <View style={{ margin: 10, backgroundColor: '#E5F7FF' }} elevation={2} >
      {/* <IconButton icon='close' size={12} onPress={() => console.log('Pressed')} style={{ position: 'absolute', top: 0, right: 0 }} /> */}
      <View style={{ alignItems: 'center', flexDirection: 'row', padding: 10 }}>
        {/* <Icon name={'information-outline'} size={18} /> */}
        <Text style={{ flex: 1, color: colors.primary }}>
            Selamat datang ditoko <Text style={{ fontWeight: 'bold' }}>{data.store_name}</Text>
        </Text>
      </View>
    </View>
  )
}

export default IndexNewRetail
