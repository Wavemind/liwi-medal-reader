// @flow

import * as React from 'react';
import { Body, Button, Icon, Left, List, ListItem, Right, Switch, Picker, Text } from 'native-base';
import { ScrollView, View } from 'react-native';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-community/async-storage';
import { COMMIT } from '@env';

import { getItem, setItem } from '../../engine/api/LocalStorage';
import { patientTemplate } from '../../utils/template/PatientTemplate';
import Database from '../../engine/api/Database';
import { displayNotification } from '../../utils/CustomToast';
import { liwiColors } from '../../utils/constants';
import { styles } from './settings.style';

export default class Settings extends React.Component {
  // default settings
  state = {
    disabled: false,
    environment: null,
    settings: {
      app: {
        awake: false,
      },
    },
  };

  async componentDidMount() {
    const { settings } = this.state;
    const localStorageSettings = await getItem('settings');
    const environment = await getItem('environment');
    this.setState({
      environment,
      settings: {
        ...settings,
        ...localStorageSettings,
      },
    });
  }

  changeSettings = (setting, item) => {
    const { settings } = this.state;

    settings[setting][item] = !settings[setting][item];

    this.setState(
      {
        settings,
      },
      async () => {
        await setItem('settings', settings);
      }
    );
  };

  /**
   * Generates Patients with a single Medical Case
   * @returns {Promise<void>}
   */
  handleGeneratePatients = async () => {
    this.setState({ disabled: true });
    const entryAmount = 250;
    const database = await new Database();
    let i = 0;
    for (i = 0; i < entryAmount; i++) {
      const patient = await patientTemplate();
      await database.insert('Patient', patient);
      if (i % 25 === 0) {
        displayNotification(`Created ${i} of ${entryAmount} entries`, liwiColors.greenColor);
      }
    }
    displayNotification(`Successfully created ${entryAmount} entries`, liwiColors.greenColor);
    this.setState({ disabled: false });
  };

  render() {
    const { environment, disabled } = this.state;
    const {
      navigation,
      app: { t },
    } = this.props;

    return (
      <ScrollView>
        <List testID="settings_view">
          <ListItem itemDivider>
            <Text white bold>
              {t('app')}
            </Text>
          </ListItem>
          <ListItem>
            <Left>
              <Text>{t('settings:environment')}</Text>
            </Left>
            <Right>
              <Picker
                mode="dropdown"
                style={{ width: 220 }}
                selectedValue={environment}
                onValueChange={async (value) => {
                  await setItem('environment', value);
                  await AsyncStorage.removeItem('session');
                  await AsyncStorage.removeItem('user');
                  navigation.navigate('NewSession');
                  await RNRestart.Restart();
                }}
              >
                <Picker.Item label="Production" value="production" />
                <Picker.Item label="Test" value="test" />
                <Picker.Item label="Staging" value="staging" />
              </Picker>
            </Right>
          </ListItem>
          <ListItem>
            <Left>
              <Text>{t('settings:version')}</Text>
            </Left>
            <Right>
              <Text>{COMMIT}</Text>
            </Right>
          </ListItem>
        </List>
        <View style={styles.buttons}>
          <Button onPress={() => navigation.goBack()}>
            <Text>{t('common:back')}</Text>
          </Button>
          <Button onPress={() => this.handleGeneratePatients()} disabled={disabled}>
            <Text>{t('settings:generate_cases')}</Text>
          </Button>
        </View>
      </ScrollView>
    );
  }
}
