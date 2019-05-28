// @flow

import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import {
  Text,
  List,
  ListItem,
  Left,
  Body,
  Button,
  Switch,
  Right,
  Icon,
} from 'native-base';
import { ScrollView } from 'react-native';
import { getItem, setItem } from '../../engine/api/LocalStorage';

type Props = NavigationScreenProps & {};

type State = {};

export default class Settings extends React.Component<Props, State> {

  // default settings
  state = {
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

  async componentWillMount() {
    let settings = await getItem('settings');
    if (settings !== null) {
      this.setState({
        settings: {
          ...this.state.settings,
          ...settings,
        },
      });
    }
  }

  changeSettings = (setting, item) => {
    let boolean = this.state.settings[setting][item];

    this.setState(
      {
        settings: {
          ...this.state.settings,
          [setting]: {
            ...this.state.settings[setting],
            [item]: !boolean,
          },
        },
      },
      async () => {
        await setItem('settings', this.state.settings);
      }
    );
  };

  render() {
    const { settings } = this.state;
    const { t } = this.props;

    return (
      <ScrollView>
        <List>
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
                <Switch
                  value={settings.tests[test]}
                  onValueChange={() => this.changeSettings('tests', test)}
                />
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
                <Switch
                  value={settings.devices[device]}
                  onValueChange={() => this.changeSettings('devices', device)}
                />
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
                <Icon
                  grey
                  type={'FontAwesome'}
                  name={settings.app.awake ? 'eye' : 'eye-slash'}
                />
              </Button>
            </Body>
            <Right>
              <Switch
                value={settings.app.awake}
                onValueChange={() => this.changeSettings('app', 'awake')}
              />
            </Right>
          </ListItem>
          <ListItem>
            <Text>Autre</Text>
          </ListItem>
        </List>
      </ScrollView>
    );
  }
}
