// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Body, Button, Icon, Left, List, ListItem, Right, Switch, Picker, Text } from 'native-base';
import { ScrollView } from 'react-native';
import { getItem, setItem } from '../../engine/api/LocalStorage';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-community/async-storage';

type Props = NavigationScreenProps & {};

type State = {};

export default class Settings extends React.Component<Props, State> {
  // default settings
  state = {
    environment: null,
    settings: {
      tests: {
        mRDT: false,
        'other malaria test': false,
        Hb: false,
        CRP: false,
        'Blood sugar': false,
        'trail of bronchodilator ': false,
        PCT: false,
        'skin lesion description and picture': false,
      },
      devices: {
        'Anesthesia Machines': false,
        Defibrillators: false,
        Sterilizers: false,
        'EKG/ECG Machines': false,
        'Blanket and Fluid Warmers': false,
        'Electrosurgical Units': false,
        'Surgical Lights': false,
      },
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

  render() {
    const { settings, environment } = this.state;
    const {
      navigation,
      app: { t },
    } = this.props;

    return (
      <ScrollView>
        <List testID="settings_view">
          <ListItem itemDivider>
            <Text white bold>
              {t('tests')}
            </Text>
          </ListItem>
          {Object.keys(settings.tests).map((test) => (
            <ListItem key={test}>
              <Left>
                <Text>{test}</Text>
              </Left>
              <Right>
                <Switch value={settings.tests[test]} onValueChange={() => this.changeSettings('tests', test)} />
              </Right>
            </ListItem>
          ))}
          <ListItem itemDivider>
            <Text white bold>
              {t('devices')}
            </Text>
          </ListItem>
          {Object.keys(settings.devices).map((device) => (
            <ListItem key={device}>
              <Left>
                <Text>{device}</Text>
              </Left>
              <Right>
                <Switch value={settings.devices[device]} onValueChange={() => this.changeSettings('devices', device)} />
              </Right>
            </ListItem>
          ))}
          <ListItem itemDivider>
            <Text white bold>
              {t('app')}
            </Text>
          </ListItem>
          <ListItem>
            <Left>
              <Text>{t('awake')}</Text>
            </Left>
            <Body>
              <Button iconLeft iconMenu>
                <Icon grey type="FontAwesome" name={settings.app.awake ? 'eye' : 'eye-slash'} />
              </Button>
            </Body>
            <Right>
              <Switch value={settings.app.awake} onValueChange={() => this.changeSettings('app', 'awake')} />
            </Right>
          </ListItem>
          <ListItem>
            <Left>
              <Text>Environment</Text>
            </Left>
            <Right>
              <Picker
                mode="dropdown"
                style={{ width: 220 }}
                selectedValue={environment === null ? 'test' : environment}
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
            <Text>Autre</Text>
          </ListItem>
        </List>
        <Button onPress={() => navigation.goBack()}>
          <Text>{t('common:back')}</Text>
        </Button>
      </ScrollView>
    );
  }
}
