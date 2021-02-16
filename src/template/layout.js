import styled from 'styled-components';
import { StyleSheet, TouchableOpacity as RNTouchableOpacity, View as RNView } from 'react-native';
import { Col as LCol, H2 as LH2, Text as LText, View as LView } from 'native-base';
import { liwiColors } from '../utils/constants';
import React from 'react';

export const Text = styled(props => <LText {...props} />)`
  color: #4e4e4e;
  font-family: roboto;
  font-weight: bold;
  margin: 10px;
`;

export const ColCenter = styled(props => <LCol {...props} />)`
  justify-content: center;
  align-items: center;
`;

export const LiwiTitle2 = styled(props => <LH2 {...props} />)`
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
  margin-top: ${({ marginTop }) => {
    if (marginTop === true) {
      return '20px';
    }
    return '0px';
  }};
`;

export const LiwiTitle4 = styled(props => <LText {...props} />)`
  font-size: 24px;
  color: ${() => liwiColors.redColor};
  border-bottom-color: ${() => liwiColors.greyColor};
  margin-bottom: 10px;
`;

export const LiwiTitle5 = styled(props => <LText {...props} />)`
  font-size: 18px;
  color: ${() => liwiColors.blackLightColor};
  border-bottom-color: ${() => liwiColors.blackLightColor};
  font-weight: bold;
`;

export const RootView = styled(props => <LView {...props} />)`
  flex: 1;
`;

export const RightView = styled(props => <LView {...props} />)`
  flex-direction: row;
  justify-content: flex-end;
`;

export const ViewBlocColor = styled(props => <LView {...props} />)`
  border-radius: 4px;
  background-color: ${liwiColors.whiteColor};
  color: ${liwiColors.blackColor};
`;

export const SeparatorLine = styled(props => <RNView {...props} />)`
  background-color: #d6d6d6;
  height: 1px;
  margin-bottom: 5px;
  margin-top: 5;
`;

export const LeftButton = styled(props => <RNTouchableOpacity {...props} />)`
  flex: 1;
  border-width: 0.5px;
  padding: 10px;
  background-color: ${({ active }) => {
    if (active) {
      return liwiColors.darkerGreyColor;
    }
    return liwiColors.whiteColor;
  }};
`;

export const ViewQuestion = styled(props => <RNView {...props} />)`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  margin-right: ${({ marginRight }) => {
    return marginRight;
  }};
  margin-left: ${({ marginLeft }) => {
    return marginLeft;
  }};
  flex: ${({ flex }) => {
    return flex;
  }};
`;

export const RightButton = styled(props => <RNTouchableOpacity {...props} />)`
  flex: 1;
  border-width: 0.5px;
  border-left-width: 0;
  padding: 10px;
  border-color: ${liwiColors.blackColor};
  background-color: ${({ active }) => {
    if (active) {
      return liwiColors.darkerGreyColor;
    }
    return liwiColors.whiteColor;
  }};
`;

export const LiwiTabStyle = StyleSheet.create({
  tabStyle: {
    borderColor: liwiColors.darkGreyColor,
    borderWidth: 1,
  },
  activeTextStyle: {
    color: liwiColors.blackColor,
    fontSize: 20,
  },

  textStyle: {
    color: liwiColors.blackColor,
    fontSize: 20,
  },

  tabBarUnderlineStyle: {
    backgroundColor: liwiColors.redColor,
  },

  activeTabStyle: {
    borderColor: liwiColors.darkGreyColor,
    borderWidth: 1,
  },

  style: {
    backgroundColor: 'transparent',
  },
});
