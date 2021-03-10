// @flow

import * as React from 'react';
import { Button, Text, View } from 'native-base';
import { Dimensions } from 'react-native';

import { LeftButton, RightButton } from '../../../../template/layout';
import { categories, modalType } from '../../../../../frontend_service/constants';
import { liwiColors } from '../../../../utils/constants';
import { styles } from './Boolean.style';
import { translateText } from '../../../../utils/i18n';

export default class Boolean extends React.Component {
  static defaultProps = {
    question: {},
    category: null,
  };

  state = {
    value: null,
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { value } = this.state;
    const { question } = this.props;
    return nextState.value !== value || question.answer !== nextProps.question.answer;
  }

  componentDidMount() {
    const {
      app: { algorithm },
      question,
      question: { answer },
    } = this.props;

    const currentNode = algorithm.nodes[question.id];

    const idYes = Number(Object.keys(currentNode.answers)[0]);
    const idNo = Number(Object.keys(currentNode.answers)[1]);

    if (answer === idYes) {
      this.setState({ value: true });
    } else if (answer === idNo) {
      this.setState({ value: false });
    }
  }

  /**
   * Set answer in store
   * @param {boolean} answer - Value to save in store
   * @returns {null}
   * @private
   */
  _handleClick = async (answer) => {
    const {
      app: { algorithm, set },
      question,
      setAnswer,
      setPatientValue,
      patientValueEdit,
      updateModalFromRedux,
    } = this.props;
    const currentNode = algorithm.nodes[question.id];

    const idYes = Number(Object.keys(currentNode.answers)[0]);
    const idNo = Number(Object.keys(currentNode.answers)[1]);

    let newAnswer = Number(answer);

    if (newAnswer === idYes) {
      this.setState({ value: true });
    } else if (newAnswer === idNo) {
      this.setState({ value: false });
    }
    // Give the time to the component to render the view before updating the state
    await new Promise((resolve) => setTimeout(resolve, 25));

    // Break if complaintCategory
    if (currentNode.category === categories.complaintCategory && answer === question.answer) {
      return null;
    }

    if (patientValueEdit) {
      setPatientValue(question.id, newAnswer);
    } else {
      setAnswer(algorithm, question.id, newAnswer);
    }

    set('answeredQuestionId', question.id);

    // Open emergency modal
    if (currentNode?.emergency_status === 'emergency' && newAnswer === idYes) {
      updateModalFromRedux({}, modalType.emergencyWarning);
    }
  };

  // TODO: Sorry for this. But I don't have any strength to refactor this shit
  render = () => {
    const {
      app: { t, algorithm, algorithmLanguage },
      question,
      index,
      isReadOnly,
    } = this.props;
    const { value } = this.state;
    const { answers, label, category } = algorithm.nodes[question.id];

    // Define the id for the answer
    const idYes = Number(Object.keys(answers)[0]);
    const idNo = Number(Object.keys(answers)[1]);

    const margin = 15;
    const sizeButton = Math.floor(Dimensions.get('window').width / 3 - margin * 2.7);
    const mod = index % 3;

    let styleMargin = {};
    let activeStyle;
    let idOnPress;
    let concatStyle;

    let RenderJsx;

    // By the type of boolean node
    if (category === categories.complaintCategory && !isReadOnly) {
      // If this is a chief complain
      if (mod === 0) {
        styleMargin = {
          marginTop: margin,
          marginBottom: 0,
          marginLeft: margin,
          marginRight: 0,
        };
      } else if (mod === 1) {
        styleMargin = {
          marginTop: margin,
          marginBottom: 0,
          marginLeft: margin,
          marginRight: margin,
        };
      } else if (mod === 2) {
        styleMargin = {
          marginTop: margin,
          marginBottom: 0,
          marginLeft: 0,
          marginRight: margin,
        };
      }

      if (value === null) {
        activeStyle = { backgroundColor: 'transparent' };
        idOnPress = idYes;
      } else {
        idOnPress = value ? idYes : idNo;
        activeStyle = {
          borderColor: liwiColors.darkerGreyColor,
        };
      }

      concatStyle = {
        width: sizeButton,
        flexDirection: 'column',
        height: sizeButton,
        elevation: 5,
        borderRadius: 2,
        borderColor: liwiColors.darkGreyColor,
        ...styleMargin,
        ...activeStyle,
        justifyContent: 'space-between',
        backgroundColor: liwiColors.whiteColor,
        borderWidth: 2,
        paddingTop: 0,
        paddingBottom: 0,
      };

      // Only one button for this type of node
      RenderJsx = () => (
        <Button key={index + category} onPress={() => this._handleClick(idOnPress)} style={concatStyle} light>
          <View complaintCategories>
            <Text center size-auto>
              {translateText(label, algorithmLanguage)}
            </Text>
          </View>
          <View style={styles.bottomInput}>
            <LeftButton active={value} onPress={() => this._handleClick(idYes)} disabled={isReadOnly}>
              <Text white={value} center>
                {t('question:yes')}
              </Text>
            </LeftButton>

            <RightButton active={value === false} onPress={() => this._handleClick(idNo)} disabled={isReadOnly}>
              <Text center white={value === false}>
                {t('question:no')}
              </Text>
            </RightButton>
          </View>
        </Button>
      );
    } else {
      const leftLabel = translateText(Object.values(answers)[0].label, algorithmLanguage);
      const rightLabel = translateText(Object.values(answers)[1].label, algorithmLanguage);

      RenderJsx = () => (
        <View answer>
          <LeftButton active={value} onPress={() => this._handleClick(idYes)} disabled={isReadOnly}>
            <Text white={value} center style={{ fontSize: leftLabel.length > 3 ? 10 : 16 }}>
              {leftLabel}
            </Text>
          </LeftButton>
          <RightButton active={value === false} onPress={() => this._handleClick(idNo)} disabled={isReadOnly}>
            <Text center white={value === false} style={{ fontSize: rightLabel.length > 3 ? 10 : 16 }}>
              {rightLabel}
            </Text>
          </RightButton>
        </View>
      );
    }

    return <RenderJsx />;
  };
}
