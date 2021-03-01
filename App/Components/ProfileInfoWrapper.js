import React, { Component } from 'react'
import { connect } from 'react-redux'
import dayjs from 'dayjs'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import has from 'lodash/has'
import get from 'lodash/get'
// Style
import styled from 'styled-components'

class ProfileInfoWrapper extends Component {
  render () {
    const { user } = this.props
    return (
      <ContentContainer>
        <DetailProfile >
          <FlexRow>
            <IconList>
              <Icon name='account' color='#757886' size={16} />
            </IconList>
            <SecondaryGray>
              Nama lengkap
            </SecondaryGray>
          </FlexRow>
          {has(user, 'user.first_name') &&
            <ListProfile numberOfLines={1}>{user.user.first_name} {get(user, 'user.last_name', '')}</ListProfile>
          }
        </DetailProfile>
        <DetailProfile >
          <FlexRow >
            <IconList>
              <Icon name='email' color='#757886' size={16} />
            </IconList>
            <SecondaryGray>
              Alamat email
            </SecondaryGray>
          </FlexRow>
          <ListProfile>{ user.user.email }</ListProfile>
        </DetailProfile>
        <DetailProfile >
          <FlexRow>
            <IconList style={{ marginLeft: 1 }}>
              <Icon name='phone' color='#757886' size={22} />
            </IconList>
            <SecondaryGray>
              No Telepon
            </SecondaryGray>
          </FlexRow>
          <ListProfile>{ user.user.phone }</ListProfile>
        </DetailProfile>
        <DetailProfile >
          <FlexRow >
            <IconList>
              <Icon name='calendar-range' color='#757886' size={16} />
            </IconList>
            <SecondaryGray>
                Tanggal lahir
            </SecondaryGray>
          </FlexRow>
          <ListProfile>{(user.user.birth_date === null) ? '' : dayjs(user.user.birth_date, 'YYYY-MM-DD', false).format('DD MMM YYYY')}</ListProfile>
        </DetailProfile>
        <DetailProfile>
          <FlexRow >
            <IconList >
              <Icon name='gender-male-female' color='#757886' size={16} />
            </IconList>
            <SecondaryGray>
                Jenis kelamin
            </SecondaryGray>
          </FlexRow>
          <ListProfile >{(user.user.gender === null) ? '' : (user.user.gender === 'male') ? 'Laki-laki' : 'Perempuan'}</ListProfile>
        </DetailProfile>
      </ContentContainer>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps)(ProfileInfoWrapper)

const ContentContainer = styled.View`
  flexDirection: column;
`

const DetailProfile = styled.View`
  flexDirection: row;
  justifyContent: space-between;
  paddingVertical: 15;
  borderBottomColor: #E0E6ED;
  borderBottomWidth: 1;
`

const ListProfile = styled.Text`
  textAlign: right;
  flex: 1;
  color: #757886;
  fontSize: 14;
  font-family:Quicksand-Bold;
`
const FlexRow = styled.View`
  flexDirection: row;
`

const IconList = styled.View`
  width: 30px;
`

const SecondaryGray = styled.Text`
  padding-right: 4;
  fontSize: 14;
  color: #757886;
  font-family:Quicksand-Regular;
`
