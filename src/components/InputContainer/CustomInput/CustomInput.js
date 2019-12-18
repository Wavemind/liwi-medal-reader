// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View } from 'react-native';
import { Form, Icon, Input, Text } from 'native-base';
import { styles } from './CustomInput.style';
import { ViewBlocColor } from '../../../template/layout';

type Props = NavigationScreenProps & { autoCapitalize: string};
type State = {};

export default class CustomInput extends React.Component<Props, State> {
  state = { value: '' };

  static defaultProps = {
    iconName: false,
    iconType: false,
    keyboardType: 'default',
    secureTextEntry: false,
    condensed: false,
    autoCapitalize: 'none',
  };

  componentWillMount(): void {
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
    change(index, value.nativeEvent.text);
    this.setState({ value: value.nativeEvent.text });
  };
  render() {
    const { label, change, index, iconName, iconType, keyboardType, placeholder, secureTextEntry, error, condensed, autoCapitalize } = this.props;

    const { value } = this.state;

    return (
      <Form style={condensed ? null : styles.form}>
        <View style={styles.view}>
          {iconName && iconType ? <Icon name={iconName} type={iconType} style={styles.icon} /> : null}
          <Text style={iconName && iconType ? styles.textWithoutIcon : styles.textWithIcon}>{label}</Text>
          <Text error>{error}</Text>
        </View>
        <ViewBlocColor>
          <Input
            autoCapitalize={autoCapitalize}
            common
            keyboardType={keyboardType}
            value={value}
            onChange={this._handleChangeValue}
            onEndEditing={(value) => change(index, value.nativeEvent.text)}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
          />
        </ViewBlocColor>
      </Form>
    );
  }
}
