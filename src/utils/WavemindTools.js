import React, { Component } from 'react';
import {
  Container,
  Header,
  View,
  Button,
  Icon,
  Fab,
  Text,
  Content,
} from 'native-base';
import { clearLocalStorage } from '../engine/api/LocalStorage';
import NavigationService from '../engine/navigation/Navigation.service';

export default class WavemindTools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
  }

  render() {
    return (
      <View>
        <Fab
          active={this.state.active}
          direction="up"
          containerStyle={{}}
          style={{ backgroundColor: '#5067FF' }}
          position="bottomRight"
          onPress={() => this.setState({ active: !this.state.active })}
        >
          <Icon name="developer-mode" type={'MaterialIcons'} />
          <Button
            blue
            onPress={async () => {
              await clearLocalStorage();
              NavigationService.navigate('SignIn');
              this.forceUpdate();
            }}
          >
            <Icon type={'MaterialCommunityIcons'} name="delete-forever" />
          </Button>
        </Fab>
      </View>
    );
  }
}
