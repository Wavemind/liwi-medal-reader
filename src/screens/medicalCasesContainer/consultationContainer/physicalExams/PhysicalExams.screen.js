// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text } from 'native-base';
import { ScrollView } from 'react-native';
import { categories } from '../../../../../frontend_service/constants';
import Questions from '../../../../components/QuestionsContainer/Questions';

type Props = NavigationScreenProps & {};

type State = {};

export default class PhysicalExams extends React.Component<Props, State> {
  // default settings
  state = {};


  render() {

    const { medicalCase } = this.props;

    let questions = medicalCase.nodes.filterByCategory(
      categories.physicalExam
    );

    return (
      <ScrollView>
        <Text>PhysicalExams</Text>

        <Questions questions={questions} />

      </ScrollView>
    );
  }
}
