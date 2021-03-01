import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import { fonts } from '../Styles'

class EditMemberComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      storeCode: props.storeCode,
      groupId: ''
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!isEmpty(nextProps.user.user)) {
      const { group } = nextProps.user.user
      if (prevState.groupId !== group[prevState.storeCode]) {
        return {
          groupId: group[prevState.storeCode]
        }
      }
    }
    return null
  }

  render () {
    const { storeCode, groupId } = this.state
    let memberId = ''
    if (storeCode === 'AHI') {
      memberId = 'ID Ace Rewards'
    } else if (storeCode === 'HCI') {
      memberId = 'ID Informa Rewards'
    } else {
      memberId = 'ID Smile Club'
    }
    return (
      <DetailProfile >
        <FlexRow >
          <IconList>
            <Icon name='credit-card' color='#757886' size={16} />
          </IconList>
          <SecondaryGray>
            {memberId}
          </SecondaryGray>
        </FlexRow>
        <TouchableOpacity onPress={() => this.props.setModalVisible(true, storeCode)}>
          <UnderlineListProfile>
            {(!isEmpty(groupId)) ? groupId : 'Masukkan Data'}
          </UnderlineListProfile>
        </TouchableOpacity>
      </DetailProfile>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps)(EditMemberComponent)

const DetailProfile = styled.View`
  flexDirection: row;
  justifyContent: space-between;
  paddingVertical: 15;
  borderBottomColor: #E0E6ED;
  borderBottomWidth: 1;
`

const UnderlineListProfile = styled.Text`
  color: #757886;
  fontSize: 14;
  font-family:${fonts.bold};
  text-decoration: underline;
`
const FlexRow = styled.View`
  flexDirection: row;
`

const IconList = styled.View`
  width: 30px;
`

const SecondaryGray = styled.Text`
  fontSize: 14;
  color: #757886;
  font-family:${fonts.regular};
`
