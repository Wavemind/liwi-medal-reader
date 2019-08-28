// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View, Text } from 'native-base';
import { ScrollView } from 'react-native';
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

    let chiefComplaints = medicalCase.nodes.filterByCategory(
      categories.chiefComplaint,
    );

    let questionsPerChiefComplaints = {};
    chiefComplaints.map((chiefComplaint) => {
      if (chiefComplaint.answer === Number(Object.keys(chiefComplaint.answers)[0])) {
        questionsPerChiefComplaints[chiefComplaint.id] = {
          id: chiefComplaint.id,
          title: chiefComplaint.label,
          questions: [],
        };
      }
    });

    let filteredQuestions = medicalCase.nodes.filterBy([
      { by: 'category', operator: 'equal', value: categories.symptom },
      { by: 'stage', operator: 'equal', value: stage.consultation },
      { by: 'counter', operator: 'more', value: 0 },
    ]);

    // TODO: waiting for CC array in question to finalize
    filteredQuestions.map((question) => {
      question.dd.map((diagnostic) => {
        questionsPerChiefComplaints[medicalCase.diagnostics[diagnostic.id].cc].questions.push(question);
      });
    });

    let chiefComplaintsAccordion = [];
    Object.keys(questionsPerChiefComplaints).map((id) => {
      chiefComplaintsAccordion.push({
        title: questionsPerChiefComplaints[id].title,
        content: <Questions questions={questionsPerChiefComplaints[id].questions} />,
      });
    });

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {chiefComplaintsAccordion.map((chiefComplaint) => (
          <View style={{ paddingBottom: 10, marginBottom: 20 }} key={`chiefComplaint_${chiefComplaint.title}`}>
            <Text subText>{chiefComplaint.title}</Text>
            {chiefComplaint.content}
          </View>
        ))}
      </ScrollView>
    );
  }
}
