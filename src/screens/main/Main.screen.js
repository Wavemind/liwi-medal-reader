// @flow

import * as React from 'react';
import { TextExemple } from 'template/layout';
import { ScrollView } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import MedicalCases from '../medicalCasesContainer/medicalCases/';
import i18n from '../../utils/i18n';

type Props = NavigationScreenProps & {};
type State = {};

export default class MainScreen extends React.Component<Props, State> {
  render(): React.Node {

    return (
      <ScrollView>
        <TextExemple customText>{i18n.t('login:welcome')}</TextExemple>
        <MedicalCases navigation={this.props.navigation} />
      </ScrollView>
    );
  }
}
