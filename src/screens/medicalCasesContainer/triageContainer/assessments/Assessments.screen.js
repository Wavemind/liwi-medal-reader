// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { Button, Text, View } from 'native-base';
import Questions from '../../../../components/QuestionsContainer/Questions';
import { categories } from '../../../../../frontend_service/constants';
import { styles } from './Assessments.style';
import { NavigationScreenProps } from 'react-navigation';
import type { StateApplicationContext } from '../../../../engine/contexts/Application.context';

type Props = NavigationScreenProps & {};

type State = StateApplicationContext & {};

export default class Assessments extends React.Component<Props, State> {

  render() {
    const { medicalCase, app: { t } } = this.props;

    let questions = medicalCase.nodes.filterByCategory(categories.assessment);

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

        <View bottom-view columns>
          <Button light split>
            <Text>{t('form:back')}</Text>
          </Button>
          <Button light split>
            <Text>{t('form:next')}</Text>
          </Button>
        </View>
      </ScrollView>
    );
  }
}
