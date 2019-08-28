// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View } from 'native-base';
import { ScrollView } from 'react-native';
import { categories } from '../../../../../frontend_service/constants';
import Questions from '../../../../components/QuestionsContainer/Questions';
import { styles } from '../../triageContainer/assessments/Assessments.style';

type Props = NavigationScreenProps & {};
type State = {};

export default class PhysicalExams extends React.Component<Props, State> {
  // default settings
  state = {};

  render() {
    const {
      medicalCase,
      app: { t },
    } = this.props;

    let questions = medicalCase.nodes.filterByCategory(
      categories.physicalExam
    );

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {questions.length > 0 ? (
          <View>
            <Questions questions={questions} />
          </View>
        ) : (
          <View padding-auto margin-auto>
            <Text not-available>{t('work_case:no_questions')}</Text>
          </View>
        )}
      </ScrollView>
    );
  }
}
