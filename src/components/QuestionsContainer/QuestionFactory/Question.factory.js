// @flow
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'native-base';
import _ from 'lodash';

import { displayFormats, modalType } from '../../../../frontend_service/constants';
import { liwiColors, screensScale, screenWidth } from '../../../utils/constants';
import { ViewQuestion } from '../../../template/layout';
import { styles } from './Question.factory.style';
import Unavailable from '../../InputContainer/Unavailable';
import WrapperQuestion from '../WrapperQuestion/WrapperQuestion';

export default class Question extends React.Component {
  state: {
    flexLabel: 0.4,
    flexQuestion: 0.5,
    flexToolTip: 0.1,
  };

  constructor(props) {
    super(props);

    let flexLabel = 0.5;
    let flexQuestion = 0.4;
    let flexToolTip = 0.1;

    // Change flex for small screen
    if (screenWidth < screensScale.s) {
      flexLabel = 0.4;
      flexQuestion = 0.5;
      flexToolTip = 0.1;
    }

    this.state = {
      flexLabel,
      flexQuestion,
      flexToolTip,
    };
  }

  shouldComponentUpdate(nextProps) {
    const { question } = this.props;
    return question.counter !== nextProps.question.counter || question.answer !== nextProps.question.answer || question.value !== nextProps.question.value || question.id !== nextProps.question.id;
  }

  /**
   * Display validation for integer and float type. Based on Medal-C info
   * @returns {null|*}
   * @private
   */
  _displayValidation = () => {
    const { question, patientValueEdit } = this.props;

    if (question.validationType !== null && question.validationMessage !== null && !patientValueEdit) {
      return (
        <View style={question.validationType === 'error' ? styles.errorRow : styles.warningRow}>
          <Text white>{question.validationMessage}</Text>
        </View>
      );
    }

    // Nothing
    return null;
  };

  /**
   * Open redux modal
   */
  openModal = () => {
    const {
      app: { algorithm },
      updateModalFromRedux,
      question,
    } = this.props;

    const currentNode = algorithm.nodes[question.id];
    updateModalFromRedux({ node: currentNode }, modalType.description);
  };

  render() {
    const {
      question,
      app: { t, algorithm },
    } = this.props;
    const { flexQuestion, flexToolTip, flexLabel } = this.state;
    const currentNode = algorithm.nodes[question.id];

    // If this is not a question we return null
    if (currentNode.display_format === displayFormats.formula && !__DEV__) {
      return null;
    }

    const unavailableAnswer = _.find(currentNode.answers, (a) => a.value === 'not_available');

    return (
      <View style={[styles.condensed, styles.flexColumn, { backgroundColor: currentNode.is_danger_sign || currentNode?.emergency_status === 'referral' ? liwiColors.redLightColor : 'transparant', marginLeft: 0 }]}>
        <View style={styles.flexRow}>
          <View flex={flexToolTip}>
            <TouchableOpacity style={styles.touchable} transparent onPress={this.openModal}>
              <Icon type="AntDesign" name="info" style={styles.iconInfo} />
            </TouchableOpacity>
          </View>
          <ViewQuestion flex={flexLabel} marginRight={10} marginLeft={0}>
            <Text style={styles.questionLabel} size-auto>
              {currentNode.label} {currentNode.is_mandatory ? '*' : null}
            </Text>
          </ViewQuestion>
          <WrapperQuestion key={`${question.id}_answer`} question={question} flex={flexQuestion} {...this.props} />
        </View>
        {this._displayValidation()}
        <View style={styles.unavailable}>
          {unavailableAnswer !== undefined ? (
            <>
              <Text>{t('question:unavailable')} </Text>
              <Unavailable question={question} unavailableAnswer={unavailableAnswer} />
            </>
          ) : null}
        </View>
      </View>
    );
  }
}
