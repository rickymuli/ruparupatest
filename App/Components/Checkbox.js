import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { colors } from '../Styles'

const Checkbox = ({ selected, onPress, size = 22, color = colors.primary, text = '' }) => {
  return (
    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 6 }} onPress={onPress}>
      <Icon
        size={size}
        color={selected ? color : '#757886'}
        name={selected ? 'check-box' : 'check-box-outline-blank'}
      />
      <Text style={{ color: colors.primary, paddingLeft: 15, fontSize: 14 }}>{text}</Text>
    </TouchableOpacity>
  )
}

export default Checkbox
