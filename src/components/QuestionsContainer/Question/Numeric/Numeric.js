// @flow

import * as React from 'react';
import { H2, Text, View } from 'native-base';
import type { NavigationScreenProps } from 'react-navigation';
import type { SessionsProviderState } from 'engine/contexts/Sessions.context';
import { getSession } from 'engine/api/LocalStorage';
import { QuestionView, RightView } from '../../../../template/layout';
import { liwiColors } from '../../../../utils/constants';

type Props = NavigationScreenProps & {};

type State = {};

export default class Numeric extends React.Component<Props, State> {
  state = {};

  render() {
    const { question, styles } = this.props;

    return (
      <QuestionView elevation={5} style={styles}>
        <H2>{question.label}</H2>
        <Text>{question.id}</Text>
        <RightView>
          <Text style={{ color: liwiColors.redColor }}>
            {question.category}
          </Text>
        </RightView>
      </QuestionView>
    );
  }
}
