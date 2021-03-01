import React, { PureComponent } from 'react'
import { RatingContainer, RatingText } from '../Styles/StyledComponents'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { isEmpty } from 'lodash'

export default class RatingStars extends PureComponent {
  render () {
    const { rating, total } = this.props
    let ratingArr = []
    for (let i = 0; i < 5; i++) {
      if (i < Number(rating)) {
        ratingArr.push('positive')
      } else {
        ratingArr.push('negative')
      }
    }
    return (
      <RatingContainer>
        {ratingArr.map((rate, index) => (
          <Icon name={(rate === 'positive') ? 'star' : 'star-outline'} size={20} color='#F3E21D' key={`stars ${index}`} />
        ))}
        {(total !== undefined && !isEmpty(total.toString())) &&
        <RatingText marginLeft={5}>{total}</RatingText>
        }
      </RatingContainer>
    )
  }
}
