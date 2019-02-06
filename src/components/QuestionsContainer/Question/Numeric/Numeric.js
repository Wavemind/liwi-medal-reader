// @flow

import * as React from 'react';
import { H2, Text, View, Button, Icon, Input, Item, Label } from 'native-base';
import type { NavigationScreenProps } from 'react-navigation';
import type { SessionsProviderState } from 'engine/contexts/Sessions.context';
import { getSession } from 'engine/api/LocalStorage';
import { QuestionView, RightView } from '../../../../template/layout';
import { liwiColors } from '../../../../utils/constants';
import LwInput from '../../../formContainer/lwInput/LwInput';

type Props = NavigationScreenProps & {};

type State = {};

export default class Numeric extends React.Component<Props, State> {
  state = { style: {} };

  _focus = () =>
    this.setState({
      style: { borderColor: liwiColors.greenColor },
    });

  _onEndEditing = () => this.setState({ style: {} });

  render() {
    const { question, styles } = this.props;
    const { style } = this.state;

    return (
      <View style={{ flex: 1, width: '100%' }}>
        <Item>
          <Input
            question
            onFocus={this._focus}
            style={style}
            onEndEditing={this._onEndEditing}
          />
        </Item>
      </View>
    );
  }
}
