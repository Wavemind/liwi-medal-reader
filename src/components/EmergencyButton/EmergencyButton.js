import React, { Component } from 'react';
import { Fab, Icon, View } from 'native-base';
import { DocumentDirectoryPath, readFile } from 'react-native-fs';

import { styles } from './EmergencyButton.style';
import { modalType } from '../../../frontend_service/constants';

export default class EmergencyButton extends Component {
  state = {
    active: false,
  };

  /**
   * Fetch content from external storage
   * @returns {Promise<string>}
   */
  getEmergencyContent = async () => {
    const targetPath = `${DocumentDirectoryPath}/emergency_content.html`;
    return readFile(targetPath);
  };

  /**
   * Open redux modal
   */
  openModal = async () => {
    const { updateModalFromRedux } = this.props;

    const emergencyContent = await this.getEmergencyContent();

    updateModalFromRedux({ emergencyContent }, modalType.emergency);
  };

  render() {
    const {
      app: { algorithm },
    } = this.props;

    const { active } = this.state;

    return algorithm ? (
      <View>
        <Fab active={active} direction="up" style={styles.button} position="bottomLeft" onPress={() => this.openModal()}>
          <Icon name="warning" type="FontAwesome" style={styles.icon} />
        </Fab>
      </View>
    ) : null;
  }
}
