import React, { Component } from 'react';
import { Fab, Icon, View } from 'native-base';
import NavigationService from '../../engine/navigation/Navigation.service';
import { styles } from './EmergencyButton.style';

export default class EmergencyButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
  }

  render() {
    const { active } = this.state;

    return (
      <View>
        <Fab
          active={active}
          direction="up"
          style={styles.button}
          containerStyle={__DEV__ ? styles.container : {}}
          position="bottomRight"
          onPress={() => {
            NavigationService.navigate('Emergency');
          }}
        >
          <Icon name="warning" type="FontAwesome" style={styles.icon} />
        </Fab>
      </View>
    );
  }
}
