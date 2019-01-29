import React, { Component } from 'react';
import { AppState, Image, View } from 'react-native';
import { Button, Container, Icon, Text } from 'native-base';
import { styles } from './Drawer.style';
import { withSessions } from 'engine/contexts/Sessions.context';
import { SeparatorLine } from '../../../template/layout';

export default class Drawer extends Component {
  state = {
    appState: AppState.currentState,
  };

  componentDidMount() {
    const { app } = this.props;
    AppState.addEventListener('change', this._handleAppStateChange);
    // delay(() => app.lockSession(), 30000);
  }

  // If the app is active or not
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
      app: { user },
    } = this.props;
    await this.props.sessions.deconnexion(user.id);
    await this.props.app.lockSession();
  };

  render() {
    const {
      navigation,
      app: { user },
      medicalCase,
    } = this.props;

    return (
      <Container>
        <View style={styles.header}>
          <Text>
            {user.data.first_name} {user.data.last_name}
          </Text>
          <Text light>{user.email}</Text>
        </View>
        <View>
          {medicalCase.patient !== undefined ? (
            <Button
              transparent
              iconLeft
              btnDrawer
              onPress={() =>
                navigation.navigate('MedicalCase', {
                  title: `${medicalCase.patient.firstname} ${
                    medicalCase.patient.lastname
                  }`,
                })
              }
            >
              <Icon dark type={'FontAwesome5'} name="briefcase-medical" />
              <Text dark>
                {medicalCase.patient.firstname} - {medicalCase.patient.lastname}
              </Text>
            </Button>
          ) : null}
          <Button
            transparent
            iconLeft
            btnDrawer
            onPress={() => navigation.navigate('MedicalCases')}
          >
            <Icon dark type={'FontAwesome5'} name="boxes" />
            <Text dark>MedicalCases</Text>
          </Button>
          <Button
            transparent
            iconLeft
            btnDrawer
            onPress={() => navigation.navigate('Algorithmes')}
          >
            <Icon dark type={'Entypo'} name="flow-tree" />
            <Text dark>Algorithmes</Text>
          </Button>
          <SeparatorLine />
          <Button
            transparent
            iconLeft
            btnDrawer
            onPress={() => this.props.app.lockSession()}
          >
            <Icon dark type={'FontAwesome5'} name="exchange-alt" />
            <Text dark>Changer de session</Text>
          </Button>
          <Button
            transparent
            iconLeft
            btnDrawer
            onPress={() => navigation.navigate('Settings')}
          >
            <Icon dark type={'AntDesign'} name="setting" />
            <Text dark>Paramètres</Text>
          </Button>
          <Button transparent iconLeft btnDrawer onPress={this.logout}>
            <Icon dark type={'AntDesign'} name="logout" />
            <Text dark>Se déconnecter</Text>
          </Button>
        </View>
      </Container>
    );
  }
}
