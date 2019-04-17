import React, { Component } from 'react';
import { styles } from './Drawer.style';
import { SeparatorLine, LiwiTitle2 } from '../../../template/layout';

import { AppState, View } from 'react-native';
import { Button, Container, Icon, Text } from 'native-base';

export default class Drawer extends Component {
  state = {
    isConnected: false,
    appState: AppState.currentState,
  };

  logout = async () => {
    const {
      app: { user },
    } = this.props;
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
        <View style={styles.flex}>
          <View style={styles.flex}>
            <Button
              transparent
              iconLeft
              btnDrawer
              onPress={() => navigation.navigate('MedicalCases')}
            >
              <Icon
                style={styles.icon}
                dark
                type={'FontAwesome5'}
                name="boxes"
              />
              <Text dark>MedicalCases</Text>
            </Button>
            <Button
              transparent
              iconLeft
              btnDrawer
              onPress={() => navigation.navigate('Algorithms')}
            >
              <Icon style={styles.icon} dark type={'Entypo'} name="flow-tree" />
              <Text dark>Algorithmes</Text>
            </Button>
            <SeparatorLine />
            {medicalCase.id !== undefined ? (
              <React.Fragment>
                <LiwiTitle2 noBorder>
                  {medicalCase.patient.firstname}
                  {medicalCase.patient.lastname}
                </LiwiTitle2>
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
                  <Icon
                    style={styles.icon}
                    dark
                    type={'FontAwesome5'}
                    name="briefcase-medical"
                  />
                  <Text dark>Données patient</Text>
                </Button>
                <Button
                  transparent
                  iconLeft
                  btnDrawer
                  onPress={() =>
                    navigation.navigate('WorkCase', {
                      title: `${medicalCase.patient.firstname} ${
                        medicalCase.patient.lastname
                      }`,
                    })
                  }
                >
                  <Icon
                    style={styles.icon}
                    dark
                    type={'FontAwesome'}
                    name="stethoscope"
                  />
                  <Text dark> Consultation</Text>
                </Button>
              </React.Fragment>
            ) : null}
          </View>
          <View style={styles.end}>
            <Button
              transparent
              iconLeft
              btnDrawer
              onPress={() => navigation.navigate('Settings')}
            >
              <Icon
                style={styles.icon}
                dark
                type={'AntDesign'}
                name="setting"
              />
              <Text dark>Paramètres</Text>
            </Button>
            <Button transparent iconLeft btnDrawer onPress={this.logout}>
              <Icon style={styles.icon} dark type={'AntDesign'} name="logout" />
              <Text dark>Se déconnecter</Text>
            </Button>
          </View>
        </View>
      </Container>
    );
  }
}
