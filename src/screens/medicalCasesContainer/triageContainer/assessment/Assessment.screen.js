// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { View } from 'native-base';

import { LiwiTitle2 } from '../../../template/layout';
import i18n from '../../../utils/i18n';

type Props = {};
type State = {};

export default class Assessment extends React.Component<Props, State> {

  render() {
    return (
      <ScrollView>
        <View padding-auto>
          <LiwiTitle2 noBorder>{i18n.t('patient_list:search')}</LiwiTitle2>
        </View>
      </ScrollView>
    );
  }
}
