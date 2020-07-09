// @flow
import * as React from 'react';
import type { NavigationScreenProps } from 'react-navigation';
import { View } from 'react-native';
import { ListItem, Text } from 'native-base';
import _ from 'lodash';

import { displayFormats, nodeTypes } from '../../../../frontend_service/constants';
import { liwiColors, screensScale, screenWidth } from '../../../utils/constants';
import { ViewQuestion } from '../../../template/layout';
import { styles } from './Question.factory.style';
import Unavailable from '../../InputContainer/Unavailable';
import TooltipButton from '../../TooltipButton/TooltipButton';
import WrapperQuestion from '../WrapperQuestion/WrapperQuestion';

type Props = NavigationScreenProps & {};

type State = {};

export default class Question extends React.Component<Props, State> {
  state: {
    flexLabel: 0.6,
    flexQuestion: 0.3,
    flexToolTip: 0.1,
  };

  constructor(props) {
    super(props);

    let flexLabel = 0.6;
    let flexQuestion = 0.3;
    let flexToolTip = 0.1;

    // Change flex for small screen
    if (screenWidth < screensScale.s) {
      flexLabel = 0.5;
      flexQuestion = 0.4;
      flexToolTip = 0.1;
    }

    this.state = {
      flexLabel,
      flexQuestion,
      flexToolTip,
    };
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    const { question } = this.props;

    return question.counter !== nextProps.question.counter || question.answer !== nextProps.question.answer || question.value !== nextProps.question.value || question.id !== nextProps.question.id;
  }

  /**
   * Display validation for integer and float type. Based on Medal-C info
   * @returns {null|*}
   * @private
   */
  _displayValidation = () => {
    const { question } = this.props;

    if (question.validationType !== null && question.validationMessage !== null) {
      return (
        <View style={question.validationType === 'error' ? styles.errorRow : styles.warningRow}>
          <Text white>{question.validationMessage}</Text>
        </View>
      );
    }

    // Nothing
    return null;
  };

  _labelQuestion() {
    const { question } = this.props;
    const { flexLabel } = this.state;
    return (
      <ViewQuestion flex={flexLabel} marginRight={10} marginLeft={0}>
        <Text style={{ color: liwiColors.blackColor }} size-auto>
          {question.label} {question.is_mandatory ? '*' : null}
        </Text>
      </ViewQuestion>
    );
  }

  render() {
    const {
      question,
      app: { t },
    } = this.props;
    const { flexQuestion, flexToolTip } = this.state;
    let WrapperUnavailable = () => null;
    let unavailableAnswer = null;

    unavailableAnswer = _.find(question.answers, (a) => a.value === 'not_available');

    if (unavailableAnswer !== undefined) {
      WrapperUnavailable = () => {
        return (
          <React.Fragment>
            <Text>{t('question:unavailable')} </Text>
            <Unavailable question={question} unavailableAnswer={unavailableAnswer} />
          </React.Fragment>
        );
      };
    }

    // If this is not a question we return null
    if (question === undefined || question.type !== nodeTypes.question || (question.display_format === displayFormats.formula && question.label !== 'Age in months' && !__DEV__)) {
      return null;
    }

    // Construct generic Component for the question
    return (
      <ListItem style={[styles.condensed, styles.flexColumn, { marginLeft: 0 }]} noBorder key={`${question.id}_item`}>
        <View style={styles.flexRow}>
          <TooltipButton node={question} title={question.label} flex={flexToolTip} />
          {this._labelQuestion()}
          <WrapperQuestion key={`${question.id}_answer`} question={question} flex={flexQuestion} {...this.props} />
        </View>
        {this._displayValidation()}
        <View style={styles.unavailable}>
          <WrapperUnavailable />
        </View>
      </ListItem>
    );
  }
}
