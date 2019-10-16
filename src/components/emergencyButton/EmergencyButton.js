import React, { Component } from 'react';
import { Fab, Icon, View } from 'native-base';
import NavigationService from '../../engine/navigation/Navigation.service';
import { styles } from './EmergencyButton.style';

export default class EmergencyButton extends Component {
  state = {
    active: false,
  };

  render() {
    const { active } = this.state;

    return (
      <View>
        <Fab
          active={active}
          direction="up"
          style={styles.button}
          containerStyle={__DEV__ ? styles.container : {}}
          position="bottomLeft"
          onPress={() => {
            const {
              // eslint-disable-next-line react/prop-types
              app: { logged },
            } = this.props;

            let navigationGoBack;
            // IF logged go to back
            if (logged) {
              navigationGoBack = 'Home';
            } else {
              // Else go to Unlock
              navigationGoBack = 'UnlockSession';
            }

            NavigationService.navigate('Emergency', {
              navigationGoBack: navigationGoBack,
            });
          }}
        >
          <Icon name="warning" type="FontAwesome" style={styles.icon} />
        </Fab>
      </View>
    );
  }
}
