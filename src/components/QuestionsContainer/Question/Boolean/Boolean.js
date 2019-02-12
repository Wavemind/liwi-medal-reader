// @flow

import * as React from 'react';
import { Button, H2, Icon, Text, View, Grid, Col } from 'native-base';
import type { NavigationScreenProps } from 'react-navigation';
import type { SessionsProviderState } from 'engine/contexts/Sessions.context';
import { getSession } from 'engine/api/LocalStorage';
import { QuestionView, RightView } from '../../../../template/layout';
import { liwiColors } from '../../../../utils/constants';

type Props = NavigationScreenProps & {};

type State = {};

export default class Boolean extends React.PureComponent<Props, State> {
  state = {
    answer: null,
  };

  _handleNo = () => {
    let newAnswer;
    switch (this.state.answer) {
      case true:
        newAnswer = false;
        break;
      case false:
        newAnswer = null;
        break;
      case null:
        newAnswer = false;
        break;
    }

    this.setState({ answer: newAnswer });
  };

  _handleYes = () => {
    let newAnswer;
    switch (this.state.answer) {
      case true:
        newAnswer = null;
        break;
      case false:
        newAnswer = true;
        break;
      case null:
        newAnswer = true;
        break;
    }
    this.setState({ answer: newAnswer });
  };

  render() {
    const { question, styles } = this.props;
    const { answer } = this.state;

    return (
      <Grid>
        <Col>
          <Button
            square
            onPress={this._handleYes}
            style={
              answer === true
                ? { backgroundColor: '#c0c0c0' }
                : { backgroundColor: liwiColors.whiteColor }
            }
          >
            <Icon
              style={
                answer
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
            onPress={this._handleNo}
            style={
              answer === false
                ? { backgroundColor: '#c0c0c0' }
                : { backgroundColor: liwiColors.whiteColor }
            }
          >
            <Icon
              style={
                answer === false
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
  }
}
