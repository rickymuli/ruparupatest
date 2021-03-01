import React, { useMemo, useState } from 'react'
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native'
import Checkbox from './Checkbox'
import { UpperCase, ItemFilter } from '../Utils/Misc'
// Styles
import styles from './Styles/FilterAndSortStyles'
import { fonts } from '../Styles'
const ListOfLabels = ({ mod, Pressed }) => {
  const [search, setSearch] = useState('')
  const filteredMod = useMemo(() => ItemFilter(mod, search, 'value', true), [search, mod])
  return (
        <>
          <View style={{ padding: 10, backgroundColor: '#E5E9F2' }}>
            <TextInput
              style={{ height: 50, backgroundColor: 'white', paddingHorizontal: 10, color: 'grey' }}
              value={search}
              onChangeText={(e) => setSearch(e)}
            />
          </View>
          <FlatList
            data={filteredMod}
            keyExtractor={(item, index) => `flatlist ${index}`}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => Pressed(index)} key={`brand ${item.value}${index}`} style={styles.brandView}>
                <Checkbox
                  onPress={() => Pressed(index)}
                  selected={item.isChecked}
                />
                <Text style={{ fontFamily: fonts.medium, fontSize: 16, marginLeft: 15 }}>{UpperCase(item.value)}</Text>
              </TouchableOpacity>
            )}
          />
        </>
  )
}

export default ListOfLabels
