// @flow
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { CheckBox, Icon, Text } from 'native-base';
import _ from 'lodash';

import { modalType } from '../../../../frontend_service/constants';
import { liwiColors, screensScale, screenWidth } from '../../../utils/constants';
import { ViewQuestion } from '../../../template/layout';
import { styles } from './Question.factory.style';
import WrapperQuestion from '../WrapperQuestion/WrapperQuestion';
import List from '../DisplaysContainer/List';
import { translateText } from '../../../utils/i18n';

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

    // Question with "unavailable" answer
    const currentNode = props.app.algorithm.nodes[props.question.id];
    const unavailableAnswer = _.find(currentNode.answers, (a) => a.value === 'not_available');

    this.state = {
      flexLabel,
      flexQuestion,
      flexToolTip,
      unavailableValue: props.question.unavailableValue,
      unavailableAnswer,
    };
  }

  shouldComponentUpdate(nextProps) {
    const { question } = this.props;

    return (
      question.counter !== nextProps.question.counter ||
      question.answer !== nextProps.question.answer ||
      question.value !== nextProps.question.value ||
      question.id !== nextProps.question.id ||
      question.unavailableValue !== nextProps.question.unavailableValue
    );
  }

  /**
   * Display validation for integer and float type. Based on medAL-creator info
   * @returns {null|*}
   * @private
   */
  _displayValidation = () => {
    const { question, patientValueEdit, isReadOnly } = this.props;

    if (question.validationType !== null && question.validationMessage !== null && !patientValueEdit && !isReadOnly) {
      return (
        <View style={question.validationType === 'error' ? styles.errorRow : styles.warningRow}>
          <Text white>{question.validationMessage}</Text>
        </View>
      );
    }

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

  /**
   * Set check box and reset unavailable answer to null if check box is unchecked
   */
  handleUnavailable = () => {
    const {
      app: { algorithm, set },
      setAnswer,
      setUnavailable,
      question,
    } = this.props;
    const { unavailableValue, unavailableAnswer } = this.state;

    set('answeredQuestionId', question.id);
    setUnavailable(algorithm, question.id, !unavailableValue);

    // Reset answer
    if (question.unavailableValue && question.answer !== null) {
      setAnswer(algorithm, question.id, null);
    }

    // Set answer (not_available answer)
    if (!unavailableValue && unavailableAnswer !== undefined) {
      setAnswer(algorithm, question.id, unavailableAnswer.id);
    }

    this.setState({ unavailableValue: !unavailableValue });
  };

  render() {
    const {
      question,
      app: { algorithm, algorithmLanguage },
      isReadOnly,
    } = this.props;
    const { flexQuestion, flexToolTip, flexLabel, unavailableValue, unavailableAnswer } = this.state;
    const currentNode = algorithm.nodes[question.id];

    return (
      <View
        style={[
          styles.condensed,
          styles.flexColumn,
          {
            backgroundColor: currentNode.is_danger_sign || currentNode?.emergency_status === 'referral' ? liwiColors.redLightColor : 'transparent',
            marginLeft: 0,
          },
        ]}
      >
        <View style={styles.flexRow}>
          <View flex={flexToolTip}>
            <TouchableOpacity style={styles.touchable} transparent onPress={this.openModal}>
              <Icon type="AntDesign" name="info" style={styles.iconInfo} />
            </TouchableOpacity>
          </View>
          <ViewQuestion flex={flexLabel} marginRight={10} marginLeft={0}>
            <Text style={styles.questionLabel} size-auto>
              {translateText(currentNode.label, algorithmLanguage)} {currentNode.is_mandatory ? '*' : null}
            </Text>
          </ViewQuestion>
          {unavailableValue ? (
            <View flex={flexQuestion}>{unavailableAnswer === undefined ? <List question={question} {...this.props} /> : null}</View>
          ) : (
            <WrapperQuestion key={`${question.id}_answer`} question={question} flex={flexQuestion} {...this.props} />
          )}
        </View>
        <View style={styles.unavailable}>
          {currentNode.unavailable && !isReadOnly ? (
            <>
              <Text>{currentNode.unavailable_label !== '' ? translateText(currentNode.unavailable_label, algorithmLanguage) : translateText(unavailableAnswer.label, algorithmLanguage)}</Text>
              <CheckBox style={styles.unavailableBox} onPress={this.handleUnavailable} color={liwiColors.redColor} checked={unavailableValue} />
            </>
          ) : null}
        </View>
        {this._displayValidation()}
      </View>
    );
  }
}
