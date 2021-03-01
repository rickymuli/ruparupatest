import { StyleSheet, Dimensions } from 'react-native'
import styled from 'styled-components'

export const dimensions = {
  height: Dimensions.get('screen').height,
  width: Dimensions.get('screen').width
}

export const colors = {
  primary: '#757886', // light-black
  secondary: '#F26525', // orange
  tertiary: '#008ED1', // blue,
  lightTertiary: '#00A6F5', // light-blue,
  error: '#F3251D' // red errors
}

export const fonts = {
  sm: 12,
  md: 18,
  lg: 28,
  regular: 'Quicksand-Regular',
  medium: 'Quicksand-Medium',
  bold: 'Quicksand-Bold'
}

// Quicksand-Regular
export const PrimaryText = styled.Text`
  font-family: ${fonts.regular};
  color: ${colors.primary};
`
export const SecondaryText = styled.Text`
  font-family: ${fonts.regular};
  color: ${colors.secondary};
`
export const TertiaryText = styled.Text`
  font-family: ${fonts.regular};
  color: ${colors.tertiary};
`
export const ErrorText = styled.Text`
  font-family: ${fonts.regular};
  color: ${colors.error};
`

// Quicksand-Medium
export const PrimaryTextMedium = styled.Text`
  font-family: ${fonts.medium};
  color: ${colors.primary};
`
export const SecondaryTextMedium = styled.Text`
  font-family: ${fonts.medium};
  color: ${colors.secondary};
`
export const TertiaryTextMedium = styled.Text`
  font-family: ${fonts.medium};
  color: ${colors.tertiary};
`
export const LightTertiaryTextMedium = styled.Text`
  font-family: ${fonts.medium};
  color: ${colors.lightTertiary};
`

// Quicksand-Bold
export const PrimaryTextBold = styled.Text`
  font-family: ${fonts.bold};
  color: ${colors.primary};
`
export const SecondaryTextBold = styled.Text`
  font-family: ${fonts.bold};
  color: ${colors.secondary};
`
export const TertiaryTextBold = styled.Text`
  font-family: ${fonts.bold};
  color: ${colors.tertiary};
`

export const primaryStyle = StyleSheet.create({
  smRegular: {
    fontFamily: fonts.regular,
    color: colors.primary,
    fontSize: fonts.sm
  },
  smMedium: {
    fontFamily: fonts.medium,
    color: colors.primary,
    fontSize: fonts.sm
  },
  smBold: {
    fontFamily: fonts.bold,
    color: colors.primary,
    fontSize: fonts.sm
  }
})
