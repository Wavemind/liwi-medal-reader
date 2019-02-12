// @flow

import * as React from 'react';
import { Input, Item, View } from 'native-base';
import type { NavigationScreenProps } from 'react-navigation';
import type { SessionsProviderState } from 'engine/contexts/Sessions.context';
import { getSession } from 'engine/api/LocalStorage';
import { liwiColors } from '../../../../utils/constants';

type Props = NavigationScreenProps & {};

type State = {};

export default class Numeric extends React.PureComponent<Props, State> {
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
