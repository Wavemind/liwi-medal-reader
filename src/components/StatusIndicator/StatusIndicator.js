// @flow

import * as React from 'react';
import { Icon, View } from 'native-base';

import { styles } from './StatusIndicator.style';
import { liwiColors } from '../../utils/constants';

export default class StatusIndicator extends React.Component {
  render() {
    const {
      app: { isConnected },
    } = this.props;

    return (
      <View style={styles.container}>
        <View style={{ ...styles.viewIcon, backgroundColor: isConnected ? liwiColors.greenColor : liwiColors.redColor }}>
          <Icon name={isConnected ? 'wifi' : 'wifi-off'} type="Feather" style={styles.icon} />
        </View>
      </View>
    );
  }
}
