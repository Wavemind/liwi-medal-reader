import React, { Component } from 'react';
import { Fab, Icon, View } from 'native-base';
import { styles } from './EmergencyButton.style';
import { modalType } from '../../../frontend_service/constants';

export default class EmergencyButton extends Component {
  state = {
    active: false,
  };

  /**
   * Open redux modal
   */
  openModal = () => {
    const { updateModalFromRedux } = this.props;
    updateModalFromRedux({}, modalType.emergency);
  };

  render() {
    const { active } = this.state;
    return (
      <View>
        <Fab active={active} direction="up" style={styles.button} position="bottomLeft" onPress={this.openModal}>
          <Icon name="warning" type="FontAwesome" style={styles.icon} />
        </Fab>
      </View>
    );
  }
}
