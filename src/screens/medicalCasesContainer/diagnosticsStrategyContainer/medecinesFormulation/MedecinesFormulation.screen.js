// @flow
import React, { Component } from 'react';
import { Content, Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { styles } from './MedecinesFormulation.style';
import ToolTipModal from '../../../../components/ToolTipModal';
import { healthCareType } from '../../../../../frontend_service/constants';
import { SeparatorLine } from '../../../../template/layout';

type Props = NavigationScreenProps & {};
type State = {};
// eslint-disable-next-line react/prefer-stateless-function
export default class MedecinesFormulations extends Component<Props, State> {
  state = {};

  static defaultProps = {};

  render() {
    return (
      <View>
        <Text>MedecinesFormulations</Text>
      </View>
    );
  }
}
