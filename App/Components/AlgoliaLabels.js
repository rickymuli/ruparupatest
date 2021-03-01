/* eslint-disable no-unneeded-ternary */
import React from 'react'
import { Text, View, TouchableOpacity, TextInput, FlatList, ImageBackground } from 'react-native'
import { UpperCase } from '../Utils/Misc'
import styled from 'styled-components'

import find from 'lodash/find'

// Redux
import { colorImage } from '../Model/ColorImage'

// Styles
import styles from './Styles/FilterAndSortStyles'
import { fonts } from '../Styles'
import Checkbox from './Checkbox'

const Labels = ({ items, name, algolia, Pressed, noResult = false }) => {
  return <>
    {(name !== 'colors') && <View style={{ padding: 10, backgroundColor: '#E5E9F2' }}>
      <TextInput
        style={{ height: 50, backgroundColor: 'white', paddingHorizontal: 10 }}
      // value={search}
      // onChangeText={(e) => setSearch(e)}
      />
    </View>}
    <FlatList
      data={items}
      keyExtractor={(item, index) => `algolialabels ${index}`}
      renderItem={({ item, index }) => {
        if (name === 'colors') {
          let colorDetail = item.label.split('|') // '#FF0000|Merah' => ['#FF0000', 'Merah']
          let indoName = colorDetail[1]
          return (
            <TouchableOpacity onPress={() => Pressed(name, item)} style={styles.colorView} key={`algolia${name} ${item.value}${index}`}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, justifyContent: 'center' }}>
                {(!colorImage[indoName]) ? <ColorSample backgroundColor={colorDetail[0]} />
                  : <View style={{ borderRadius: 100 / 2, marginHorizontal: 20 }}>
                    <ImageBackground imageStyle={{ borderRadius: 50 }} source={colorImage[indoName]} style={{ height: 35, width: 35, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }} />
                  </View>
                }
                <Text style={{ fontFamily: fonts.medium, fontSize: 16 }}>{UpperCase(indoName)}</Text>
              </View>
              <Checkbox onPress={() => Pressed(name, item)} selected={(find(algolia[name], item)) ? true : false} />
            </TouchableOpacity>
          )
        } else {
          return (
            <TouchableOpacity onPress={() => Pressed(name, item)} key={`algolia${name} ${item.value}${index}`} style={styles.brandView}>
              <Checkbox onPress={() => Pressed(name, item)} selected={(find(algolia[name], item)) ? true : false} />
              <Text style={{ fontFamily: fonts.medium, fontSize: 16, marginLeft: 15 }}>{UpperCase(item.label)}</Text>
            </TouchableOpacity>
          )
        }
      }}
    />
  </>
}

export default Labels

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
