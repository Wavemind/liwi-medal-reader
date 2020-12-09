// @flow

import * as React from 'react';
import { Button, Text, Textarea, View } from 'native-base';
import { Suspense } from 'react';
import { SectionList } from 'react-native';

import { styles } from './Referral.style';
import LiwiLoader from '../../utils/LiwiLoader';
import { questionsReferral } from '../../../frontend_service/algorithm/questionsStage.algo';
import QuestionFactory from '../QuestionsContainer/QuestionFactory';
import i18n from '../../utils/i18n';

export default class Referral extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      referral: props.referral,
    };
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.selectedPage === 3;
  }

  render() {
    const {
      app: { algorithm, t },
    } = this.props;
    const { referral } = this.state;

    const questions = questionsReferral(algorithm);
    console.log(questions);

    return (
      <View style={styles.pad}>
        <Text style={styles.text}>{t('diagnoses:consultation_comment')}</Text>
        <View>
          <Button style={styles.alignRight} onPress={this.save}>
            <Text>{i18n.t('comment:save')}</Text>
          </Button>
          <Textarea rowSpan={24} value={referral} onChange={this.handleComment} bordered style={styles.activeTextArea} />
        </View>
      </View>
    );
  }
}
