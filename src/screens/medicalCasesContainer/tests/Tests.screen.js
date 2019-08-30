// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { View } from 'native-base';
import type { NavigationScreenProps } from 'react-navigation';
import Questions from '../../../components/QuestionsContainer/Questions';
import { categories } from '../../../../frontend_service/constants';
import { styles } from './Tests.style';

type Props = NavigationScreenProps & {};

export default function Tests(props: Props) {
  const { medicalCase } = props;

  let assessmentTest = medicalCase.nodes.filterBy([
    { by: 'category', operator: 'equal', value: categories.assessment },
    { by: 'counter', operator: 'more', value: 0 },
  ]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Questions questions={assessmentTest} />
      </View>
    </ScrollView>
  );
}
