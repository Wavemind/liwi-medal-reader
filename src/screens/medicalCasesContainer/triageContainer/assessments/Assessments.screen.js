// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { Text, View } from 'native-base';
import type { NavigationScreenProps } from 'react-navigation';
import Questions from '../../../../components/QuestionsContainer/Questions';
import { categories } from '../../../../../frontend_service/constants';
import { styles } from './Assessments.style';
import type { StateApplicationContext } from '../../../../engine/contexts/Application.context';
import NavigationTriage from '../../../../components/uix/NavigationTriage';

type Props = NavigationScreenProps & {};

type State = StateApplicationContext & {};

// TODO Will be implemented
// eslint-disable-next-line react/prefer-stateless-function
export default class Assessments extends React.Component<Props, State> {
  render() {
    const {
      medicalCase,
      app: { t },
    } = this.props;

    let questions = medicalCase.nodes.filterByCategory(categories.assessment);

    // noinspection RequiredAttributes
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
        <NavigationTriage questionsInScreen={questions} />
      </ScrollView>
    );
  }
}
