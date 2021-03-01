import React from 'react'
import { View } from 'react-native'

const TahuDivider = props => <View style={{ height: parseInt(props.data.height.replace('px', '')) }} />

export default TahuDivider
