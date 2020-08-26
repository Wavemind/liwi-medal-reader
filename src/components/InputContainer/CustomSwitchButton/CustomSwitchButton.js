// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View } from 'react-native';
import { Button, Icon, Text } from 'native-base';
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

  componentDidMount(): void {
    const { init } = this.props;
    this.setState({ value: init });
  }

  shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>): boolean {
    const { init, error } = this.props;
    const { value } = this.state;

    return value !== nextState.value || init !== nextProps.init || error !== nextProps.error;
  }

  _handleChangeValue = (value) => {
    const { change, index } = this.props;
    this.setState({ value });
    change(index, value);
  };

  render() {
    const { label, iconName, label1, label2, value1, value2, iconType, error } = this.props;

    const { value } = this.state;

    return (
      <View style={styles.form}>
        <View style={styles.view}>
          {iconName && iconType ? <Icon name={iconName} type={iconType} style={styles.icon} /> : null}
          <Text style={iconName && iconType ? styles.textWithoutIcon : styles.textWithIcon}>{label}</Text>
          <Text error>{error}</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <Button light style={[value === value1 ? styles.active : null, styles.buttonSplit]} onPress={() => this._handleChangeValue(value1)}>
            <Text style={value === value1 ? styles.activeText : null}>{label1}</Text>
          </Button>
          <Button light style={[value === value2 ? styles.active : null, styles.buttonSplit]} onPress={() => this._handleChangeValue(value2)}>
            <Text style={value === value2 ? styles.activeText : null}>{label2}</Text>
          </Button>
        </View>
      </View>
    );
  }
}
