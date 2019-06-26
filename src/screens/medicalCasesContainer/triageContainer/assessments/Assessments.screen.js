// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { Button, Text, View } from 'native-base';
import i18n from '../../../../utils/i18n';
import Questions from '../../../../components/QuestionsContainer/Questions';
import { categories } from '../../../../../frontend_service/constants';
import moment from 'moment';

type Props = {};
type State = {};

export default class Assessments extends React.Component<Props, State> {

  render() {
    const { medicalCase } = this.props;

    let questions = medicalCase.nodes.filterByCategory(categories.assessment);

    // console.log(JSON.stringify(this.props.medicalCase));

    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {questions.length > 0 ? (
          <View>
            <Questions questions={questions} />
          </View>
        ) : (
          <View padding-auto margin-auto>
            <Text not-available>{i18n.t('work_case:no_questions')}</Text>
          </View>
        )}

        <View bottom-view columns>
          <Button light split>
            <Text>{i18n.t('form:back')}</Text>
          </Button>
          <Button light split>
            <Text>{i18n.t('form:next')}</Text>
          </Button>
        </View>
      </ScrollView>
    );
  }
}
