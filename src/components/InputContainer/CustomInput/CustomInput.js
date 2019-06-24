// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View } from 'react-native';
import { Form, Icon, Input, Text } from 'native-base';
import { styles } from './CustomInput.style';
import { ViewBlocColor } from '../../../template/layout';

type Props = NavigationScreenProps & {};
type State = {};

export default class CustomInput extends React.Component<Props, State> {
  state = { value: '' };

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
      this.state.value !== nextState.value ||
      this.props.init !== nextProps.init ||
      this.props.error !== nextProps.error
    );
  }

  componentWillMount(): void {
    this.setState({ value: this.props.init });
  }

  _handleChangeValue = (value) =>
    this.setState({ value: value.nativeEvent.text });

  render() {
    const {
      label,
      change,
      index,
      iconName,
      iconType,
      keyboardType,
      error,
    } = this.props;

    const { value } = this.state;

    return (
      <Form style={styles.form}>
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
          <Text error>{error}</Text>
        </View>
        <ViewBlocColor>
          <Input
            common
            keyboardType={keyboardType}
            value={value}
            onChange={this._handleChangeValue}
            onEndEditing={(value) => change(index, value.nativeEvent.text)}
          />
        </ViewBlocColor>
      </Form>
    );
  }
}
