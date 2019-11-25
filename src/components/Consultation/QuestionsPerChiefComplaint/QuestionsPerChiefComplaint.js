// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native';
import { Text, View } from 'native-base';
import { categories } from '../../../../frontend_service/constants';
import { styles } from './QuestionsPerChiefComplaint.style';
import ChiefComplaint from '../ChiefComplaint';

type Props = NavigationScreenProps & {};

type State = {};

export default class QuestionsPerChiefComplaint extends React.Component<Props, State> {
  shouldComponentUpdate(nextProps: Props): boolean {
    const { pageIndex } = this.props;
    return nextProps.selectedPage === pageIndex;
  }

  generateQuestions = (chiefComplaint) => {
    const { medicalCase, category } = this.props;

    let questions = [];
    chiefComplaint[category].map((q) => {
      if (medicalCase.nodes[q].counter > 0) {
        questions.push(medicalCase.nodes[q]);
      }
    });
    return questions;
  };

  // default settings
  state = {
    // eslint-disable-next-line react/destructuring-assignment
    chiefComplaints: this.props.medicalCase.nodes.filterByCategory(categories.chiefComplaint),
  };

  render() {
    const { category, app: { t } } = this.props;
    const { chiefComplaints } = this.state;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {chiefComplaints.length > 0 ? (
          chiefComplaints.map((chiefComplaint) => (
            <ChiefComplaint
              chiefComplaint={chiefComplaint}
              category={category}
              key={'chiefComplaint' + chiefComplaint.id}
              questions={this.generateQuestions(chiefComplaint)}
            />
          ))
        ) : (
          <View padding-auto margin-auto>
            <Text not-available>{t('patient_list:not_found')}</Text>
          </View>
        )}

      </ScrollView>
    );
  }
}
