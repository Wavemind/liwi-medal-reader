// @flow

import * as React from 'react';
import type { NavigationScreenProps } from 'react-navigation';
import { Button, Text, View } from 'native-base';

import { LeftButton, RightButton } from '../../../../template/layout';
import { categories } from '../../../../../frontend_service/constants';
import { liwiColors } from '../../../../utils/constants';
import { styles } from './Boolean.style';

type Props = NavigationScreenProps & {};
type State = {};

export default class Boolean extends React.Component<Props, State> {
  static defaultProps = {
    question: {},
    category: null,
    widthView: 0,
  };

  state = {
    value: null,
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { widthView, pageIndex, selectedPage } = this.props;
    const { value } = this.state;

    if (pageIndex !== undefined && nextProps.selectedPage !== pageIndex) {
      return false;
    }

    // When view is selected
    if (selectedPage !== pageIndex && nextProps.selectedPage === pageIndex) {
      return true;
    }

    return nextState.value !== value || nextProps.widthView !== widthView;
  }

  componentDidMount() {
    const {
      question: { answer, answers },
    } = this.props;

    const idYes = Number(Object.keys(answers)[0]);
    const idNo = Number(Object.keys(answers)[1]);

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
      question,
      question: { answers },
      setAnswer,
      setPatientValue,
      patientValueEdit,
    } = this.props;

    const idYes = Number(Object.keys(answers)[0]);
    const idNo = Number(Object.keys(answers)[1]);
    let newAnswer = Number(answer);

    if (newAnswer === idYes) {
      this.setState({ value: true });
    } else if (newAnswer === idNo) {
      this.setState({ value: false });
    }
    // Give the time to the component to render the view before updating the stateJ'a
    await new Promise((resolve) => setTimeout(resolve, 25));

    // Break if complaintCategory
    if (question.category === categories.complaintCategory && answer === question.answer) {
      return null;
    }

    if (answer === question.answer) {
      newAnswer = null;
    }

    if (patientValueEdit) {
      setPatientValue(question.id, newAnswer);
    } else {
      setAnswer(question.id, newAnswer);
    }
  };

  // TODO: Sorry for this. But I don't have any strength to refactor this shit
  render = () => {
    const {
      app: { t },
      question: { answers, label, category },
      widthView,
      index,
      isReadOnly,
    } = this.props;
    const { value } = this.state;

    // Define the id for the answer
    const idYes = Number(Object.keys(answers)[0]);
    const idNo = Number(Object.keys(answers)[1]);

    const margin = 15;
    const sizeButton = Math.floor(widthView / 3 - margin * 1.33);
    const mod = index % 3;

    let styleMargin = {};
    let activeStyle;
    let idOnPress;
    let concatStyle;

    let RenderJsx;

    // By the type of boolean node
    switch (category) {
      // If this is a chief complain
      case categories.complaintCategory:
        // onlayout isn't set
        if (widthView === 0) {
          RenderJsx = () => null;
          return null;
        }

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
        } else if (value === true) {
          activeStyle = {
            borderColor: liwiColors.greenColor,
          };
          idOnPress = idNo;
        } else if (value === false) {
          idOnPress = idYes;
          activeStyle = {
            borderColor: liwiColors.redColor,
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
                {label}
              </Text>
            </View>
            <View style={styles.bottomInput}>
              <LeftButton active={value === true} onPress={() => this._handleClick(idYes)} disabled={isReadOnly}>
                <Text white={value === true} center>
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
        break;

      default:
        const leftLabel = Object.values(answers)[0].label;
        const rightLabel = Object.values(answers)[1].label;

        RenderJsx = () => (
          <View answer>
            <LeftButton active={value === true} onPress={() => this._handleClick(idYes)} disabled={isReadOnly}>
              <Text white={value === true} center style={{ fontSize: leftLabel.length > 3 ? 10 : 16 }}>
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
        break;
    }

    return <RenderJsx />;
  };
}
