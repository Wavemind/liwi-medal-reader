import styled from 'styled-components/native';
import { liwiColors } from '/utils/constants';

import { Text as LText, View as LView } from 'native-base';

export const TextExemple = styled(LText).attrs({})`
  color: #4e4e4e;
  font-family: roboto;
  font-weight: bold;
  margin: 10px;
`;

export const RootView = styled(LView).attrs({
  flex: 1,
})``;

export const PaddedView = styled(LView).attrs({})``;
