import React, { Component } from 'react';
import { styles } from './Drawer.style';
import { LiwiTitle2, SeparatorLine } from '../../../template/layout';

import { AppState, View } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import i18n from '../../../utils/i18n';

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
      <View style={styles.columns}>
        <View style={styles.tools}>
          <View style={styles.top}>
            <Button
              transparent
              btnDrawer
              marginIcon
            >
              <Icon
                style={styles.icon}
                dark
                type={'AntDesign'}
                name="user"
              />
            </Button>

            <Button
              transparent
              btnDrawer
              marginIcon
              onPress={() => navigation.navigate('Settings')}
            >
              <Icon
                style={styles.icon}
                dark
                type={'AntDesign'}
                name="setting"
              />
            </Button>

            <Button
              transparent
              btnDrawer
              marginIcon
            >
              <Icon
                style={styles.icon}
                dark
                type={'AntDesign'}
                name="sync"
              />
            </Button>

          </View>
          <View style={styles.bottom}>
            <Button transparent btnDrawer onPress={this.logout}>
              <Icon style={styles.icon} dark type={'AntDesign'} name="logout"/>
            </Button>
          </View>
        </View>

        <View style={styles.medical}>

          <View style={styles.triage}>
            <Text style={styles.title}>triage</Text>
            <Button
              transparent
              btnDrawer
              onPress={() => navigation.navigate('MedicalCases')}
            >
              <Text dark>MedicalCases</Text>
            </Button>
            <Button
              transparent
              btnDrawer
              onPress={() => navigation.navigate('Algorithms')}
            >
              <Text dark>Algorithmes</Text>
            </Button>
          </View>

          <View style={styles.consultation}>
            <Text style={styles.title}>consultation</Text>
            <Button
              transparent
              btnDrawer
              onPress={() => navigation.navigate('MedicalCases')}
            >
              <Text dark>MedicalCases</Text>
            </Button>
            <Button
              transparent
              btnDrawer
              onPress={() => navigation.navigate('Algorithms')}
            >
              <Text dark>Algorithmes</Text>
            </Button>
          </View>

          <View style={styles.tests}>
            <Text style={styles.title}>tests</Text>
            <Button
              transparent
              btnDrawer
              onPress={() => navigation.navigate('MedicalCases')}
            >
              <Text dark>MedicalCases</Text>
            </Button>
            <Button
              transparent
              btnDrawer
              onPress={() => navigation.navigate('Algorithms')}
            >
              <Text dark>Algorithmes</Text>
            </Button>
          </View>

          <View style={styles.strategy}>
            <Text style={styles.title}>diagnoses and strategy</Text>
            <Button
              transparent
              btnDrawer
              onPress={() => navigation.navigate('MedicalCases')}
            >
              <Text dark>MedicalCases</Text>
            </Button>
            <Button
              transparent
              btnDrawer
              onPress={() => navigation.navigate('Algorithms')}
            >
              <Text dark>Algorithmes</Text>
            </Button>
          </View>

          <View style={styles.patient}>
            <Button
              transparent
              btnDrawer
              onPress={() => navigation.navigate('MedicalCases')}
            >
              <Text dark>MedicalCases</Text>
            </Button>
            <Button
              transparent
              btnDrawer
              onPress={() => navigation.navigate('Algorithms')}
            >
              <Text dark>Algorithmes</Text>
            </Button>
          </View>

        </View>
      </View>
    );
  }
}
