// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View } from 'react-native';
import { Form, Icon, Input, Text, Button } from 'native-base';
import { styles } from './CustomSwitchButton.style';
import { ViewBlocColor } from '../../../template/layout';

type Props = NavigationScreenProps & {};
type State = {};

export default class CustomSwitchButton extends React.Component<Props, State> {
  state = { value: null };

  static defaultProps = {
    iconName: false,
    iconType: false,
    keyboardType: 'default',
  };

  shouldComponentUpdate(
    nextProps: Readonly<P>,
    nextState: Readonly<S>
  ): boolean {
    return (
      this.state.value !== nextState.value || this.props.init !== nextProps.init
    );
  }

  componentWillMount(): void {
    this.setState({ value: this.props.init });
  }

  _handleChangeValue = (value) =>
    this.setState({ value: value});

  render() {
    const {
      label,
      change,
      index,
      iconName,
      label1,
      label2,
      iconType,
      keyboardType,
    } = this.props;

    const { value } = this.state;

    return (
      <View style={styles.form} flex-container-row>
        <View style={styles.view}>
          {iconName && iconType ? (
            <Icon name={iconName} type={iconType} style={styles.icon} />
          ) : null}
          <Text
            style={
              iconName && iconType
                ? styles.textWithoutIcon
                : styles.textWithIcon
            }
          >
            {label}
          </Text>
        </View>
        <View w50>
          <Button w50 onPress={() => this._handleChangeValue(1)}>
            <Text>{label1}</Text>
          </Button>
          <Button w50 onPress={() => this._handleChangeValue(2)}>
            <Text>{label2}</Text>
          </Button>
        </View>
      </View>
    );
  }
}
