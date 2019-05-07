// @flow

import * as React from 'react';
import type { NavigationScreenProps } from 'react-navigation';
import { liwiColors } from '../../../../utils/constants';
import { Button, Col, Grid, Icon } from 'native-base';

type Props = NavigationScreenProps & {};
type State = {};

export default class Boolean extends React.Component<Props, State> {
  shouldComponentUpdate(nextProps: Readonly<P>): boolean {
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
      <Grid>
        <Col>
          <Button
            square
            onPress={() => this._handleClick(idYes)}
            style={
              answer === idYes
                ? { backgroundColor: '#c0c0c0' }
                : { backgroundColor: liwiColors.whiteColor }
            }
          >
            <Icon
              style={
                answer === idYes
                  ? { color: liwiColors.greenColor }
                  : { color: liwiColors.blackColor }
              }
              name={'check'}
              type={'MaterialCommunityIcons'}
            />
          </Button>
        </Col>
        <Col>
          <Button
            square
            onPress={() => this._handleClick(idNo)}
            style={
              answer === idNo
                ? { backgroundColor: '#c0c0c0' }
                : { backgroundColor: liwiColors.whiteColor }
            }
          >
            <Icon
              style={
                answer === idNo
                  ? { color: liwiColors.redColor }
                  : { color: liwiColors.blackColor }
              }
              name={'cross'}
              type={'Entypo'}
            />
          </Button>
        </Col>
      </Grid>
    );
  };
}
