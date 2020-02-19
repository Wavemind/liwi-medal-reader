// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View } from 'native-base';
import { ScrollView } from 'react-native';
import type { StateApplicationContext } from '../../../engine/contexts/Application.context';
import { styles } from './QuestionList.style';
import Questions from '../../QuestionsContainer/Questions';

type Props = NavigationScreenProps & {};
type State = { app: StateApplicationContext } & {};

/**
 * Component used to display list of triage questions
 * */
export default class QuestionList extends React.Component<Props, State> {
  state = {};
  static defaultProps = {};

  render() {
    const {
      questions,
      app: { t },
    } = this.props;

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
