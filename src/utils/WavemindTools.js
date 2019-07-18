import React, { Component } from 'react';
import { Button, Fab, Icon, View } from 'native-base';
import { clearLocalStorage, clearPatients } from '../engine/api/LocalStorage';
import NavigationService from '../engine/navigation/Navigation.service';

export default class WavemindTools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
  }

  render() {
    const {active} = this.state;
    return (
      <View>
        <Fab
          active={active}
          direction="up"
          containerStyle={{}}
          style={{ backgroundColor: '#5067FF' }}
          position="bottomRight"
          onPress={() => this.setState({ active: !active })}
        >
          <Icon name="developer-mode" type='MaterialIcons' />
          <Button
            blue
            onPress={async () => {
              await clearPatients();
              NavigationService.navigate('SignIn');
              this.forceUpdate();
            }}
          >
            <Icon type='AntDesign' name="deleteusergroup" />
          </Button>
          <Button
            blue
            onPress={async () => {
              await clearLocalStorage();
              NavigationService.navigate('SignIn');
              this.forceUpdate();
            }}
          >
            <Icon type='MaterialCommunityIcons' name="delete-forever" />
          </Button>
        </Fab>
      </View>
    );
  }
}
