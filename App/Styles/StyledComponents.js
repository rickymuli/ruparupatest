import styled, { css } from 'styled-components'
import { Dimensions } from 'react-native'

const HeaderPills = styled.TouchableOpacity`
  flex-direction:row;
  align-items:center;
  justify-content:center;
  border: 1px solid #E5E9F2;
  padding:5px;
  border-radius:3px;
  margin-top:10px;
  margin-left:1px;
  margin-right:1px;
  margin-bottom:5px;
`
const MarginRightS = styled.View`
  margin-Left: 12px;
`

const ModalHeader = styled.View`
  flex-direction:row;
  justify-content:space-between;
  width: 100%;
  border-bottom-width: 1px;
  border-bottom-color: #D4DCE6;
  padding: 15px;
  background-color: #fff;
`
const TextModal = styled.Text`
  text-align:center;
  flex-grow:1;
  font-size:16px;
  color: #757886;
  font-family:Quicksand-Bold;
`
const Right = styled.View`
  align-items: flex-end;
  margin-right: 5px;
`

const DistributeSpaceBetween = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const Bold = styled.Text`
  font-family:Quicksand-Bold;
  font-size:${props => props.fontSize || 12}px;
  color: ${props => props.color || '#757886'};
  text-align: ${props => props.textAlign || 'left'};
`
const FontSizeXS = styled.Text`
  font-size: 12px;
  color: ${props => props.color || '#555761'};
  line-height: ${props => props.lineHeight || 12}px;
  font-family: Quicksand-Regular;
  text-align: ${props => props.textAlign || 'left'};
`

const FontSizeS = styled.Text`
  font-size: 14px;
  color: ${props => props.color || '#555761'};
  line-height: ${props => props.lineHeight || 16}px;
  font-family: Quicksand-Regular;
  text-align: ${props => props.textAlign || 'left'};
`

const FontSizeM = styled.Text`
  font-size: 16px;
  color: #555761;
  line-height: ${props => props.lineHeight || 16}px;
  font-family:Quicksand-Regular;
  text-align: ${props => props.textAlign || 'left'};
`

const FontSizeL = styled.Text`
  font-size: 18px;
  color: #555761;
  line-height: ${props => props.lineHeight || 18}px;
  font-family:Quicksand-Regular;
`

const FontMNoLineHeight = styled.Text`
  font-size: 16px;
  color: #555761;
  font-family:Quicksand-Regular;
`

const Container = styled.View`
  padding: 10px;
`

const ContainerBorder = styled.View`
  padding: 10px;
  border-top-width: 1px;
  border-top-color: #E5E9F2;
  margin-bottom: 10px;
`

const ContainerNoPadding = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: #F9FAFC;
`

const P = styled.Text`
  font-size: 14px;
  color: #555761;
  line-height: 18px;
  font-family:Quicksand-Regular;
`

const BR = styled.View`
  flex:1;
  margin:10px;
`

const FormS = styled.View`
  border: 1px #e5e9f2 solid;
  padding: 0px;
  border-radius: 3px;
  margin-top: 5px;
  margin-bottom: 10px;
`

const Input = styled.TextInput`
  text-decoration-color: white;
  font-family: ${props => props.fontFamily || 'Quicksand-Regular'};
  color: ${props => props.color || '#F26525'};
  flex: 1;
  height: 40;
`

const Header = styled.Text`
  font-family:Quicksand-Bold;
  font-size:20;
  color: #555761;
  text-align:${props => props.textAlign || 'left'};
  margin-bottom: ${props => props.marginBottom || 0}px;
`

const WishlistView = styled.TouchableOpacity`
  background-color: rgba(255,255,255,0.7);
  border-radius: 50;
  justify-content: center;
  align-items: center;
  padding: 5px;
`

const ButtonPrimaryOutlineMDisabled = styled.View`
  border-width: 1px;
  border-color: #757886;
  border-radius: 5px;
  padding: 7px;
  margin-top: 10px;
`

const ButtonPrimaryOutlineM = styled.TouchableOpacity`
  border-width: 1px;
  border-color: #F26525;
  border-radius: 5px;
  padding: 7px;
  margin-top: 10px;
`

const ButtonPrimaryOutlineText = styled.Text`
  font-family: Quicksand-Regular;
  color: ${props => props.color || '#F26525'};
  font-size: 16;
  text-align: center;
`

const ButtonPrimaryOutlineTextS = styled.Text`
  font-family: Quicksand-Regular;
  color: ${props => props.color || '#F26525'};
  font-size: 14;
  text-align: center;
`

const ButtonSecondaryOutlineM = styled.TouchableOpacity`
  border-width: 1px;
  border-color: #008CCF;
  border-radius: 5px;
  padding: 10px;
  margin-top: 5px;
`

const ButtonSecondaryOutlineText = styled.Text`
  font-family: Quicksand-Regular;
  color:  #008CCF;
  font-size: 14;
  text-align: center;
`

const ModalBackButtonText = styled.Text`
  font-family: Quicksand-Regular;
  color: #008CCF;
  text-align: right;
`

const HeaderTitleRegular = styled.Text`
  font-family: Quicksand-Regular;
  font-size: 16;
  text-align:${props => props.textAlign || 'left'}
`

const RowItem = styled.View`
  flex-direction: row;
  margin-vertical: 5px;
  justify-content: space-around;
`

const RowSpaceBetween = styled.View`
  marginTop: 6;
  flexDirection: row;
  justifyContent: space-between;
`

const Row = styled.View`
  flex-direction: row;
  margin-vertical: ${props => props.marginVertical || 0}px;
  flex-wrap: ${props => props.flexWrap || 'nowrap'};
`

const ProductCardDescriptionContainer = styled.View`
  flex-direction: column;
  margin-left: 5px;
  width: ${Dimensions.get('screen').width * 0.6}px;
`

const ProductName = styled.Text`
  font-family: Quicksand-Bold;
  font-size: 16;
  margin-bottom: 3px;
`

const OldPrice = styled.Text`
  font-family: Quicksand-Regular;
  text-decoration-line: line-through;
  color: #D4DCE6;
  font-size: 14;
`

const DiscountText = styled.Text`
  font-family: Quicksand-Regular;
  color: #F3251D;
  font-size: 14;
  margin-left: 15px;
`

const PriceText = styled.Text`
  font-family: Quicksand-Bold;
  font-size: 18;
`

const ReviewContainer = styled.View`
  padding: 15px;
  padding-vertical: 10px;
  background-color: #fff;
  border-bottom-width: 1;
  border-bottom-color: #E0E6ED;
`

const ReviewContainerNoBorder = styled.View`
  padding: 15px;
  padding-vertical: 10px;
  background-color: #fff;
`

const HeaderReviewLarge = styled.Text`
  font-family: Quicksand-Bold;
  font-size: 18;
  margin-bottom: 10px;
`

const HeaderReviewSmall = styled.Text`
font-family: Quicksand-Bold;
font-size: 14;
margin-bottom: 10px;
`

const RatingText = styled.Text`
  font-family: Quicksand-Regular;
  font-size: 14;
  margin-left: ${props => props.marginLeft || 0}px;
  text-align: ${props => props.textAlign || 'left'};
`

const RatingContainer = styled.View`
  flex-direction: row;
  margin-bottom: 5px;
  justify-content: ${props => props.justifyContent || 'flex-start'};
  padding: ${props => props.padding || 0}px;
  margin-top: ${props => props.marginTop || 0}px;
`

const ButtonFilledPrimary = styled.TouchableOpacity`
  background-color: #F26525;
  border-radius: 4;
  padding: 10px;
`

const ButtonFilledDisabled = styled.View`
  background-color: #E5E9F2;
  border-radius: 4;
  padding: ${props => props.padding || 10}px;
`

const ButtonFilledTextDisabled = styled.Text`
  font-size: 16;
  font-family: ${props => props.fontFamily || 'Quicksand-Regular'};
  text-align: center;
`

const ButtonFilledText = styled.Text`
  color: #fff;
  font-size: 16;
  font-family: ${props => props.fontFamily || 'Quicksand-Regular'};
  text-align: center;
`

const ButtonFilledTextSmall = styled.Text`
  color: #FFFFFF;
  font-family: Quicksand-Regular;
  font-size: 14;
`

const ButtonFilledSmall = styled.TouchableOpacity`
  padding-horizontal: 10px;
  padding-vertical: 5px;
  justify-content: center;
  border-width: 1;
  border-color: ${props => props.borderColor || '#F26525'};
  border-radius: 4;
  background-color: ${props => props.backgroundColor || '#F26525'};
  align-items: center;
`

const ButtonFilledSecondarySmall = styled.TouchableOpacity`
  padding-horizontal: 10px;
  padding-vertical: 5px;
  justify-content: center;
  border-width: 1;
  border-color: #008CCF;
  border-radius: 4;
  background-color: #008CCF;
  align-items: center;
`

const ButtonFilledSecondary = styled.TouchableOpacity`
  padding-vertical: 5px;
  justify-content: center;
  border-width: 1;
  border-color: #008CCF;
  border-radius: 4;
  background-color: #008CCF;
  align-items: center;
`

const ButtonSecondaryOutlineSmall = styled.TouchableOpacity`
  padding-horizontal: 10px;
  justify-content: center;
  border-width: 1;
  border-color: #008CCF;
  border-radius: 4;
  background-color: #fff;
  align-items: center;
`

const ButtonSecondaryOutlineTextSmall = styled.Text`
  color: #008CCF;
  font-family: Quicksand-Regular;
  font-size: 14;
`

const ImageReviewContainer = styled.TouchableOpacity`
  padding-vertical: 5px;
  margin-right: 10px;
  justify-content: center;
  align-items:center;
`

const ImageMainContainer = styled.View`
  margin-vertical: 5px;
  padding-bottom: 5px;
`

const ImageMainContainerWithBorder = styled.View`
  margin-vertical: 5px;
  padding-bottom: 5px;
  borderBottomWidth: 1px;
  borderBottomColor: #E0E6ED;
`

const SortContainer = styled.View`
  padding-vertical: 10px;
  flex-direction: column;
  background: white;
`

const SortItemContainer = styled.TouchableOpacity`
  padding: 10px;
  flex-direction: row;
  border-width: 1;
  border-color: #E0E6ED;
  margin-vertical: 5px;
  justify-content: space-between;
`

const ButtonContainer = styled.View`
  background-color: #ffffff;
  padding-horizontal: 15px;
  padding-bottom: 15px;
`

const ButtonGreyOutline = styled.TouchableOpacity`
  border-width: 1px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 4;
  border-color: #D4DCE6;
  align-items: center;
`

const ButtonGreyText = styled.Text`
  font-family: Quicksand-Medium;
  color: #757886;
  font-size: 16px;
`

const ContainerWithBorder = styled.View`
  padding-vertical: 10px;
  border-bottom-width: ${props => props.borderBottomWidth || 0};
  border-top-width: ${props => props.borderTopWidth || 0};
  border-color: #E5E9F2;
`

const MiniContainerWithBorder = styled.View`
justify-content: center;
padding: 10px;
flex-wrap: wrap;
width: ${props => props.width || 100}px;
height: ${props => props.height || 100}px;
alignItems: center;
`

const CapsuleContainer = styled.TouchableOpacity`
  padding: ${props => props.padding || 10}px;
  border-radius: 30px;
  border-width: 0.7px;
  margin: ${props => props.margin || 0}px;
  border-color: ${props => props.borderColor || '#D4DCE6'};
  background-color: ${props => props.backgroundColor || '#FFFFFF'};
  justify-content: center;
`

const CapsuleContainerSelectedPrimary = styled.TouchableOpacity`
  padding: 10px;
  border-radius: 30px;
  border-width: 0.7px;
  background-color: #F26525;
  border-color: ${props => props.borderColor || '#FFFFFF'};
  justify-content: center;
`

const BorderContainer = styled.View`
  padding: 10px;
  margin: 10px;
  border: 1px solid;
  border-color: ${props => props.border || '#049372'};
  border-radius: 4px;
`

const Priceold = styled.Text`
  color:#F26525;
  font-size:12px;
  font-family:Quicksand-Regular;
  text-decoration-line: line-through;
`

const Price = styled.Text`
  font-size: 16px;
  line-height: 20px;
  color: #008ed1;
  font-family:Quicksand-Bold;
`

const ProductContainer = styled.View`
  flex-direction:column;
  background-color: #ffffff;
  border-radius: 3px;
  padding:10px;
  margin-left:1%;
  margin-right:1%;
  margin-bottom:10px;
  width: 48%;
  box-shadow: 1px 1px 1px #d4dce6;
  elevation: 1;
`

const ElevatedContainer = styled.View`
  flex-direction:column;
  background-color: #ffffff;
  border-radius: 3px;
  padding:10px;
  margin-left:1%;
  margin-right:1%;
  margin-bottom:10px;
  box-shadow: 2px 2px 2px #d4dce6;
  elevation: 3;
`

const InfoBox = styled.View`
  flex-direction: row;
  background-color: #e5f7ff;
  padding: 10px;
`

const sharedGoogleButton = css`
  padding-vertical: 10;
  border-width: 1;
  border-color: #9B9B9B; 
  border-radius: 3;
  justify-content: center;
  align-items: center;
`

const sharedRegisterButton = css`
  justify-content: center;
  align-items: center;
  background-color: #FF7F45;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 3px;
`

const GoogleButton = styled.TouchableOpacity`
  ${sharedGoogleButton}
`

const GoogleButtonView = styled.View`
  ${sharedGoogleButton}
`

const RegisterButton = styled.TouchableOpacity`
  ${sharedRegisterButton}
`

const RegisterButtonView = styled.View`
  ${sharedRegisterButton}
`

const ErrorCenter = styled.Text`
  text-align: center;
  color: #F3251D;
  fontSize: 14;
  fontFamily: Quicksand-Regular;
  paddingBottom: 10;
  paddingTop: 5;
`

const OuterContainer = styled.View`
  flexDirection: column;
  backgroundColor: white;
  padding: 20px;
  margin: 15px;
  border-width: 1;
  border-color: #D4DCE6;
  border-radius: 3;
`

const Divider = styled.View`
  width: 100%;
  alignSelf: center;
  marginVertical: 15;
  borderBottomColor: #D4DCE6;
  borderBottomWidth: 1;
`

const Verified = styled.Text`
  font-family: Quicksand-Bold;
  font-size: 12px;
  background-color:#049372;
  color: white;
  padding-horizontal: 4px;
  margin-left: 8px;
  border-radius: 1px;
`

const ErrorText = styled.Text`
  font-family: Quicksand-Regular;
  font-size: 12px;
  color: red;
  margin-top: 10px;
`

const UnVerified = styled.Text`
  font-family: Quicksand-Bold;
  font-size: 12px;
  background-color:#F3251D;
  color: white;
  padding-horizontal: 4px;
  margin-left: 8px;
  border-radius: 2px;
`
const ButtonBorder = styled.TouchableOpacity`
  padding-horizontal: 15px;
  padding-vertical: 5px;
  borderWidth: 1px;
  borderColor: #D4DCE6;
  border-radius: 3px;
  margin-top: 10px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const ButtonBorderText = styled.Text`
  font-size: 14px;
  text-align: center;
  font-family:Quicksand-Regular;
  color: #008CCF;
`

const styledComponents = {
  RowSpaceBetween,
  ButtonBorder,
  ButtonBorderText,
  Verified,
  ErrorText,
  UnVerified,
  Divider,
  OuterContainer,
  ErrorCenter,
  RegisterButtonView,
  RegisterButton,
  GoogleButtonView,
  GoogleButton,
  HeaderPills,
  MarginRightS,
  ModalHeader,
  TextModal,
  Right,
  DistributeSpaceBetween,
  Bold,
  Container,
  ContainerNoPadding,
  FontSizeM,
  FontSizeL,
  P,
  BR,
  FormS,
  Input,
  Header,
  WishlistView,
  ButtonSecondaryOutlineM,
  ButtonSecondaryOutlineText,
  ModalBackButtonText,
  HeaderTitleRegular,
  RowItem,
  Row,
  ProductCardDescriptionContainer,
  ProductName,
  OldPrice,
  DiscountText,
  PriceText,
  ReviewContainer,
  ReviewContainerNoBorder,
  HeaderReviewLarge,
  HeaderReviewSmall,
  RatingText,
  RatingContainer,
  ButtonFilledDisabled,
  ButtonFilledTextDisabled,
  ButtonFilledPrimary,
  ButtonFilledText,
  ButtonFilledSmall,
  ButtonFilledSecondarySmall,
  ButtonFilledSecondary,
  ButtonSecondaryOutlineSmall,
  ButtonSecondaryOutlineTextSmall,
  ButtonFilledTextSmall,
  ImageReviewContainer,
  ImageMainContainer,
  ImageMainContainerWithBorder,
  SortContainer,
  SortItemContainer,
  FontSizeXS,
  FontSizeS,
  FontMNoLineHeight,
  ButtonContainer,
  ButtonGreyOutline,
  ButtonGreyText,
  ButtonPrimaryOutlineMDisabled,
  ButtonPrimaryOutlineM,
  ButtonPrimaryOutlineText,
  ButtonPrimaryOutlineTextS,
  ContainerWithBorder,
  CapsuleContainer,
  CapsuleContainerSelectedPrimary,
  BorderContainer,
  Priceold,
  Price,
  ProductContainer,
  ElevatedContainer,
  InfoBox,
  MiniContainerWithBorder,
  ContainerBorder
}

module.exports = styledComponents
