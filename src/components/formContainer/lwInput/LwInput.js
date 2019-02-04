// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View } from 'react-native';
import { Form, Input, Item, Label, Icon, Button, Text } from 'native-base';
import { styles } from './LwInput.style';
import { ViewBlocColor } from '../../../template/layout';
type Props = NavigationScreenProps & {};

type State = {};

export default class LwInput extends React.Component<Props, State> {
  state = { value: '' };

  defaultProps = { iconName: false, iconType: false, keyboardType: 'default' };

  shouldComponentUpdate(
    nextProps: Readonly<P>,
    nextState: Readonly<S>,
    nextContext: any
  ): boolean {
    return (
      this.state.value !== nextState.value || this.props.init !== nextProps.init
    );
  }

  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
    if (nextProps.id !== this.props.id) {
      this.setState({ value: nextProps.init });
    }
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
      init,
      iconName,
      iconType,
      keyboardType,
    } = this.props;

    const { value } = this.state;

    return (
      <Form style={{ padding: 20 }}>
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
