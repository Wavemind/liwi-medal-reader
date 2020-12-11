// @flow
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { CheckBox, Icon, Text } from 'native-base';
import _ from 'lodash';

import { categories, displayFormats, modalType } from '../../../../frontend_service/constants';
import { liwiColors, screensScale, screenWidth } from '../../../utils/constants';
import { ViewQuestion } from '../../../template/layout';
import { styles } from './Question.factory.style';
import Unavailable from '../../InputContainer/Unavailable';
import WrapperQuestion from '../WrapperQuestion/WrapperQuestion';
import List from '../DisplaysContainer/List';

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
      unavailableValue: props.question.unavailableValue,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { question } = this.props;
    const { unavailableValue } = this.state;

    return (
      question.counter !== nextProps.question.counter ||
      question.answer !== nextProps.question.answer ||
      question.value !== nextProps.question.value ||
      question.id !== nextProps.question.id ||
      unavailableValue !== nextState.unavailableValue
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
      app: { algorithm },
      setAnswer,
      setUnavailable,
      question,
    } = this.props;
    const { unavailableValue } = this.state;

    // Reset unavailable answer
    if (question.unavailableValue) {
      setAnswer(algorithm, question.id, null);
    }

    setUnavailable(algorithm, question.id, !unavailableValue);
    this.setState({ unavailableValue: !unavailableValue });
  };

  render() {
    const {
      question,
      app: { t, algorithm },
      isReadOnly,
    } = this.props;
    const { flexQuestion, flexToolTip, flexLabel, unavailableValue } = this.state;
    const currentNode = algorithm.nodes[question.id];

    // If this is not a question we return null
    if (currentNode.display_format === displayFormats.formula && !__DEV__) {
      return null;
    }

    // Unavailable for test
    const unavailableAnswer = _.find(currentNode.answers, (a) => a.value === 'not_available');

    // Unavailable for vital sign and basic measurements
    const displayUnavailable =
      (currentNode.unavailable && (currentNode.category === categories.basicMeasurement || currentNode.category === categories.vitalSignAnthropometric)) || question.unavailableValue;
    return (
      <View
        style={[
          styles.condensed,
          styles.flexColumn,
          { backgroundColor: currentNode.is_danger_sign || currentNode?.emergency_status === 'referral' ? liwiColors.redLightColor : 'transparent', marginLeft: 0 },
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
              {currentNode.label} {currentNode.is_mandatory ? '*' : null}
            </Text>
          </ViewQuestion>
          {unavailableValue ? (
            <View flex={flexQuestion}>
              <List question={question} {...this.props} />
            </View>
          ) : (
            <WrapperQuestion key={`${question.id}_answer`} question={question} flex={flexQuestion} {...this.props} />
          )}
        </View>
        {this._displayValidation()}
        <View style={styles.unavailable}>
          {unavailableAnswer !== undefined && !isReadOnly ? (
            <>
              <Text>{t('question:unavailable')} </Text>
              <Unavailable question={question} unavailableAnswer={unavailableAnswer} />
            </>
          ) : null}
          {displayUnavailable && !isReadOnly ? <CheckBox style={styles.unavailableBox} onPress={this.handleUnavailable} color={liwiColors.redColor} checked={unavailableValue} /> : null}
        </View>
      </View>
    );
  }
}
