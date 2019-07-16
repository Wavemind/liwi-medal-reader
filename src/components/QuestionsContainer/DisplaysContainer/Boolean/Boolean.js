// @flow

import * as React from 'react';
import type { NavigationScreenProps } from 'react-navigation';
import { liwiColors } from '../../../../utils/constants';
import { Button, Icon, Text, View } from 'native-base';
import { LeftButton, RightButton } from '../../../../template/layout';
import { categories } from '../../../../../frontend_service/constants';

type Props = NavigationScreenProps & {};
type State = {};

export default class Boolean extends React.Component<Props, State> {
  static defaultProps = {
    question: {},
    category: null,
    widthView: 0,
  };

  shouldComponentUpdate(nextProps: Readonly<P>): boolean {
    return (
      nextProps.question.answer !== this.props.question.answer ||
      nextProps.widthView !== this.props.widthView
    );
  }

  _handleClick = (answer) => {
    let newAnswer = Number(answer);

    if (answer === this.props.question.answer) {
      newAnswer = null;
    }

    this.props.setQuestion(this.props.question.id, newAnswer);
  };

  render = () => {
    const { answer, answers, label, category, id } = this.props.question;
    const { widthView, index } = this.props;

    // Define the id for the answer
    const idYes = Number(Object.keys(answers)[0]);
    const idNo = Number(Object.keys(answers)[1]);

    let RenderJsx;

    // By the type of boolean node
    switch (category) {
      // If this is a chief complain
      case categories.chiefComplain:
        // onlayout isn't set
        if (widthView === 0) {
          RenderJsx = () => null;
          return null;
        }

        const margin = 15;
        const sizeButton = Math.floor(widthView / 3 - margin * 1.33);

        const mod = index % 3;
        let styleMargin = {};
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

        let activeStyle;
        let idOnPress;

        if (answer === null || answer === idNo) {
          activeStyle = { backgroundColor: liwiColors.greyColor };
          idOnPress = idYes;
        } else {
          activeStyle = { backgroundColor: liwiColors.greenColor };
          idOnPress = idNo;
        }

        let concatStyle = {
          width: sizeButton,
          justifyContent: 'center',
          height: sizeButton,
          ...styleMargin,
          ...activeStyle,
        };

        // Only one button for this type of node
        RenderJsx = () => (
          <Button
            key={index + category}
            onPress={() => this._handleClick(idOnPress)}
            style={concatStyle}
            light
          >
            <Text center>{label}</Text>
          </Button>
        );
        break;

      default:
        RenderJsx = () => (
          <View answer>
            <LeftButton
              active={answer === idYes}
              onPress={() => this._handleClick(idYes)}
            >
              <Text white={answer === idYes} center>
                Oui
              </Text>
            </LeftButton>
            <RightButton
              onPress={() => this._handleClick(idNo)}
              active={answer === idNo}
            >
              <Text center white={answer === idNo}>
                Non
              </Text>
            </RightButton>
          </View>
        );

        break;
    }

    return <RenderJsx />;
  };
}
