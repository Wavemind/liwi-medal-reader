// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';
import { Text, View } from 'native-base';
import _ from 'lodash';
import { styles } from './QuestionsPerSystem.style';
import System from '../System';

type Props = NavigationScreenProps & {};

type State = {};

export default class QuestionsPerSystem extends React.Component<Props, State> {
  shouldComponentUpdate(nextProps: Props): boolean {
    const { pageIndex } = this.props;
    if (nextProps.medicalCase.id === undefined) {
      return false;
    }
    return nextProps.selectedPage === pageIndex;
  }

  render() {
    const {
      app: { t },
      questions,
    } = this.props;

    const groupBySystem = _.groupBy(questions, 'system');

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {Object.keys(groupBySystem).length > 0 ? (
          Object.keys(groupBySystem).map((keySystem) => <System system={keySystem} key={`system_${keySystem}`} questions={groupBySystem[keySystem]} />)
        ) : (
          <View padding-auto margin-auto>
            <Text not-available>{t('patient_list:not_found')}</Text>
          </View>
        )}
      </ScrollView>
    );
  }
}
