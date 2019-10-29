// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View } from 'native-base';
import { ScrollView } from 'react-native';
import { categories } from '../../../../frontend_service/constants';
import Questions from '../../QuestionsContainer/Questions';
import { styles } from './QuestionsPerChiefComplaint.style';

type Props = NavigationScreenProps & {};

type State = {};

export default class QuestionsPerChiefComplaint extends React.Component<Props,
  State> {
  // default settings
  state = {};

  // TODO optimize this with scu ! @quentin

  render() {
    const { medicalCase, filterBy } = this.props;

    let chiefComplaints = medicalCase.nodes.filterByCategory(
      categories.chiefComplaint
    );

    let questionsPerChiefComplaints = {};
    chiefComplaints.map((chiefComplaint) => {
      if (
        chiefComplaint.answer === Number(Object.keys(chiefComplaint.answers)[0])
      ) {
        questionsPerChiefComplaints[chiefComplaint.id] = {
          id: chiefComplaint.id,
          title: chiefComplaint.label,
          questions: [],
        };
      }
    });

    let filteredQuestions = medicalCase.nodes.filterBy(filterBy);

    filteredQuestions.map((question) => {
      question.cc.map((cc) => {
        questionsPerChiefComplaints[cc]?.questions.push(question);
      });
    });

    let chiefComplaintsAccordion = [];
    Object.keys(questionsPerChiefComplaints).map((id) => {
      chiefComplaintsAccordion.push({
        title: questionsPerChiefComplaints[id].title,
        content: (
          <Questions questions={questionsPerChiefComplaints[id].questions} />
        ),
      });
    });

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {chiefComplaintsAccordion.map((chiefComplaint) => (
          <View
            style={styles.spacingChiefComplaints}
            key={`chiefComplaint_${chiefComplaint.title}`}
          >
            <Text customTitle>{chiefComplaint.title}</Text>
            {chiefComplaint.content}
          </View>
        ))}
      </ScrollView>
    );
  }
}
