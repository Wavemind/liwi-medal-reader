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
    if (nextProps.medicalCase.id === undefined) {
      return false;
    } else {
      return nextProps.selectedPage === pageIndex;
    }
  }

  generateQuestions = (complaintCategory) => {
    const { medicalCase, category } = this.props;

    let questions = [];
    complaintCategory[category].map((q) => {
      if (medicalCase.nodes[q].counter > 0) {
        questions.push(medicalCase.nodes[q]);
      }
    });
    return questions;
  };

  // default settings
  state = {
    // eslint-disable-next-line react/destructuring-assignment
  };

  render() {
    const {
      category,
      app: { t },
      medicalCase,
    } = this.props;

    const complaintCategories = medicalCase.nodes.filterByCategory(categories.complaintCategory);

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {complaintCategories.length > 0 ? (
          complaintCategories.map((complaintCategory) => (
            <ChiefComplaint
              complaintCategory={complaintCategory}
              category={category}
              key={'complaintCategory' + complaintCategory.id}
              questions={this.generateQuestions(complaintCategory)}
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
