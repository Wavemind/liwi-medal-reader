// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Icon, View } from 'native-base';
import { styles } from './StatusIndicator.style';
import { liwiColors } from '../../utils/constants';

type Props = NavigationScreenProps & {};

type State = {};

export default class StatusIndicator extends React.Component<Props, State> {
  state = {};

  shouldComponentUpdate(nextProps: Props): boolean {
    const { isConnected } = this.props.app;
    return isConnected !== nextProps.app.isConnected;
  }

  render() {
    const {
      app: { t, isConnected },
    } = this.props;

    return (
      <View style={styles.container}>
        <View style={{ ...styles.viewIcon, backgroundColor: isConnected ? liwiColors.greenColor : liwiColors.redColor }}>
          <Icon name={isConnected ? 'wifi' : 'wifi-off'} type={'Feather'} style={styles.icon} />
        </View>
      </View>
    );
  }
}
