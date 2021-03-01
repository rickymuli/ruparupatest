import React from 'react'
import { View, Text, FlatList, ImageBackground, TouchableOpacity } from 'react-native'
import { colorImage } from '../Model/ColorImage'
import Checkbox from './Checkbox'
import { UpperCase } from '../Utils/Misc'

// Styles
import styles from './Styles/FilterAndSortStyles'
import styled from 'styled-components'
import { fonts } from '../Styles'
const ListOfColors = ({ mod, Pressed }) => {
  return (
    <FlatList
      data={mod}
      keyExtractor={(item, index) => `flatlist ${index}`}
      renderItem={({ item, index }) => (
        <TouchableOpacity onPress={() => Pressed(index)} style={styles.colorView}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, justifyContent: 'center' }}>
            {(!colorImage[item.value]) ? <ColorSample backgroundColor={item.extra_information} />
              : <View style={{ borderRadius: 100 / 2, marginHorizontal: 20 }}>
                <ImageBackground imageStyle={{ borderRadius: 50 }} source={colorImage[item.value]} style={{ height: 35, width: 35, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }} />
              </View>
            }
            <Text style={{ fontFamily: fonts.medium, fontSize: 16 }}>{UpperCase(item.value)}</Text>
          </View>
          <Checkbox
            onPress={() => Pressed(index)}
            selected={item.isChecked}
          />
        </TouchableOpacity>
      )}
    />
  )
}

export default ListOfColors

const ColorSample = styled.View`
    backgroundColor: ${props => props.backgroundColor};
    width: 35;
    height: 35;
    borderRadius: 50;
    borderWidth: 1;
    borderColor: #E5E9F2;
    justifyContent: center;
    alignItems: center;
    paddingLeft: 12;
    paddingRight: 12;
    marginHorizontal: 20;
`
