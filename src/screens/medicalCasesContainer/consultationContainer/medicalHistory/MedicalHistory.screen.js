// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import {
  Body,
  Button,
  Icon,
  Left,
  List,
  ListItem,
  Right,
  Switch,
  Text, View,
} from 'native-base';
import { ScrollView } from 'react-native';
import { categories } from '../../../../../frontend_service/constants';
import _ from 'lodash';
import Questions from '../../../../components/QuestionsContainer/Questions';

type Props = NavigationScreenProps & {};

type State = {};

export default class MedicalHistory extends React.Component<Props, State> {
  // default settings
  state = {};

  render() {
    const { t } = this.props;

    const { medicalCase } = this.props;

    let questions = medicalCase.nodes.filterByCategory(
      categories.chiefComplain
    );

    let chiefComplainsActived = _.filter(
      questions,
      (n) => n.answer === Number(Object.keys(n.answers)[0])
    );

    let counterMoreZero =  medicalCase.nodes.filterByCounterMoreThanZero();

    let questionsWithOutChiefComplains = _.filter(counterMoreZero, (w) => w.category !== categories.chiefComplain )

    return (
      <ScrollView>
        <Text>MedicalHistory</Text>
        <Questions questions={questionsWithOutChiefComplains} />
      </ScrollView>
    );
  }
}
