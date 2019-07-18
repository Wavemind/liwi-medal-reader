// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text } from 'native-base';
import { ScrollView } from 'react-native';
import _ from 'lodash';

import { categories } from '../../../../../frontend_service/constants';
import Questions from '../../../../components/QuestionsContainer/Questions';

type Props = NavigationScreenProps & {};

type State = {};

export default class MedicalHistory extends React.Component<Props, State> {
  // default settings
  state = {};

  render() {
    const { medicalCase } = this.props;

    let questions = medicalCase.nodes.filterByCategory(
      categories.chiefComplain
    );

    // TODO Will be implemented
    // eslint-disable-next-line no-unused-vars
    let activedChiefComplains = _.filter(
      questions,
      (n) => n.answer === Number(Object.keys(n.answers)[0])
    );

    let counterMoreZero =  medicalCase.nodes.filterByCounterGreaterThanZero();
    let questionsWithOutChiefComplains = _.filter(counterMoreZero, (w) => w.category !== categories.chiefComplain );
    let allQuestions = _.filter(medicalCase.nodes, (w) => w.category !== categories.chiefComplain );

    return (
      <ScrollView>
        <Text>Question with counter &gt; 0</Text>
        <Questions questions={questionsWithOutChiefComplains} />
        <Text>All questions</Text>
        <Questions questions={allQuestions} />
      </ScrollView>
    );
  }
}
