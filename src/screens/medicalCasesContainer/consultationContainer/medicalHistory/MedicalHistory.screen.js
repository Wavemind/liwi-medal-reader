// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View, Text } from 'native-base';
import { ScrollView } from 'react-native';
import _ from 'lodash';
import { categories, stage } from '../../../../../frontend_service/constants';
import Questions from '../../../../components/QuestionsContainer/Questions';
import { styles } from './MedicalHistory.style';

type Props = NavigationScreenProps & {};

type State = {};

export default class MedicalHistory extends React.Component<Props, State> {
  // default settings
  state = {};

  render() {
    const { medicalCase } = this.props;

    // TODO Will be implemented -> Waiting for backend to categories questions per chief complaints
    let questions = medicalCase.nodes.filterByCategory(
      categories.chiefComplaint,
    );
    let retainedChiefComplaints = _.filter(
      questions,
      (n) => n.answer === Number(Object.keys(n.answers)[0]),
    );

    let filteredQuestions = medicalCase.nodes.multipleFilter([
      { by: 'category', operator: 'equal', value: categories.symptom },
      { by: 'stage', operator: 'equal', value: stage.consultation },
      { by: 'counter', operator: 'more', value: 0 },
    ]);

    let chiefComplaintsAccordion = [];
    retainedChiefComplaints.map((chiefComplaint) => {
      chiefComplaintsAccordion.push({
        title: chiefComplaint.label,
        content: <Questions questions={filteredQuestions} />
        ,
      });
    });

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {chiefComplaintsAccordion.map((chiefComplaint) => (
          <View style={{paddingBottom: 10, marginBottom: 20}} key={`chiefComplaint_${chiefComplaint.title}`}>
            <Text subText>{chiefComplaint.title}</Text>
            {chiefComplaint.content}
          </View>
        ))}
      </ScrollView>
    );
  }
}
