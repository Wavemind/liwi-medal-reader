import styled from 'styled-components/native';
import { liwiColors } from '/utils/constants';
import {
  View as RNView,
  TouchableOpacity as RNTouchableOpacity,
} from 'react-native';
import {
  Col as LCol,
  H2 as LH2,
  H3 as LH3,
  Text as LText,
  View as LView,
} from 'native-base';

export const Text = styled(LText).attrs({})`
  color: #4e4e4e;
  font-family: roboto;
  font-weight: bold;
  margin: 10px;
`;

export const ColCenter = styled(LCol).attrs({
  justifyContent: 'center',
  alignItems: 'center',
})``;

export const LiwiTitle2 = styled(LH2)`
  color: ${() => liwiColors.redColor};
  margin: 0 20px 10px 0;
  text-transform: uppercase;
  padding-bottom: ${({ noBorder }) => {
    if (noBorder === true) {
      return '0px';
    }
    return '20px';
  }};
  border-bottom-width: ${({ noBorder }) => {
    if (noBorder === true) {
      return '0px';
    }
    return '2px';
  }};
  border-bottom-color: ${() => liwiColors.greyColor};
`;

export const LiwiTitle3 = styled(LH3).attrs({
  color: liwiColors.whiteColor,
})`
  margin: 20px 20px 10px 20px;
  padding: 8px;
  border-radius: 4px;
  border-bottom-width: 1px;
  color: ${() => liwiColors.whiteColor};
  border-bottom-color: ${() => liwiColors.greyColor};
  background-color: ${() => liwiColors.redColor};
`;

export const RootView = styled(LView).attrs({
  flex: 1,
})``;

export const RightView = styled(LView).attrs({
  flexDirection: 'row',
  justifyContent: 'flex-end',
})``;

export const ViewBlocColor = styled(LView).attrs({
  backgroundColor: liwiColors.whiteColor,
})`
  border-radius: 4px;
  color: ${liwiColors.blackColor};
`;

export const CardView = styled(LView).attrs({
  backgroundColor: '#eaeaea',
  borderRadius: 2,
  padding: 10,
  marginTop: 10,
  marginLeft: 10,
  marginRight: 10,
  shadowColor: '#7b7b7b',
  shadowOffset: {
    width: 0,
    height: 3,
  },

  shadowRadius: 5,
  shadowOpacity: 1.0,
})``;

export const QuestionView = styled(LView).attrs({
  flex: 1,
  backgroundColor: '#eaeaea',
  borderRadius: 2,
  margin: 5,
  shadowColor: '#7b7b7b',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowRadius: 3,
  shadowOpacity: 1.0,
})``;

export const SeparatorLine = styled(RNView).attrs({
  backgroundColor: '#d6d6d6',
  height: 1,
  marginBottom: 5,
  marginTop: 5,
})``;

export const PaddedView = styled(LView).attrs({})``;

export const LeftButton = styled(RNTouchableOpacity).attrs({})`
  flex: 1;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-width: 0.5px;
  padding: 13px;
  border-color: ${liwiColors.blackColor};
  background-color: ${({ active }) => {
    if (active) {
      return liwiColors.greenColor;
    }
    return liwiColors.whiteColor;
  }};
`;

export const ViewQuestion = styled(RNView).attrs({})`
  flex: 0.7;
  flex-direction: row;
  border-radius: 5px;
  border-width: 0.5px;
  padding: 10px;
  margin-right: 20px;
  border-color: ${liwiColors.blackColor};
  background-color: ${liwiColors.lighterGreyColor};
`;

export const RightButton = styled(RNTouchableOpacity).attrs({})`
  flex: 1;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border-width: 0.5px;
  padding: 13px;
  border-color: ${liwiColors.blackColor};
  background-color: ${({ active }) => {
    if (active) {
      return liwiColors.redColor;
    }
    return liwiColors.whiteColor;
  }};
`;
