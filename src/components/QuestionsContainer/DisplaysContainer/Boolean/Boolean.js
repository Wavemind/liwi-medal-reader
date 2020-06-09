// @flow

import * as React from "react";
import type { NavigationScreenProps } from "react-navigation";
import { Button, Text, View } from "native-base";

import { LeftButton, RightButton } from "../../../../template/layout";
import { categories } from "../../../../../frontend_service/constants";
import { liwiColors } from "../../../../utils/constants";
import { styles } from "./Boolean.style";

type Props = NavigationScreenProps & {};
type State = {};

export default class Boolean extends React.Component<Props, State> {
  static defaultProps = {
    question: {},
    category: null,
    widthView: 0,
  };

  shouldComponentUpdate(nextProps: Readonly<P>): boolean {
    const { question, widthView, pageIndex, selectedPage } = this.props;

    if (pageIndex !== undefined && nextProps.selectedPage !== pageIndex) {
      return false;
    }

    // When view is selected
    if (selectedPage !== pageIndex && nextProps.selectedPage === pageIndex) {
      return true;
    }

    return nextProps.question.answer !== question.answer || nextProps.widthView !== widthView;
  }

  /**
   * Set answer in store
   * @param {boolean} answer - Value to save in store
   * @returns {null}
   * @private
   */
  _handleClick = (answer) => {
    const { question, setAnswer, setPatientValue, patientValueEdit } = this.props;
    let newAnswer = Number(answer);

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

  render = () => {
    const {
      app: { t },
      question: { answer, answers, label, category },
      widthView,
      index,
    } = this.props;

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

        if (answer === null) {
          activeStyle = { backgroundColor: 'transparent' };
          idOnPress = idYes;
        } else if (answer === idYes) {
          activeStyle = {
            borderColor: liwiColors.greenColor,
          };
          idOnPress = idNo;
        } else if (answer === idNo) {
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
              <LeftButton active={answer === idYes} onPress={() => this._handleClick(idYes)}>
                <Text white={answer === idYes} center>
                  {t('question:yes')}
                </Text>
              </LeftButton>

              <RightButton onPress={() => this._handleClick(idNo)} active={answer === idNo}>
                <Text center white={answer === idNo}>
                  {t('question:no')}
                </Text>
              </RightButton>
            </View>
          </Button>
        );
        break;

      default:
        RenderJsx = () => (
          <View answer>
            <LeftButton active={answer === idYes} onPress={() => this._handleClick(idYes)}>
              <Text white={answer === idYes} center>
                {t('question:yes')}
              </Text>
            </LeftButton>
            <RightButton onPress={() => this._handleClick(idNo)} active={answer === idNo}>
              <Text center white={answer === idNo}>
                {t('question:no')}
              </Text>
            </RightButton>
          </View>
        );
        break;
    }

    return <RenderJsx />;
  };
}
