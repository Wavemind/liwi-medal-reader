// @flow
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Icon, ListItem, Text } from 'native-base';
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

  /**
   * Display question label
   * @returns {JSX.Element}
   * @private
   */
  _labelQuestion() {
    const {
      app: { algorithm },
      question,
    } = this.props;
    const { flexLabel } = this.state;
    const currentNode = algorithm.nodes[question.id];

    return (
      <ViewQuestion flex={flexLabel} marginRight={10} marginLeft={0}>
        <Text style={styles.questionLabel} size-auto>
          {currentNode.label} {currentNode.is_mandatory ? '*' : null}
        </Text>
      </ViewQuestion>
    );
  }

  render() {
    const {
      question,
      app: { t, algorithm },
    } = this.props;
    const { flexQuestion, flexToolTip } = this.state;
    const currentNode = algorithm.nodes[question.id];

    let WrapperUnavailable = () => null;
    let unavailableAnswer = null;

    unavailableAnswer = _.find(currentNode.answers, (a) => a.value === 'not_available');

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
    if (currentNode.display_format === displayFormats.formula && !__DEV__) {
      return null;
    }

    // Construct generic Component for the question
    return (
      <ListItem
        style={[styles.condensed, styles.flexColumn, { backgroundColor: currentNode.is_danger_sign ? liwiColors.redLightColor : 'transparant', marginLeft: 0 }]}
        noBorder
        key={`${question.id}_item`}
      >
        <View style={styles.flexRow}>
          <View flex={flexToolTip}>
            <TouchableOpacity style={styles.touchable} transparent onPress={() => this.openModal()}>
              <Icon type="AntDesign" name="info" style={styles.iconInfo} />
            </TouchableOpacity>
          </View>
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
