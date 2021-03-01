import React, { Component } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { RatingContainer } from '../Styles/StyledComponents'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class RatingStarsFillable extends Component {
  render () {
    const ratingArr = []
    for (let i = 0; i < 5; i++) {
      if (i < this.props.rating) {
        ratingArr.push('positive')
      } else {
        ratingArr.push('negative')
      }
    }
    return (
      <View>
        <RatingContainer style={{ justifyContent: 'center', padding: 10, marginTop: 10 }}>
          {ratingArr.map((rate, index) => (
            <TouchableOpacity key={`fillable star ${index}${rate}`} onPress={() => this.props.setRating(index)}>
              <Icon name={(rate === 'positive') ? 'star' : 'star-outline'} size={40} color={(rate === 'positive') ? '#F3E21D' : '#D4DCE6'} />
            </TouchableOpacity>
          ))}
        </RatingContainer>
      </View>
    )
  }
}
