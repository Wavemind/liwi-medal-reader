// @flow

import * as React from 'react';
import type { NavigationScreenProps } from 'react-navigation';
import { Text, View } from 'native-base';
import { LeftButton, RightButton } from '../../../../template/layout';

type Props = NavigationScreenProps & {};
type State = {};

export default class Boolean extends React.Component<Props, State> {
  shouldComponentUpdate(nextProps: Readonly<P>): boolean {
    const { question }= this.props;
    return nextProps.question.answer !== question.answer;
  }

  _handleClick = (answer) => {
    const { question, setQuestion }= this.props;
    let newAnswer = Number(answer);

    if (answer === question.answer) {
      newAnswer = null;
    }

    setQuestion(question.id, newAnswer);
  };

  render = () => {
    const { question }= this.props;
    const { answer, answers } = question;

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
