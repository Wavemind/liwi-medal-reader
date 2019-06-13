// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View } from 'react-native';
import { Icon, Text, Button } from 'native-base';
import { styles } from './CustomSwitchButton.style';

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
      iconName,
      label1,
      label2,
      value1,
      value2,
      iconType,
    } = this.props;

    const { value } = this.state;

    return (
      <View style={styles.form}>
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
        <View style={styles.buttonWrapper}>
          <Button light style={[(value === value1 ? styles.active : null), styles.buttonSplit]} onPress={() => this._handleChangeValue(value1)}>
            <Text style={value === value1 ? styles.activeText : null}>{label1}</Text>
          </Button>
          <Button light style={[(value === value2 ? styles.active : null), styles.buttonSplit]} onPress={() => this._handleChangeValue(value2)}>
            <Text style={value === value2 ? styles.activeText : null}>{label2}</Text>
          </Button>
        </View>
      </View>
    );
  }
}
