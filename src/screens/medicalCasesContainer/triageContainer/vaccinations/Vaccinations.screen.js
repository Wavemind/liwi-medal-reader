// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { Button, Text, View } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import Questions from '../../../../components/QuestionsContainer/Questions';
import { categories } from '../../../../../frontend_service/constants';
import { styles } from './Vaccinations.style';
import type { StateApplicationContext } from '../../../../engine/contexts/Application.context';

type Props = NavigationScreenProps & {};

type State = StateApplicationContext & {};

// TODO Will be implemented soon
// eslint-disable-next-line react/prefer-stateless-function
export default class Vaccinations extends React.Component<Props, State> {

  render() {
    const { medicalCase, app : { t } } = this.props;

    let questions = medicalCase.nodes.filterByCategory(categories.vaccine);

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
