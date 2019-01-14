import React, { Component } from 'react';
import { Image, View, AppState } from 'react-native';
import { H2, Container, Text, Button } from 'native-base';
import { withApplication } from '../../contexts/Application.context';
import { styles } from './Drawer.style';
import { withSessions } from 'engine/contexts/Sessions.context';

class Drawer extends Component {
  state = {
    appState: AppState.currentState,
  };

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // console.log('App has come to the foreground!');
    }
    this.setState({ appState: nextAppState });
  };

  logout = async () => {
    const {
      navigation,
      app: { user },
    } = this.props;
    this.props.sessions.deconnexion(user.id);
    this.props.app.lockSession();
  };

  render() {
    const {
      navigation,
      app: { user },
    } = this.props;

    return (
      <Container>
        <View style={styles.header}>
          <Text>
            {user.first_name} {user.last_name}
          </Text>
          <Text light>{user.email}</Text>
        </View>
        <View style={styles.content}>
          <H2>Futur lien 1</H2>
          <H2>Title 2</H2>
          <Button onPress={() => this.props.app.lockSession()}>
            <Text>Changer de session</Text>
          </Button>

          <Button onPress={this.logout}>
            <Text>Se déconnecter</Text>
          </Button>
        </View>
      </Container>
    );
  }
}

export default withApplication(withSessions(Drawer));
