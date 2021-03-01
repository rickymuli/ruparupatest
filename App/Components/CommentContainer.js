import React, { Component } from 'react'
import { TextInput, View, Platform } from 'react-native'
import { Container, FontSizeS, Bold, DistributeSpaceBetween } from '../Styles/StyledComponents'

export default class CommentContainer extends Component {
  render () {
    const { comment, forService } = this.props
    return (
      <View>
        <Container>
          <DistributeSpaceBetween>
            <FontSizeS><Bold>{forService ? 'Feedback' : 'Komentar' }</Bold></FontSizeS>
            <FontSizeS style={(comment.length >= 500) && { color: '#F3251D' }}>{comment.length} / 500</FontSizeS>
          </DistributeSpaceBetween>
        </Container>
        <Container>
          <TextInput
            style={[(Platform.OS === 'ios') && { height: 100 }, { borderColor: '#E0E6ED', borderWidth: 1, borderRadius: 5, padding: 10 }]}
            multiline
            textAlignVertical='top'
            numberOfLines={8}
            onChangeText={text => this.props.changeDescription(text)}
            value={comment}
            maxLength={500}
          />
        </Container>
      </View>
    )
  }
}
