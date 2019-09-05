// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import {
  Button,
  Icon,
  Input,
  Item,
  List,
  ListItem,
  Picker,
  Text,
  View,
} from 'native-base';

import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import { NavigationScreenProps } from 'react-navigation';
import { styles } from './DiagnosesStrategy.style';
import { LiwiTitle2, SeparatorLine } from '../../../template/layout';
import { getArray } from '../../../engine/api/LocalStorage';
import { medicalCaseStatus } from '../../../../frontend_service/constants';
import type { StateApplicationContext } from '../../../engine/contexts/Application.context';
import LiwiLoader from '../../../utils/LiwiLoader';

type Props = NavigationScreenProps & {};
type State = StateApplicationContext & {};

export default class MedicalCaseList extends React.Component<Props, State> {
  state = {};

  async componentWillMount() {}

  render() {
    const {} = this.state;

    const {
      app: { t },
    } = this.props;

    // Order the medical case
    return (
      <ScrollView>
        <View padding-auto>
          <LiwiTitle2 noBorder>{t('Diagnoses and Strategy')}</LiwiTitle2>
        </View>
      </ScrollView>
    );
  }
}
