// @flow

import * as React from 'react';
import type { NavigationScreenProps } from 'react-navigation';
import { Button, Text, View } from 'native-base';
import { Image } from 'react-native';
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
    const { question, widthView } = this.props;
    return (
      nextProps.question.answer !== question.answer ||
      nextProps.widthView !== widthView
    );
  }

  _handleClick = (answer) => {
    const { question, setQuestion } = this.props;
    let newAnswer = Number(answer);

    // Break if chiefcomplain
    if (
      question.category === categories.chiefComplain &&
      answer === question.answer
    ) {
      return null;
    }

    if (answer === question.answer) {
      newAnswer = null;
    }

    setQuestion(question.id, newAnswer);
  };

  render = () => {
    const {
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
    let styleImage;

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
            backgroundColor: 'rgba(0,153,0,0.2)',
          };
          idOnPress = idNo;
        } else if (answer === idNo) {
          idOnPress = idYes;
          activeStyle = {
            backgroundColor: 'rgba(255,51,0,0.2)',
            opacity: 0.3,
          };
        }

        concatStyle = {
          elevation: 1,
          width: sizeButton,
          flexDirection: 'column',
          height: sizeButton,
          ...styleMargin,
          ...activeStyle,
          justifyContent: 'space-between',
        };

        styleImage = {
          width: 40,
          height: 40,
        };

        // Only one button for this type of node
        RenderJsx = () => (
          <Button
            key={index + category}
            onPress={() => this._handleClick(idOnPress)}
            style={concatStyle}
            light
          >
            <Image
              source={require('../../../../../assets/images/home.png')}
              style={styleImage}
            />
            <Text center>{label}</Text>
            <View>
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
