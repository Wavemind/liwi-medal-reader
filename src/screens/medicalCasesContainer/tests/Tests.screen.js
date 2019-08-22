// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { Text, View } from 'native-base';
import type { NavigationScreenProps } from 'react-navigation';
import Questions from '../../../components/QuestionsContainer/Questions';
import { categories, stage } from '../../../../frontend_service/constants';
import { styles } from './Tests.style';

type Props = NavigationScreenProps & {};

export default function Tests(props: Props) {
  const { medicalCase } = props;

  let assessment_test = medicalCase.nodes.filterByMultiple([
    { by: 'category', operator: 'equal', value: categories.assessment },
    { by: 'counter', operator: 'more', value: 0 },
  ]);

  let vaccine = medicalCase.nodes.filterByMultiple([
    { by: 'category', operator: 'equal', value: categories.vaccine },
    { by: 'counter', operator: 'more', value: 0 },
  ]);

  console.log(assessment_test, vaccine);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text>Assessment_test</Text>
        <Questions questions={assessment_test} />
        <Text>Vaccine</Text>
        <Questions questions={vaccine} />
      </View>
    </ScrollView>
  );
}
