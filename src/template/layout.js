import styled from 'styled-components/native';
import { liwiColors } from '/utils/constants';
import { View as RNView } from 'react-native';
import { Text as LText, View as LView } from 'native-base';
import { screenWidth } from '../utils/constants';

export const TextExemple = styled(LText).attrs({})`
  color: #4e4e4e;
  font-family: roboto;
  font-weight: bold;
  margin: 10px;
`;

export const RootView = styled(LView).attrs({
  flex: 1,
})``;

export const RightView = styled(LView).attrs({
  flexDirection: 'row',
  justifyContent: 'flex-end',
})``;

export const CardView = styled(LView).attrs({
  backgroundColor: '#eaeaea',
  borderRadius: 2,
  padding: 10,
  margin: 20,
  shadowColor: '#7b7b7b',
  shadowOffset: {
    width: 0,
    height: 3,
  },

  shadowRadius: 5,
  shadowOpacity: 1.0,
})``;

export const SeparatorLine = styled(RNView).attrs({
  backgroundColor: '#e3e3e3',
  height: 0.5,
  marginBottom: 5,
  marginTop: 5,
})``;

export const PaddedView = styled(LView).attrs({})``;
