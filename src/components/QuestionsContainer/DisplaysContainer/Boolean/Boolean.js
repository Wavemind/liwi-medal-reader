// @flow

import * as React from 'react';
import type { NavigationScreenProps } from 'react-navigation';
import { liwiColors } from '../../../../utils/constants';
import { Icon, Text, View } from 'native-base';
import { LeftButton, RightButton } from '../../../../template/layout';

type Props = NavigationScreenProps & {};
type State = {};

export default class Boolean extends React.Component<Props, State> {
  shouldComponentUpdate(nextProps: Readonly<P>): boolean {
    console.log(nextProps.question, this.props.question)
    return nextProps.question.answer !== this.props.question.answer;
  }

  _handleClick = (answer) => {
    let newAnswer = Number(answer);

    if (answer === this.props.question.answer) {
      newAnswer = null;
    }

    this.props.setQuestion(this.props.question.id, newAnswer);
  };

  render = () => {
    const { answer, answers } = this.props.question;

    const idYes = Number(Object.keys(answers)[0]);
    const idNo = Number(Object.keys(answers)[1]);

    return (
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
  };
}
