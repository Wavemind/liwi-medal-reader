// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { Text, View } from 'native-base';
import type { NavigationScreenProps } from 'react-navigation';
import Questions from '../../../components/QuestionsContainer/Questions';
import { categories } from '../../../../frontend_service/constants';
import { styles } from './Tests.style';

type Props = NavigationScreenProps & {};

export default function Tests(props: Props) {
  const {
    medicalCase,
  } = props;

  let assessment_test = medicalCase.nodes.filterByCategory(
    categories.assessment
  );

  let vaccine = medicalCase.nodes.filterByCategory(categories.vaccine);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text>assessment_test</Text>
        <Questions questions={assessment_test} />
        <Text>vaccine</Text>
        <Questions questions={vaccine} />
      </View>
    </ScrollView>
  );
}
