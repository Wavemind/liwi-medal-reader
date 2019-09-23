import React, { Component } from 'react';
import { Fab, Icon, View } from 'native-base';
import NavigationService from '../../engine/navigation/Navigation.service';
import { styles } from './Urgence.style';

export default class UrgenceButton extends Component {
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
          containerStyle={{}}
          style={styles.button}
          position="bottomLeft"
          onPress={() => {
            NavigationService.navigate('Urgence');
          }}
        >
          <Icon name="warning" type="FontAwesome" style={styles.icon} />
        </Fab>
      </View>
    );
  }
}
